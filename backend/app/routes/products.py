from fastapi import APIRouter, HTTPException

from app.config import PRODUCT_CATALOG
from app.schemas import ProductResponse

router = APIRouter(prefix='/products', tags=['products'])


@router.get('', response_model=list[ProductResponse])
def list_products():
    return [
        ProductResponse(
            id=product['id'],
            name=product['name'],
            category=product['category'],
            description=product['description'],
            price=product['price'],
            original_price=product['original_price'],
            featured=product.get('featured', False),
        )
        for product in PRODUCT_CATALOG.values()
    ]


@router.get('/{product_id}', response_model=ProductResponse)
def get_product(product_id: str):
    product = PRODUCT_CATALOG.get(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail='Product not found')

    return ProductResponse(
        id=product['id'],
        name=product['name'],
        category=product['category'],
        description=product['description'],
        price=product['price'],
        original_price=product['original_price'],
        featured=product.get('featured', False),
    )
