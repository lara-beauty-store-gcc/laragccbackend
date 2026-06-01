# Fin tjib kol secret (EasyPanel Environment)

Ma nقدرش n3tik **META_ACCESS_TOKEN**, **TIKTOK_ACCESS_TOKEN**, wla **password DB** — ma kaynach f GitHub. Copy mn dashboards dyalek.

## DATABASE_URL

1. EasyPanel → project **larabeauty** → **+ Service** → **PostgreSQL** (smiya: `postgres`)
2. Copy **password** mn service page
3. Badel f env:

```env
DATABASE_URL=postgres://postgres:TON_PASSWORD@larabeauty_postgres:5432/larabeauty
```

Ila project smito khra, badel `larabeauty` b `$(PROJECT_NAME)`.

## GOOGLE_SHEETS_WEBHOOK_URL + SHEETS_WEBHOOK_SECRET

1. Google Sheet → Extensions → Apps Script
2. Web App deploy (POST, Anyone)
3. URL → `GOOGLE_SHEETS_WEBHOOK_URL`
4. Secret random → `SHEETS_WEBHOOK_SECRET` (nfs value f script)

## META (Facebook)

1. [Meta Events Manager](https://business.facebook.com/events_manager)
2. Pixel dyalek → **Settings** → **Conversions API**
3. `META_PIXEL_ID` = Pixel ID
4. **Generate access token** → `META_ACCESS_TOKEN`

## TikTok

1. TikTok Ads Manager → **Assets** → **Events** → Web Pixel
2. `TIKTOK_PIXEL_CODE` = Pixel ID
3. Settings → **Generate access token** → `TIKTOK_ACCESS_TOKEN`

## Snapchat

1. Snapchat Ads → **Events Manager**
2. `SNAP_PIXEL_ID` + CAPI token → `SNAP_ACCESS_TOKEN`

## MaxMind

1. [maxmind.com](https://www.maxmind.com) → minFraud
2. `MAXMIND_ACCOUNT_ID` + `MAXMIND_LICENSE_KEY`

## Stores okhra

Duplicate `easypanel.env` w badel ghir:

- `FRONTEND_URL` / `CORS_ORIGINS` → domain dyal store
- Pixel IDs w tokens dyal dak store
- `WHITELISTED_PHONES` test numbers dyalek

`API_BASE_URL=https://$(PRIMARY_DOMAIN)` — khalliha haka f kol store (domain dyal backend service).
