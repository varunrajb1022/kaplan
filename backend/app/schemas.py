from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class CartItem(BaseModel):
    productId: str = Field(..., alias='productId')
    quantity: int = Field(default=1, ge=1)


class OrderCreateRequest(BaseModel):
    items: List[CartItem]


class PaymentVerifyRequest(BaseModel):
    order_id: str
    payment_id: str
    signature: str
    email: str = Field(..., min_length=1)
    customer_name: str | None = None
    amount: int | float | None = None
    currency: str | None = None
    product_name: str | None = None
    otp: str | None = None

    @field_validator('email')
    @classmethod
    def validate_email(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned or '@' not in cleaned or '.' not in cleaned.split('@')[-1]:
            raise ValueError('Email is required and must be valid')
        return cleaned

    @field_validator('customer_name')
    @classmethod
    def validate_customer_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None


class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    description: str
    price: int
    original_price: int
    featured: bool = False
