import hashlib
import logging
import os
import random
import time
from datetime import datetime, timezone

from app.config import ADMIN_EMAIL, FROM_EMAIL, SUPPORT_EMAIL
from app.services.email_templates import (
    build_admin_order_notification_html,
    build_customer_order_confirmation_html,
    build_email_otp_html,
    build_payment_failure_html,
)

logger = logging.getLogger(__name__)

_EMAIL_IDEMPOTENCY_KEYS = set()
_OTP_STORE: dict[str, dict] = {}


def _make_email_key(prefix: str, order_id: str, payment_id: str, recipient: str) -> str:
    return f'{prefix}:{order_id}:{payment_id}:{(recipient or "").lower()}'


def _send_resend_email(recipients: list[str], subject: str, html_content: str, text_content: str) -> dict:
    api_key = os.getenv('RESEND_API_KEY', '')
    sender = os.getenv('FROM_EMAIL', FROM_EMAIL)

    recipients = list(dict.fromkeys((recipient or '').strip() for recipient in recipients if (recipient or '').strip()))
    if not recipients:
        return {'status': 'skipped', 'provider': 'resend', 'reason': 'No email recipients specified'}

    if not api_key:
        logger.info('Resend API key not configured. Simulating email delivery for %s.', recipients)
        return {
            'status': 'simulated',
            'provider': 'resend',
            'message': 'Email delivery was simulated because RESEND_API_KEY is not configured.',
            'recipients': recipients,
            'from': sender,
        }

    payload = {
        'from': sender,
        'to': recipients,
        'subject': subject,
        'html': html_content,
        'text': text_content,
    }

    try:
        import resend

        resend.api_key = api_key
        response = resend.Emails.send(payload)

        email_id = getattr(response, 'id', None)
        if isinstance(response, dict):
            email_id = response.get('id')
        logger.info('Resend email queued successfully: %s', email_id)
        return {'status': 'sent', 'provider': 'resend', 'id': email_id, 'recipients': recipients}
    except Exception as exc:  # pragma: no cover - depends on external email service
        logger.exception('Failed to send email via Resend')
        return {'status': 'failed', 'provider': 'resend', 'error': str(exc), 'recipients': recipients}


def _hash_otp(value: str) -> str:
    return hashlib.sha256(value.strip().encode('utf-8')).hexdigest()


def send_email_otp(email: str) -> dict:
    normalized_email = (email or '').strip().lower()
    if not normalized_email:
        return {'status': 'error', 'message': 'Email is required'}

    otp = str(random.randint(100000, 999999))
    expires_at = int(time.time()) + 600
    _OTP_STORE[normalized_email] = {'otp_hash': _hash_otp(otp), 'expires_at': expires_at, 'verified': False}

    html = build_email_otp_html(normalized_email, otp)
    result = _send_resend_email(
        recipients=[normalized_email],
        subject='Kaplan1 email verification code',
        html_content=html,
        text_content=f'Your Kaplan1 verification code is {otp}. This code expires in 10 minutes.',
    )
    result.update({'email': normalized_email, 'expires_in_seconds': 600})
    return result


def verify_email_otp(email: str, otp: str) -> dict:
    normalized_email = (email or '').strip().lower()
    if not normalized_email:
        return {'status': 'error', 'message': 'Email is required'}

    record = _OTP_STORE.get(normalized_email)
    if not record:
        return {'status': 'error', 'message': 'No OTP was generated for this email'}

    if int(time.time()) > int(record.get('expires_at', 0)):
        _OTP_STORE.pop(normalized_email, None)
        return {'status': 'error', 'message': 'OTP has expired'}

    if _hash_otp(otp) != record.get('otp_hash'):
        return {'status': 'error', 'message': 'Invalid OTP'}

    record['verified'] = True
    _OTP_STORE[normalized_email] = record
    return {'status': 'verified', 'email': normalized_email}


def send_test_email(recipient: str, subject: str = 'Kaplan1 test email') -> dict:
    normalized_recipient = (recipient or '').strip().lower()
    if not normalized_recipient:
        return {'status': 'error', 'message': 'Recipient is required'}

    html = (
        '<html><body>'
        '<h2>Kaplan1 email test</h2>'
        '<p>This is a test email sent from the FastAPI backend using Resend.</p>'
        '</body></html>'
    )
    return _send_resend_email(
        recipients=[normalized_recipient],
        subject=subject,
        html_content=html,
        text_content='This is a Kaplan1 test email sent from the FastAPI backend.',
    )


