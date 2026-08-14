# 15 — Environment Variables

## Frontend (`frontend/.env.example`)

```env
# Public site
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store

# Google Sheets (server-only on store service)
GOOGLE_SHEETS_WEBHOOK_URL=
SHEETS_WEBHOOK_SECRET=
ORDERS_DATA_DIR=/app/data

# TikTok Events API (server-only — EasyPanel frontend service)
TIKTOK_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=D9V4EIJC77U9RA6QKBL0

# Snap Conversions API v3 (server-only)
SNAP_ACCESS_TOKEN=
SNAP_PIXEL_ID=998e0cce-14e8-4cfb-b55e-e7eea8fe5f25
SNAP_TEST_EVENT_CODE=
```

Browser pixel IDs are hardcoded in `frontend/src/components/marketing/` (not env vars).

## Backend (`backend/.env.example`)

```env
APP_ENV=production
APP_NAME=Lara Beauty API
API_BASE_URL=https://api.larabeauty.store
FRONTEND_URL=https://larabeauty.store
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store

# Database (EasyPanel internal)
DATABASE_URL=postgres://larabeauty:CHANGE_ME@larabeauty_database:5432/larabeauty?sslmode=disable

# Google Sheets Apps Script
GOOGLE_SHEETS_WEBHOOK_URL=
SHEETS_WEBHOOK_SECRET=

# Marketing CAPI: frontend store only — do NOT set TIKTOK_* / SNAP_* on API service

LOG_LEVEL=INFO
```

## EasyPanel mapping

| Variable | Service |
|----------|---------|
| All `NEXT_PUBLIC_*` + `TIKTOK_*` + `SNAP_*` + Sheets secrets | **store (frontend)** |
| `DATABASE_URL` + API secrets | **api (backend)** |

Never put `TIKTOK_ACCESS_TOKEN` or `SNAP_ACCESS_TOKEN` on the backend API service.
