import os
from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, HTTPException

from app.config import APP_ENV, PRODUCT_CATALOG, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
from app.schemas import OrderCreateRequest, PaymentVerifyRequest
from app.services.email_service import (
    send_admin_order_notification,
    send_customer_payment_confirmation,
    send_email_otp,
    send_payment_failure_email,
    send_test_email,
    verify_email_otp,
)
from app.services.razorpay_service import create_razorpay_order, verify_payment_signature

router = APIRouter(prefix='/payments', tags=['payments'])


@router.get('/health')
def payment_health():
    return {'status': 'ok'}


@router.post('/create-order')
def create_order(request: OrderCreateRequest):
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=503,
            detail='Payments are coming soon. Razorpay credentials are not configured yet.',
        )

    items = [item.model_dump() for item in request.items]
    total_amount = Decimal('0')
    for item in items:
        product = PRODUCT_CATALOG.get(item['productId'])
        if product is None:
            raise HTTPException(status_code=400, detail=f'Invalid product: {item["productId"]}')
        price = Decimal(str(product['price']))
        total_amount += (price * Decimal('100')) * Decimal(int(item['quantity']))

    total_amount = total_amount.quantize(Decimal('1'), rounding=ROUND_HALF_UP)
    if total_amount <= 0:
        raise HTTPException(status_code=400, detail='Order total must be greater than zero')

    result = create_razorpay_order(items)
    return result


@router.post('/email/send-otp')
def send_otp(payload: dict):
    email = str(payload.get('email', '')).strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail='Email is required')
    return send_email_otp(email)


@router.post('/email/verify-otp')
def verify_otp(payload: dict):
    email = str(payload.get('email', '')).strip().lower()
    otp = str(payload.get('otp', '')).strip()
    if not email or not otp:
        raise HTTPException(status_code=400, detail='Email and OTP are required')
    return verify_email_otp(email, otp)


@router.post('/email/test')
def test_email(payload: dict):
    if APP_ENV == 'production':
        raise HTTPException(status_code=403, detail='Test email endpoint is disabled in production.')

    recipient = str(payload.get('recipient', '')).strip()
    if not recipient:
        raise HTTPException(status_code=400, detail='Recipient email is required.')

    return send_test_email(recipient, subject=str(payload.get('subject', 'Kaplan1 test email')))


@router.post('/verify')
def verify_payment(payload: PaymentVerifyRequest):
    if payload.otp:
        otp_result = verify_email_otp(payload.email, payload.otp)
        if otp_result.get('status') != 'verified':
            raise HTTPException(status_code=400, detail='Email OTP verification failed')

    is_valid = verify_payment_signature(payload.order_id, payload.payment_id, payload.signature)
    if not is_valid:
        send_payment_failure_email(
            customer_name=payload.customer_name or 'Customer',
            customer_email=payload.email,
            product_name=payload.product_name or 'Course purchase',
            amount=payload.amount or 0,
            currency=(payload.currency or 'USD').upper(),
            order_id=payload.order_id,
            payment_id=payload.payment_id,
            reason='Payment signature verification failed.',
        )
        raise HTTPException(status_code=400, detail='Invalid payment signature')

    order_amount = payload.amount or 0
    order_currency = (payload.currency or 'USD').upper()
    product_name = payload.product_name or 'Course purchase'

    customer_status = send_customer_payment_confirmation(
        customer_name=payload.customer_name or 'Customer',
        customer_email=payload.email,
        product_name=product_name,
        amount=order_amount,
        currency=order_currency,
        order_id=payload.order_id,
        payment_id=payload.payment_id,
    )
    admin_status = send_admin_order_notification(
        customer_name=payload.customer_name or 'Customer',
        customer_email=payload.email,
        product_name=product_name,
        amount=order_amount,
        currency=order_currency,
        order_id=payload.order_id,
        payment_id=payload.payment_id,
    )

    return {
        'verified': True,
        'order_id': payload.order_id,
        'payment_id': payload.payment_id,
        'email_status': {
            'customer': customer_status,
            'admin': admin_status,
        },
    }
