# 15 — Environment Variables

## Frontend (`frontend/.env.example`)

```env
# Public site
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store

# Web pixels (deferred load) — public IDs only
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

# Optional WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=96550000000

# Analytics debug
NEXT_PUBLIC_TRACKING_DEBUG=false
```

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

# Meta CAPI
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_API_VERSION=v21.0
ENABLE_META_CAPI=true

# TikTok CAPI
TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=
TIKTOK_API_VERSION=v1.3
ENABLE_TIKTOK_CAPI=true

# Snap CAPI
SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=
ENABLE_SNAP_CAPI=true

# Optional fraud (v2)
MAXMIND_ACCOUNT_ID=
MAXMIND_LICENSE_KEY=
ENABLE_IP_FRAUD_CHECK=false

LOG_LEVEL=INFO
```

## EasyPanel mapping

| Variable | Service |
|----------|---------|
| All `NEXT_PUBLIC_*` | store |
| All secrets + `DATABASE_URL` | api |

Never put `META_ACCESS_TOKEN` on frontend.
