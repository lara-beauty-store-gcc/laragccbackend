# 01 — Architecture

## High-level diagram

```mermaid
flowchart TB
  subgraph client [Browser]
    Store[Next.js Store larabeauty.store]
    Pixels[Deferred Web Pixels Meta TikTok Snap]
  end

  subgraph api [api.larabeauty.store]
    FastAPI[FastAPI]
    CAPI[CAPI Services]
    Orders[Orders API]
  end

  subgraph data [EasyPanel]
    PG[(PostgreSQL larabeauty)]
    Sheets[Google Sheets via Apps Script]
  end

  Store -->|REST JSON| FastAPI
  Store --> Pixels
  Pixels -.->|event_id dedup| CAPI
  FastAPI --> PG
  FastAPI -->|POST webhook| Sheets
  FastAPI --> CAPI
```

## Repository structure

```
laragccbackend/                    # GitHub repo name (keep or rename later)
├── frontend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── next.config.mjs
│   ├── public/
│   │   ├── placeholders/          # SVG sample product/hero images
│   │   └── logo.svg               # placeholder until real logo
│   └── src/
│       ├── app/                   # App Router pages
│       ├── components/
│       ├── config/                # brand, products, offers (single source)
│       ├── lib/                   # tracking, cart, api client, phone utils
│       └── types/
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── requirements.txt
│   ├── alembic/
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── db/
│       ├── models/
│       ├── schemas/
│       ├── routers/
│       │   ├── orders.py
│       │   ├── events.py          # CAPI relay
│       │   └── health.py
│       └── services/
│           ├── capi/              # meta, tiktok, snap
│           ├── sheets.py
│           └── phone.py
└── docs/                          # Specifications (this folder)
```

## API boundaries

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Liveness |
| `/api/v1/orders` | POST | Create COD order (after upsell decision) |
| `/api/v1/events/{event}` | POST | Optional server CAPI from frontend |
| `/api/v1/tracking/purchase` | POST | Purchase + CAPI + sheet (preferred single call) |

Frontend should **not** hold CAPI access tokens in client bundles. Send purchase payload to backend; backend fires CAPI.

## Data flow — order

1. User completes checkout popup → optional upsell (9 KWD)
2. Frontend builds `order` object → `POST /api/v1/orders`
3. Backend: validate phone → insert `orders` + `order_items` → hash PII → send CAPI → POST Google Apps Script URL
4. Return `{ orderId, success }` → redirect `/thank-you?order=...`
5. Frontend fires **web pixels** with same `event_id` as backend CAPI

## Database connection (EasyPanel internal)

```
postgres://larabeauty:larabeauty@larabeauty_database:5432/larabeauty?sslmode=disable
```

Use env `DATABASE_URL` — never commit real passwords to git (example only).

## Security

- CORS: allow `https://larabeauty.store` only (plus localhost in dev)
- Rate limit `POST /orders` (e.g. 10/min per IP)
- `SHEETS_WEBHOOK_SECRET` shared with Apps Script
- Sanitize all inputs; no stack traces in production

## Performance

- Next.js static/ISR where possible for marketing pages
- Images: `next/image`, WebP, lazy load
- Pixels: `strategy="lazyOnload"` or Partytown — see [tracking-pixels-capi.md](./09-tracking-pixels-capi.md)
- API p95 &lt; 300ms for order create (excluding external CAPI/Sheet)
