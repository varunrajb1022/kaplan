from pathlib import Path
from string import Template


def format_currency_for_email(amount, currency='USD'):
    try:
        numeric_amount = float(amount)
    except (TypeError, ValueError):
        return f'{currency} 0.00'

    return f'{currency} {numeric_amount:,.2f}'


def _read_template(filename: str) -> str:
    template_path = Path(__file__).resolve().parent.parent / 'templates' / 'emails' / filename
    return template_path.read_text(encoding='utf-8')


def build_customer_order_confirmation_html(
    customer_name: str,
    customer_email: str,
    product_name: str,
    amount: float,
    currency: str,
    order_id: str,
    payment_id: str,
    payment_date: str,
    support_email: str,
) -> str:
    template = Template(_read_template('payment_success.html'))
    return template.substitute(
        customer_name=customer_name or 'Customer',
        customer_email=customer_email,
        product_name=product_name,
        amount=format_currency_for_email(amount, currency),
        currency=(currency or 'USD').upper(),
        order_id=order_id,
        payment_id=payment_id,
        payment_date=payment_date,
        support_email=support_email,
    )


def build_admin_order_notification_html(
    customer_name: str,
    customer_email: str,
    product_name: str,
    amount: float,
    currency: str,
    order_id: str,
    payment_id: str,
    payment_status: str,
) -> str:
    template = Template(_read_template('admin_order_notification.html'))
    return template.substitute(
        customer_name=customer_name or 'Customer',
        customer_email=customer_email,
        product_name=product_name,
        amount=format_currency_for_email(amount, currency),
        currency=(currency or 'USD').upper(),
        order_id=order_id,
        payment_id=payment_id,
        payment_status=payment_status,
    )


def build_payment_failure_html(
    customer_name: str,
    customer_email: str,
    product_name: str,
    amount: float,
    currency: str,
    order_id: str,
    payment_id: str,
    reason: str,
    support_email: str,
) -> str:
    template = Template(_read_template('payment_failed.html'))
    return template.substitute(
        customer_name=customer_name or 'Customer',
        customer_email=customer_email,
        product_name=product_name,
        amount=format_currency_for_email(amount, currency),
        currency=(currency or 'USD').upper(),
        order_id=order_id,
        payment_id=payment_id,
        reason=reason,
        support_email=support_email,
    )


def build_email_otp_html(email: str, otp: str) -> str:
    return f"""
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email verification</title>
      </head>
      <body style="margin:0; padding:0; font-family:Arial, Helvetica, sans-serif; background:#f6f5f4; color:#111827;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f4; padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background:#ffffff; border:1px solid #e5e7eb; border-radius:20px; overflow:hidden;">
                <tr>
                  <td style="background:#2d1147; padding:24px 32px; color:#ffffff; font-size:24px; font-weight:700;">
                    Kaplan1 email verification
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 20px; font-size:16px; color:#374151; line-height:1.6;">
                      Use the code below to verify your email before completing checkout.
                    </p>
                    <div style="padding:20px 24px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; text-align:center; font-size:32px; font-weight:700; letter-spacing:6px; color:#111827;">{otp}</div>
                    <p style="margin:20px 0 0; font-size:14px; color:#4b5563; line-height:1.6;">
                      This code is valid for 10 minutes. If you did not request it, you can ignore this email. Your email is: {email}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """
