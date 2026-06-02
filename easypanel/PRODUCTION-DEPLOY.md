# Lara Beauty — production deploy (EasyPanel)

Use **one repository** for store and API:

| | |
|--|--|
| **Repository** | `https://github.com/lara-beauty-store-gcc/laragccbackend` |
| **Branch** | `main` |
| **Wrong repo** | `laragccfrontend` — do not connect this in EasyPanel |

After changing settings: **Rebuild** both services, then **Redeploy**.

---

## 1. Store (Next.js)

| Setting | Value |
|---------|--------|
| Source path | `frontend` |
| Dockerfile file | `Dockerfile` (inside `frontend/`, not `frontend/Dockerfile` as path) |
| Domains proxy port | **3000** |
| Domain | `larabeauty.store` |

**Environment variables:**

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
```

**Health (inside container):** `GET /api/health` on port 3000.

---

## 2. API (Node / Express)

| Setting | Value |
|---------|--------|
| Source path | `backend` |
| Dockerfile file | `Dockerfile` |
| Domains proxy port | **8000** |
| Domain | `api.larabeauty.store` |

**If Source path is empty** (repo root), the root `Dockerfile` builds the API from `backend/` — still use proxy port **8000**.

**Environment variables:**

```env
APP_ENV=production
PORT=8000
FRONTEND_URL=https://larabeauty.store
API_BASE_URL=https://api.larabeauty.store
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store
DATABASE_URL=postgres://larabeauty:YOUR_PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
```

Optional: `GOOGLE_SHEETS_WEBHOOK_URL`, Meta/TikTok/Snap CAPI keys — see `backend/.env.example`.

**Health:** `GET /health` on port 8000.

---

## 3. DNS (Cloudflare)

Without A records, the site shows “not reachable” even if containers are healthy.

| Type | Name | Content |
|------|------|---------|
| A | `@` | Your server IP |
| A | `api` | Same server IP |

Proxy: grey cloud (DNS only) or orange — both work if SSL is configured in EasyPanel.

Guide: [`docs/CLOUDFLARE-DNS-FIX.md`](../docs/CLOUDFLARE-DNS-FIX.md)

---

## 4. Post-deploy checks

```bash
curl -s https://api.larabeauty.store/health
curl -s https://larabeauty.store/api/health
```

Browser:

- https://larabeauty.store/
- https://larabeauty.store/products/magnesium-sleep
- https://larabeauty.store/products/epimedium-energy
- https://larabeauty.store/products/focus-clarity

Place a test COD order; confirm API returns `orderNumber` and total matches bundle (16 / 21 / 29 KWD).

---

## 5. “Service is not reachable”

| Symptom | Fix |
|---------|-----|
| Wrong proxy port | Store **3000**, API **8000** |
| Wrong source path | Store → `frontend`, API → `backend` |
| Wrong repo | Switch to `laragccbackend` |
| Build failed | Open build logs; ensure `npm run build` succeeds |
| DNS | Add Cloudflare A records |
| CORS on checkout | Set `CORS_ORIGINS` and `FRONTEND_URL` on API |

---

## 6. Monorepo layout

```
laragccbackend/
├── frontend/     → store (port 3000)
├── backend/      → API (port 8000)
├── Dockerfile    → API when source path is empty
└── Dockerfile.store → store when source path is empty (use frontend/ instead)
```

Develop on `main`; CI syncs `lara-frontend` / `lara-backend` deploy branches on push.
