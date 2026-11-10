import hashlib
import hmac


def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(bytes(secret, 'utf-8'), msg=payload, digestmod=hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
