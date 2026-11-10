import json

from fastapi import APIRouter, Header, HTTPException, Request

from app.config import ADMIN_EMAIL, RAZORPAY_WEBHOOK_SECRET
from app.services.email_service import (
    send_admin_order_notification,
    send_customer_payment_confirmation,
    send_payment_failure_email,
)
from app.utils.security import verify_webhook_signature

router = APIRouter(prefix='/webhooks', tags=['webhooks'])

processed_events = set()


def _extract_order_details(event):
    payload = event.get('payload', {})
    payment_entity = payload.get('payment', {}).get('entity', {})
    order_entity = payload.get('order', {}).get('entity', {})
    order_id = payment_entity.get('order_id') or order_entity.get('id') or payment_entity.get('id') or 'unknown-order'
    payment_id = payment_entity.get('id') or 'unknown-payment'
    amount = payment_entity.get('amount') or order_entity.get('amount') or 0
    currency = (payment_entity.get('currency') or order_entity.get('currency') or 'USD').upper()
    customer_email = payment_entity.get('email') or order_entity.get('email') or ADMIN_EMAIL
    customer_name = payment_entity.get('name') or order_entity.get('customer_name') or 'Customer'
    product_name = payment_entity.get('notes', {}).get('product_name') or 'Course purchase'
    return {
        'order_id': order_id,
        'payment_id': payment_id,
        'amount': int(amount) / 100 if isinstance(amount, int) and amount > 0 else amount,
        'currency': currency,
        'customer_email': customer_email,
        'customer_name': customer_name,
        'product_name': product_name,
    }


@router.post('/razorpay')
async def razorpay_webhook(request: Request, x_razorpay_signature: str = Header(default='')):
    if not RAZORPAY_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail='Webhook secret not configured')

    payload = await request.body()
    if not verify_webhook_signature(payload, x_razorpay_signature, RAZORPAY_WEBHOOK_SECRET):
        raise HTTPException(status_code=400, detail='Invalid webhook signature')

    event = json.loads(payload)
    event_name = event.get('event')
    payment_entity = event.get('payload', {}).get('payment', {}).get('entity', {})
    payment_id = payment_entity.get('id', '')
    event_id = f'{event_name}:{payment_id}'

    if event_id in processed_events:
        return {'status': 'duplicate', 'message': 'Event already processed'}

    processed_events.add(event_id)

    if event_name in {'payment.captured', 'order.paid'}:
        order_details = _extract_order_details(event)
        send_customer_payment_confirmation(
            customer_name=order_details['customer_name'],
            customer_email=order_details['customer_email'],
            product_name=order_details['product_name'],
            amount=order_details['amount'],
            currency=order_details['currency'],
            order_id=order_details['order_id'],
            payment_id=order_details['payment_id'],
        )
        send_admin_order_notification(
            customer_name=order_details['customer_name'],
            customer_email=order_details['customer_email'],
            product_name=order_details['product_name'],
            amount=order_details['amount'],
            currency=order_details['currency'],
            order_id=order_details['order_id'],
            payment_id=order_details['payment_id'],
        )
        return {'status': 'success', 'message': 'Payment captured', 'payment_id': payment_id}
    if event_name == 'payment.failed':
        order_details = _extract_order_details(event)
        send_payment_failure_email(
            customer_name=order_details['customer_name'],
            customer_email=order_details['customer_email'],
            product_name=order_details['product_name'],
            amount=order_details['amount'],
            currency=order_details['currency'],
            order_id=order_details['order_id'],
            payment_id=order_details['payment_id'],
            reason='Razorpay reported a failed payment.',
        )
        return {'status': 'failed', 'message': 'Payment failed', 'payment_id': payment_id}

    return {'status': 'ignored', 'message': 'Unhandled event type'}
