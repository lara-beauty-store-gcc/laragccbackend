# 07 — Backend Specification (FastAPI)

## Stack

| Package | Purpose |
|---------|---------|
| fastapi | API framework |
| uvicorn[standard] | ASGI server |
| sqlalchemy 2 | ORM |
| alembic | Migrations |
| pydantic v2 | Schemas |
| httpx | Async CAPI + Sheets HTTP |
| python-dotenv | Env |

## App entry

`backend/app/main.py`:

- Lifespan: run Alembic upgrade on startup (`alembic upgrade head`)
- CORS middleware
- Routers: health, orders, events

## Routers

### `POST /api/v1/orders`

Creates order after frontend upsell step.

**Request body:** see [checkout-cod-flow.md](./10-checkout-cod-flow.md)

**Actions:**

1. Validate Kuwait phone → E.164 `+965XXXXXXXX`
2. Insert DB transaction
3. Fire CAPI Purchase (async task, don't block >2s — use background task)
4. POST Google Apps Script webhook
5. Return `{ orderId, success: true }`

### `GET /health`

`{ "status": "ok", "db": true }`

## Services

```
app/services/
  phone.py           # normalize + validate KW
  hashing.py         # sha256 for CAPI PII
  sheets.py          # forward to GOOGLE_SHEETS_WEBHOOK_URL
  capi/
    meta.py
    tiktok.py
    snap.py
    dedup.py         # event_id store optional Redis/DB
```

## Migrations on start

`docker-entrypoint.sh`:

```bash
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Or FastAPI lifespan hook.

## Dockerfile

- Python 3.11-slim
- Expose **8000** (EasyPanel maps to api.larabeauty.store)
- Non-root user

## Legacy note

Root-level Node `src/` may exist — **new work goes in `backend/`**. Remove or archive Node after FastAPI parity.

## Logging

Structured JSON logs: order_id, event_id, capi_status, sheet_status.

## Idempotency

Accept header `Idempotency-Key: {uuid}` on POST orders — ignore duplicate within 24h.
