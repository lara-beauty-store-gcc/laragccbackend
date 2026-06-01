# AI Coder Start Prompt (copy everything below)

---

You are building **Lara Beauty (لارا للجمال)** — a premium Kuwait DTC supplement gummy store.

## Read these docs first (in repo `docs/`)

1. `docs/README.md` — index
2. `docs/00-ai-coder-brief.md` — mission & acceptance criteria
3. `docs/01-architecture.md` — folders, API, data flow
4. `docs/02-brand-positioning.md` + `docs/03-icp-copy-kuwaiti.md` — voice & Kuwait phone rules
5. `docs/04-cro-playbook.md` — bundles, upsell, cross-sell
6. `docs/05-design-system.md` — colors, layout alternation
7. `docs/06-frontend-spec.md` + `docs/12-pages-structure.md` — all pages/sections
8. `docs/07-backend-spec.md` + `docs/08-database-schema.md` — FastAPI + Postgres
9. `docs/09-tracking-pixels-capi.md` — deferred web pixels, hashed CAPI, dedup
10. `docs/10-checkout-cod-flow.md` — cart → checkout → 15s upsell → thank you
11. `docs/11-products-catalog.md` — 3 products, 16/23/29 KWD bundles, 9 KWD upsell
12. `docs/13-deployment-easypanel.md` + `docs/15-env-variables.md`
13. `docs/14-coding-standards.md` + `docs/16-skills-and-libraries.md`
14. `docs/sheets/ORDERS_WEBHOOK.gs` + `docs/sheets/orders-template.csv`

## Deliverables

### `frontend/` (Next.js 14 + React + TypeScript + Tailwind)

- Domains: **larabeauty.store**
- RTL Arabic, **Kuwaiti dialect**, **KWD**, COD only
- Pages: Home, About, Contact, Collections, 3× Product PDP, Thank you
- Header: logo placeholder + لارا للجمال + Lara Beauty + menu + cart
- Product pages: bundle selector (default 3-pack @ 29 KWD), CTA adds to cart **and opens cart drawer**
- Cart: cross-sells for other products
- Checkout popup: name + **Kuwait +965 phone validation only**
- 15s upsell modal @ **9 KWD** (only discounted offer)
- Deferred Meta/TikTok/Snap **web** pixels; Purchase with `event_id`
- SVG **placeholder images** (client adds real images later)
- Desktop: alternating image/text sections on PDP
- `Dockerfile`, `.env.example`

### `backend/` (Python FastAPI)

- Domain: **api.larabeauty.store**
- DB: `DATABASE_URL` → Postgres database **larabeauty**
- **Alembic migration on startup**
- `POST /api/v1/orders` — validate phone, **recalculate prices server-side**, save order, POST Google Sheets webhook, fire **CAPI** with **hashed** phone (Meta/Snap: digits 965…; TikTok: +965… before hash per docs)
- `GET /health`
- `Dockerfile`, `.env.example`, `requirements.txt`

### Google Sheets

- Use `docs/sheets/ORDERS_WEBHOOK.gs` — client deploys to Sheet; backend env `GOOGLE_SHEETS_WEBHOOK_URL` + `SHEETS_WEBHOOK_SECRET`

## Products (exact Arabic names)

1. علكات المغنيسيوم لتحسين جودة النوم — slug `magnesium-sleep`
2. علكات عشبة العنزة ضد الإرهاق والتعب — slug `epimedium-energy`
3. علكات ضد التشتت وضعف التركيز — slug `focus-clarity`

## Pricing (each product)

- 1 piece = **16 KWD**
- 2 pieces = **23 KWD**
- 3 pieces = **29 KWD** (preselected)
- Checkout upsell only = **9 KWD**

## Brand colors (until logo uploaded)

- Primary `#1B4332`, Accent `#C9A227`, Surface `#F7F4EE` — see `docs/05-design-system.md`

## Rules

- No hardcoded product/price/copy in components — use `config/`
- Legacy Node code at repo root may exist — **ignore**; build fresh `backend/` FastAPI
- Work on **`main`** branch; production-ready Docker for EasyPanel
- Phone: **Kuwait +965** (not KSA +966)

## When done

- `npm run build` passes in `frontend/`
- Backend starts, migrations run, test order creates DB row + sheet row
- List any env vars client must fill in EasyPanel

Start with `backend/` schema + API, then `frontend/` config and homepage, then PDPs and checkout flow, then tracking.

---
