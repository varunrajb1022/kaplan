import hashlib
import hmac

import razorpay

from app.config import PRODUCT_CATALOG, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)) if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET else None


def calculate_total(items: list[dict]) -> int:
    total = 0
    for item in items:
        product_id = item.get('productId')
        quantity = int(item.get('quantity', 1))
        product = PRODUCT_CATALOG.get(product_id)
        if product is None:
            raise ValueError(f'Invalid product: {product_id}')
        total += int(product['price']) * quantity
    return total


def create_razorpay_order(items: list[dict]) -> dict:
    if client is None:
        raise RuntimeError('Razorpay credentials are not configured yet.')

    total = calculate_total(items)
    order = client.order.create(
        {
            'amount': total,
            'currency': 'INR',
            'payment_capture': 1,
            'receipt': f'receipt_{hashlib.sha256(str(total).encode()).hexdigest()[:12]}',
        }
    )
    return {'orderId': order['id'], 'amount': total, 'currency': 'INR', 'keyId': RAZORPAY_KEY_ID}


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    if not RAZORPAY_KEY_SECRET:
        return False

    expected = hmac.new(
        bytes(RAZORPAY_KEY_SECRET, 'utf-8'),
        msg=f'{order_id}|{payment_id}'.encode('utf-8'),
        digestmod=hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
