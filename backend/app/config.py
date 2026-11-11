import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / '.env', override=False)

APP_NAME = os.getenv('APP_NAME', 'Course Commerce API')
API_PREFIX = os.getenv('API_PREFIX', '/api')
APP_ENV = os.getenv('APP_ENV', 'development').lower()

RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '')
RAZORPAY_WEBHOOK_SECRET = os.getenv('RAZORPAY_WEBHOOK_SECRET', '')
FRONTEND_URL = os.getenv('FRONTEND_URL', '').strip()
CORS_ORIGINS = [
    origin.strip()
    for origin in (os.getenv('CORS_ORIGINS', '') + (f',{FRONTEND_URL}' if FRONTEND_URL else '')).split(',')
    if origin.strip()
]
if not CORS_ORIGINS:
    CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

FROM_EMAIL = os.getenv('FROM_EMAIL', 'your-gmail-address@gmail.com')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'your-gmail-address@gmail.com')
SUPPORT_EMAIL = os.getenv('SUPPORT_EMAIL', 'support@kaplan1.com')

SENDLIBERTY_API_KEY = os.getenv('SENDLIBERTY_API_KEY', '').strip()
SENDLIBERTY_BASE_URL = os.getenv('SENDLIBERTY_BASE_URL', 'https://sendliberty.com').rstrip('/')
SENDLIBERTY_FROM_EMAIL = os.getenv('SENDLIBERTY_FROM_EMAIL', os.getenv('EMAIL_FROM', FROM_EMAIL)).strip()

PRODUCT_CATALOG = {
    'qbank': {
        'id': 'qbank',
        'name': 'Qbank',
        'category': 'Qbank',
        'price': 14000,
        'original_price': 19900,
        'featured': True,
        'description': 'Question bank, exam-style questions, and analytics suite.',
    },
    'test-product': {
        'id': 'test-product',
        'name': 'Test Product',
        'category': 'Testing',
        'price': 0.011,
        'original_price': 0.02,
        'featured': True,
        'description': 'Small-value test item for validating live Razorpay checkout in a safe, minimum-payment flow.',
    },
    'flextrack': {
        'id': 'flextrack',
        'name': 'FlexTrack Course',
        'category': 'Course',
        'price': 146000,
        'original_price': 199000,
        'featured': True,
        'description': 'Self-paced learning with video modules and progress tracking.',
    },
    'live-online': {
        'id': 'live-online',
        'name': 'Live Online',
        'category': 'Live',
        'price': 280000,
        'original_price': 399900,
        'featured': True,
        'description': 'Live instruction, workshops, and recorded review sessions.',
    },
    'private-tutoring': {
        'id': 'private-tutoring',
        'name': 'Private Tutoring + Live Online',
        'category': 'Premium',
        'price': 649900,
        'original_price': 999900,
        'featured': True,
        'description': 'One-to-one coaching and tailored study plans.',
    },
}
