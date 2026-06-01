# 13 — Deployment (EasyPanel)

## Services

| Service | Domain | Root | Dockerfile | Port |
|---------|--------|------|------------|------|
| **store** | larabeauty.store | `frontend/` | `frontend/Dockerfile` | 3000 |
| **api** | api.larabeauty.store | `backend/` | `backend/Dockerfile` | 8000 |
| **database** | internal | — | PostgreSQL template | 5432 |

**Git branch:** `main` only.

## Database (existing)

Internal URL (example — use EasyPanel credentials):

```
postgres://larabeauty:PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
```

Set `DATABASE_URL` on **api** service.

## Build & deploy steps

1. Push `main` to GitHub
2. EasyPanel → store → Source → branch `main`, path `frontend`
3. EasyPanel → api → Source → branch `main`, path `backend`
4. Set env from [15-env-variables.md](./15-env-variables.md)
5. Deploy api first (migrations), then store

## CORS (api)

```env
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store
```

## SSL

Enable Let's Encrypt on both domains in EasyPanel.

## Health checks

- Store: `GET /` 200
- API: `GET /health` 200

## Google Sheets

1. Create Sheet from [orders-template.csv](./sheets/orders-template.csv)
2. Extensions → Apps Script → paste [ORDERS_WEBHOOK.gs](./sheets/ORDERS_WEBHOOK.gs)
3. Deploy Web App → Anyone with URL
4. Set `GOOGLE_SHEETS_WEBHOOK_URL` + `SHEETS_WEBHOOK_SECRET` on api

## Post-deploy QA

- [ ] PDP bundle → cart opens
- [ ] Checkout phone validation rejects invalid
- [ ] Upsell 9 KWD works
- [ ] Row in Sheet + row in Postgres
- [ ] Meta test Purchase deduped
- [ ] Mobile RTL layout clean
