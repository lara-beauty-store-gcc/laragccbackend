# EasyPanel — Lara Beauty API (Backend)

## Settings (copy exactly)

| Field | Value |
|-------|--------|
| Repository | `lara-beauty-store-gcc/laragccbackend` |
| Branch | **`backend`** |
| Build Path | **`/`** |
| Dockerfile | `Dockerfile` |
| Proxy port | **`8000`** |
| Health check | **`/health`** |

**Not** port 3000 — that is the Store service.

## Required environment

```
PORT=8000
NODE_ENV=production
DATABASE_URL=postgresql://...
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
FRONTEND_URL=https://larabeauty.store
CORS_ORIGINS=https://larabeauty.store
```

## Verify after deploy

```bash
curl https://api.larabeauty.store/health
```

Expected: `"status":"ok"` and `"sheets":true`

## Duplicate rows (order twice in sheet)

The **Store** already sends orders to Google Sheets. If the **API** also writes, you get **2 rows**.

This API build **skips** sheet writes when `sourceUrl` is `larabeauty.store` (automatic).

Optional env override:

```
SHEETS_SINGLE_WRITER=store
```

Also update **Apps Script** in Google Sheet (paste `ORDERS_WEBHOOK.gs` → Deploy) to block near-duplicates.

## If build fails

1. Branch must be **`backend`** (not `main` or `frontend`)
2. Build Path must be **`/`** (empty or slash only)
3. Do not set Build Path to `backend` — there is no subfolder on this branch
