import os
import unittest
from types import SimpleNamespace

from app.services import email_service


class SendLibertyEmailServiceTests(unittest.TestCase):
    def test_send_email_otp_uses_sendliberty(self):
        calls = {}

        def fake_post(url, headers, payload, timeout):
            calls['url'] = url
            calls['headers'] = headers
            calls['json'] = payload
            return SimpleNamespace(
                status_code=200,
                ok=True,
                content=b'{"status":"sent","id":"msg_123"}',
                text='{"status":"sent","id":"msg_123"}',
                json=lambda: {'status': 'sent', 'id': 'msg_123'},
            )

        os.environ['SENDLIBERTY_API_KEY'] = 'test-api-key'
        os.environ['SENDLIBERTY_FROM_EMAIL'] = 'alerts@kaplan1.com'
        original = getattr(email_service, '_post_sendliberty_email', None)
        email_service._post_sendliberty_email = fake_post
        try:
            result = email_service.send_email_otp('student@example.com')
        finally:
            if original is None:
                delattr(email_service, '_post_sendliberty_email')
            else:
                email_service._post_sendliberty_email = original
            os.environ.pop('SENDLIBERTY_API_KEY', None)
            os.environ.pop('SENDLIBERTY_FROM_EMAIL', None)

        self.assertEqual(result['status'], 'sent')
        self.assertEqual(result['provider'], 'sendliberty')
        self.assertEqual(calls['url'], 'https://sendliberty.com/api/send')
        self.assertEqual(calls['headers']['X-API-Key'], 'test-api-key')
        self.assertEqual(calls['json']['from'], 'alerts@kaplan1.com')
        self.assertEqual(calls['json']['to'], ['student@example.com'])


if __name__ == '__main__':
    unittest.main()
