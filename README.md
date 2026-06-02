# Lara Beauty — لارا للجمال

Kuwait DTC gummy store · **larabeauty.store** · COD only · KWD

## Documentation (for AI coder / team)

**Start here:** [`docs/README.md`](./docs/README.md)

**Copy-paste prompt for AI coder:** [`docs/prompts/AI_CODER_START_PROMPT.md`](./docs/prompts/AI_CODER_START_PROMPT.md)

Full spec includes: architecture, CRO, Kuwaiti copy, design system, FastAPI backend, Next.js frontend, pixels/CAPI, Google Sheets, EasyPanel deploy.

## Target stack (per docs)

| Folder | Stack | Domain |
|--------|-------|--------|
| `frontend/` | Next.js 14, React, Tailwind | larabeauty.store |
| `backend/` | Node Express API, PostgreSQL | api.larabeauty.store |

> Legacy `src/` at repo root is unused; active API is `backend/src/`.

## Database (EasyPanel)

```
postgres://larabeauty:***@larabeauty_database:5432/larabeauty?sslmode=disable
```

## Products

1. علكات المغنيسيوم لتحسين جودة النوم
2. علكات عشبة العنزة ضد الإرهاق والتعب
3. علكات ضد التشتت وضعف التركيز

Bundles: **16 / 21 / 29 KWD** · Checkout upsell: **9 KWD**

## Deploy (EasyPanel) — canonical

**GitHub:** `lara-beauty-store-gcc/laragccbackend` · **Branch:** `main`  
Do **not** use `laragccfrontend` (empty legacy repo).

| Service | Source path | Dockerfile | Proxy port | Domain |
|---------|-------------|------------|------------|--------|
| **Store** | `frontend` | `Dockerfile` | **3000** | larabeauty.store |
| **API** | `backend` | `Dockerfile` | **8000** | api.larabeauty.store |

Copy-paste: [`easypanel/PRODUCTION-DEPLOY.md`](./easypanel/PRODUCTION-DEPLOY.md) · Store: [`easypanel/STORE-SERVICE.md`](./easypanel/STORE-SERVICE.md) · API: [`easypanel/API-SERVICE.md`](./easypanel/API-SERVICE.md)

**Optional faster builds:** branches `lara-frontend` / `lara-backend` (empty source path, synced from `main` by CI). See [`easypanel/BRANCHES-FAST-DEPLOY.md`](./easypanel/BRANCHES-FAST-DEPLOY.md).

**DNS (obligatoire):** Domain uses **Cloudflare** — add **A** `@` + **A** `api` → IP serveur (grey cloud). Without this, `larabeauty.store` = page not found forever. → [`docs/CLOUDFLARE-DNS-FIX.md`](./docs/CLOUDFLARE-DNS-FIX.md)

Guide: [`docs/EASYPANEL-DEPLOY.md`](./docs/EASYPANEL-DEPLOY.md) · [`docs/VIEW-STORE.md`](./docs/VIEW-STORE.md)