def send_customer_payment_confirmation(
    customer_name: str,
    customer_email: str,
    product_name: str,
    amount: float,
    currency: str,
    order_id: str,
    payment_id: str,
    payment_date: str | None = None,
) -> dict:
    if not customer_email:
        return {'status': 'skipped', 'reason': 'No customer email provided'}

    key = _make_email_key('customer-confirmation', order_id, payment_id, customer_email)
    if key in _EMAIL_IDEMPOTENCY_KEYS:
        return {'status': 'duplicate', 'reason': 'Customer confirmation email already sent', 'recipient': customer_email}

    support_email = os.getenv('SUPPORT_EMAIL', SUPPORT_EMAIL)
    payment_timestamp = payment_date or datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')

    html = build_customer_order_confirmation_html(
        customer_name=customer_name or 'Customer',
        customer_email=customer_email,
        product_name=product_name,
        amount=amount,
        currency=(currency or 'USD').upper(),
        order_id=order_id,
        payment_id=payment_id,
        payment_date=payment_timestamp,
        support_email=support_email,
    )
    result = _send_resend_email(
        recipients=[customer_email],
        subject=f'Kaplan1 Payment Confirmation - {order_id}',
        html_content=html,
        text_content=(
            f"Hello {customer_name or 'Customer'},\n\n"
            f"Your payment has been confirmed for {product_name}.\n"
            f"Order ID: {order_id}\nPayment ID: {payment_id}\nAmount: {currency} {amount}\n"
            f"Payment date: {payment_timestamp}\n\n"
            f"Contact support: {support_email}"
        ),
    )
    if result.get('status') in {'sent', 'simulated'}:
        _EMAIL_IDEMPOTENCY_KEYS.add(key)
    result.update({'order_id': order_id, 'payment_id': payment_id, 'recipient': customer_email})
    return result


def send_admin_order_notification(
    customer_name: str,
    customer_email: str,
    product_name: str,
    amount: float,
    currency: str,
    order_id: str,
    payment_id: str,
    payment_status: str = 'Paid',
) -> dict:
    admin_email = os.getenv('ADMIN_EMAIL', ADMIN_EMAIL)
    if not admin_email:
        return {'status': 'skipped', 'reason': 'No admin email configured'}

    key = _make_email_key('admin-notification', order_id, payment_id, admin_email)
    if key in _EMAIL_IDEMPOTENCY_KEYS:
        return {'status': 'duplicate', 'reason': 'Admin notification already sent', 'recipient': admin_email}

    html = build_admin_order_notification_html(
        customer_name=customer_name or 'Customer',
        customer_email=customer_email,
        product_name=product_name,
        amount=amount,
        currency=(currency or 'USD').upper(),
        order_id=order_id,
        payment_id=payment_id,
        payment_status=payment_status,
    )
    result = _send_resend_email(
        recipients=[admin_email],
        subject=f'New Kaplan1 order received - {order_id}',
        html_content=html,
        text_content=(
            f"Customer: {customer_name or 'Customer'}\n"
            f"Email: {customer_email}\n"
            f"Product: {product_name}\n"
            f"Order ID: {order_id}\n"
            f"Payment ID: {payment_id}\n"
            f"Payment status: {payment_status}\n"
            f"Amount: {currency} {amount}"
        ),
    )
    if result.get('status') in {'sent', 'simulated'}:
        _EMAIL_IDEMPOTENCY_KEYS.add(key)
    result.update({'order_id': order_id, 'payment_id': payment_id, 'recipient': admin_email})
    return result


def send_payment_failure_email(
    customer_name: str,
    customer_email: str,
    product_name: str,
    amount: float,
    currency: str,
    order_id: str,
    payment_id: str,
    reason: str,
) -> dict:
    if not customer_email:
        return {'status': 'skipped', 'reason': 'No customer email provided'}

    failure_key = _make_email_key('payment-failure', order_id, payment_id, customer_email)
    if failure_key in _EMAIL_IDEMPOTENCY_KEYS:
        return {'status': 'duplicate', 'reason': 'Payment failure email already sent', 'order_id': order_id, 'payment_id': payment_id}

    support_email = os.getenv('SUPPORT_EMAIL', SUPPORT_EMAIL)
    html = build_payment_failure_html(
        customer_name=customer_name or 'Customer',
        customer_email=customer_email,
        product_name=product_name,
        amount=amount,
        currency=(currency or 'USD').upper(),
        order_id=order_id,
        payment_id=payment_id,
        reason=reason,
        support_email=support_email,
    )
    result = _send_resend_email(
        recipients=[customer_email],
        subject=f'Kaplan1 payment issue - {order_id}',
        html_content=html,
        text_content=(
            f"Hello {customer_name or 'Customer'},\n\n"
            f"Your payment for {product_name} was not completed.\n"
            f"Order ID: {order_id}\n"
            f"Payment ID: {payment_id}\n"
            f"Reason: {reason}\n\n"
            f"Please retry the payment or contact support at {support_email}."
        ),
    )
    if result.get('status') in {'sent', 'simulated'}:
        _EMAIL_IDEMPOTENCY_KEYS.add(failure_key)
    result.update({'order_id': order_id, 'payment_id': payment_id, 'recipient': customer_email})
    return result
