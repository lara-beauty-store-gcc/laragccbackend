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
| `backend/` | Python FastAPI, Alembic, PostgreSQL | api.larabeauty.store |

> Legacy Node CAPI at repo root may exist — new implementation follows `docs/07-backend-spec.md`.

## Database (EasyPanel)

```
postgres://larabeauty:***@larabeauty_database:5432/larabeauty?sslmode=disable
```

## Products

1. علكات المغنيسيوم لتحسين جودة النوم
2. علكات عشبة العنزة ضد الإرهاق والتعب
3. علكات ضد التشتت وضعف التركيز

Bundles: **16 / 23 / 29 KWD** · Checkout upsell: **9 KWD**

## Deploy (EasyPanel) — store online

**Branch:** `main` or `deploy-fix` (same code)

| Service | Source path | Port | Domain |
|---------|-------------|------|--------|
| Store | `frontend` | 3000 | larabeauty.store |
| API | `backend` | 8000 | api.larabeauty.store |

**DNS (obligatoire):** Domain uses **Cloudflare** — add **A** `@` + **A** `api` → IP serveur (grey cloud). Without this, `larabeauty.store` = page not found forever. → [`docs/CLOUDFLARE-DNS-FIX.md`](./docs/CLOUDFLARE-DNS-FIX.md)

Guide: [`docs/EASYPANEL-DEPLOY.md`](./docs/EASYPANEL-DEPLOY.md) · [`docs/VIEW-STORE.md`](./docs/VIEW-STORE.md)
