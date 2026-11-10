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

RESEND_API_KEY = os.getenv('RESEND_API_KEY', '')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'your-resend-account@email.com')
SUPPORT_EMAIL = os.getenv('SUPPORT_EMAIL', 'support@kaplan1.com')

EMAIL_HOST = os.getenv('EMAIL_HOST', '')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USERNAME = os.getenv('EMAIL_USERNAME', '')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')
EMAIL_FROM = os.getenv('EMAIL_FROM', 'onboarding@resend.dev')

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
    'flextrack': {
        'id': 'flextrack',
        'name': 'FlexTrack Course',
        'category': 'Course',
        'price': 156000,
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
