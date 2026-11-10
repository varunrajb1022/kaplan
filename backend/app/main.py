import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env', override=False)

from app.config import API_PREFIX, APP_NAME, CORS_ORIGINS
from app.routes.payments import router as payments_router
from app.routes.products import router as products_router
from app.routes.webhooks import router as webhooks_router

load_dotenv()

app = FastAPI(title=APP_NAME, docs_url='/docs' if os.getenv('APP_ENV', 'development').lower() != 'production' else None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get(f'{API_PREFIX}/health')
def health_check():
    return {'status': 'ok', 'service': APP_NAME}


app.include_router(products_router, prefix=API_PREFIX)
app.include_router(payments_router, prefix=API_PREFIX)
app.include_router(webhooks_router, prefix=API_PREFIX)


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('app.main:app', host='0.0.0.0', port=int(os.getenv('PORT', 8000)), reload=True)
