# Marketing Pixels & Events API — Backend Brief

> **Résumé:** Kol TikTok w Snap tracking (browser + server CAPI) kaykhdem mn **frontend** `larabeauty.store`. Backend `api.larabeauty.store` ma 3nd-h 7ta 7aja y-zid — ghir ybqa y-service orders API fallback b7al daba.

## 1. Architecture

```
Customer (browser)
       ↓
larabeauty.store  ← FRONTEND (Next.js · EasyPanel · port 3000)
       │
       ├── Browser Pixels (JavaScript f <head>)
       │     • TikTok Pixel  → D9V4EIJC77U9RA6QKBL0
       │     • Snap Pixel    → 998e0cce-14e8-4cfb-b55e-e7eea8fe5f25
       │
       └── /api/orders (server routes f frontend)
             ├── Google Sheets webhook
             ├── TikTok Events API (CAPI) — server-side
             └── Snap Conversions API v3  — server-side

api.larabeauty.store  ← BACKEND (Express · port 8000)
       └── Fallback orders ila Sheets ma khdem-sh
       └── ❌ MA KAYN-SH TikTok / Snap pixels hna
```

## 2. Browser Pixels (client-side)

| Platform | Pixel ID | File |
|----------|----------|------|
| TikTok | `D9V4EIJC77U9RA6QKBL0` | `frontend/src/components/marketing/TikTokPixel.tsx` |
| Snap | `998e0cce-14e8-4cfb-b55e-e7eea8fe5f25` | `frontend/src/components/marketing/SnapPixel.tsx` |

Loaded f `<head>` dyal kol page via `frontend/src/app/layout.tsx`.

| Event | Trigger |
|-------|---------|
| PAGE_VIEW | Kol page (Snap + TikTok) |
| VIEW_CONTENT | Product page |
| ADD_CART | Add to cart |
| START_CHECKOUT / Lead | Checkout submit |
| PURCHASE | Thank-you page |

Tracking logic: `frontend/src/lib/tracking.ts`

## 3. Server-side CAPI — frontend `/api/orders`

Ba3d order success (Google Sheet synced), frontend kay-fire automatic:

| Platform | Endpoint | Event | Code |
|----------|----------|-------|------|
| TikTok | `https://business-api.tiktok.com/open_api/v1.3/event/track/` | CompletePayment | `frontend/src/lib/tiktok-capi.ts` |
| Snap | `https://tr.snapchat.com/v3/{PIXEL_ID}/events` | PURCHASE | `frontend/src/lib/snap-capi.ts` |

Called from: `frontend/src/app/api/orders/route.ts`

**Dedup:** `event_id = purchase_{orderId}` — browser + server kay-st3mlo nfs ID.

## 4. EasyPanel env vars — FRONTEND service only

Had vars khass-hom ykonu f EasyPanel → **larabeauty → frontend** (ma f backend):

```env
# === Site ===
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
ORDERS_DATA_DIR=/app/data

# === TikTok Events API (server-only) ===
TIKTOK_ACCESS_TOKEN=<secret>
TIKTOK_PIXEL_ID=D9V4EIJC77U9RA6QKBL0

# === Snap Conversions API (server-only) ===
SNAP_ACCESS_TOKEN=<secret>
SNAP_PIXEL_ID=998e0cce-14e8-4cfb-b55e-e7eea8fe5f25
SNAP_TEST_EVENT_CODE=
```

⚠️ Tokens server-only — **ma t-commitiw-hom-sh** f GitHub. Set in EasyPanel only.

## 5. Backend — chno khass-kom

| Task | Khass backend? |
|------|----------------|
| TikTok / Snap pixels | ❌ La |
| TikTok / Snap CAPI | ❌ La |
| Orders API fallback | ✅ Deja kayn |
| UAE phone validation | ✅ Deja kayn |
| Google Sheets (optional) | ✅ Ila configured |

**Ma tzido-sh:** `TIKTOK_*`, `SNAP_*`, pixel scripts, wla CAPI calls.

Ila order kaymchi via backend fallback (`source: "api"`), CAPI ghadi y-fire mn frontend ba3d success — backend ma kay-send-sh events l TikTok/Snap.

## 6. Order flow

1. Customer → checkout f `larabeauty.store`
2. `POST /api/orders` (frontend Next.js)
3. Google Sheets webhook (primary)
   - Success → persist local + fire TikTok CAPI + Snap CAPI
   - Fail → fallback `POST api.larabeauty.store/api/v1/orders`
4. Redirect → `/thank-you`
5. Browser fires PURCHASE (TikTok + Snap pixels)

Backend involved ghir f step 3 fallback — w hta hna ma kay-touch-sh marketing.

## 7. Files f repo

```
frontend/src/
├── components/marketing/
│   ├── TikTokPixel.tsx
│   ├── SnapPixel.tsx
│   └── MarketingPixels.tsx
├── lib/
│   ├── tracking.ts
│   ├── tiktok-capi.ts
│   └── snap-capi.ts
└── app/
    ├── layout.tsx
    └── api/orders/route.ts

frontend/docs/backend-patch/orders.js  ← reference only (NOT deployed on backend)
```

## 8. Verify

```bash
curl https://larabeauty.store/api/health
```

- Browser DevTools → Network: `analytics.tiktok.com/i18n/pixel/events.js`, `sc-static.net/scevent.min.js`
- Snap/TikTok Ads Manager → Test Events → dir test order → chouf PURCHASE event

## 9. Questions?

Ila 3ndk questions specific (duplicate events, fallback path), contact frontend team. Had doc kafi bach t3rf fin ma t-touch-sh.
