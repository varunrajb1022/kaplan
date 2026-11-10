# Professional Educational Course Website

This repository contains a full-stack educational course storefront inspired by premium USMLE prep websites, but built with an original brand identity and no copyrighted logos or proprietary assets.

## Project structure

- frontend/ - React + Vite + Tailwind storefront
- backend/ - FastAPI API for product catalog and Razorpay integration

## Frontend development

1. Open the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Copy the environment file and update the API base if needed:
   ```bash
   cp .env.example .env
   ```

## Backend development

1. Open the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install requirements:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   python -m pip install -r requirements.txt
   ```
3. Copy environment vars:
   ```bash
   copy .env.example .env
   ```
4. Add your Razorpay keys in `.env`.
5. Start the API:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API overview

- `GET /api/health`
- `GET /api/products`
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `POST /api/webhooks/razorpay`

## Deployment notes

### Frontend (Vercel)

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  - `VITE_API_BASE_URL=https://your-backend-url/api`

### Backend (Render)

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
- Environment variables:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`
  - `CORS_ORIGINS=https://your-frontend-domain.com`

## Payment flow

1. Customer adds products to cart.
2. Frontend sends items to the backend.
3. Backend validates product IDs and computes total.
4. Backend creates a Razorpay order.
5. Frontend opens a Razorpay Checkout modal.
6. Backend verifies the payment signature after completion.
7. Webhooks reconcile captured or failed payment events.

> This project uses demo/mock checkout behavior in local frontend development until valid Razorpay test credentials are configured.
