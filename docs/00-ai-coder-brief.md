# 00 — AI Coder Brief

## Mission

Build a **premium DTC branded store** for **Kuwait** that sells three supplement gummy products at **high perceived value** (dropshipping positioning: owned-brand feel, not marketplace).

- **COD only** — no online payment
- **Max AOV** via bundle offers (16 / 23 / 29 KWD) + cart cross-sells + **9 KWD upsell** at checkout only
- **Max trust** — authority, science, ingredients, certifications, social proof (Kuwait ICP)
- **Max conversion** for Snap/TikTok/Meta traffic (UGC + AI video ads → landing pages)

## Brand

| Field | Value |
|-------|--------|
| Arabic | لارا للجمال |
| English | Lara Beauty |
| Logo | Placeholder until client uploads — slot in header next to colors |
| Frontend | https://larabeauty.store |
| API | https://api.larabeauty.store |

## Products (exact names — use everywhere)

1. **علكات المغنيسيوم لتحسين جودة النوم**
2. **علكات عشبة العنزة ضد الإرهاق والتعب**
3. **علكات ضد التشتت وضعف التركيز**

## Bundle pricing (per product — same structure)

| Offer | Price (KWD) |
|-------|-------------|
| 1 علبة | 16.000 |
| 2 علبة | 23.000 |
| 3 علبة | 29.000 |
| Checkout upsell (one-time) | 9.000 |

## Must-have flows

1. Product page → pick bundle → CTA → **add to cart + open cart drawer**
2. Cart drawer → cross-sells → CTA → **checkout popup** (name + phone)
3. Valid **Kuwait mobile** (+965) only
4. Submit → **10–15s upsell modal** (relevant product @ 9 KWD)
5. Thank you page → **webhook to Google Sheets** + **server-side order persist** + **CAPI Purchase** with dedup

## Tech stack (mandatory)

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS |
| Backend | Python 3.11+, FastAPI, SQLAlchemy 2, Alembic |
| DB | PostgreSQL (`larabeauty`) |
| Deploy | Docker on EasyPanel, GitHub |

## Out of scope (v1)

- Card payments, Apple Pay, Tabby/Tamara
- Multi-country (Kuwait only v1)
- Customer accounts / login
- Inventory sync with supplier (manual OK)

## Acceptance criteria (definition of done)

- [ ] All pages in [pages-structure.md](./12-pages-structure.md) responsive (mobile-first)
- [ ] RTL Arabic, Kuwaiti dialect per [icp-copy-kuwaiti.md](./03-icp-copy-kuwaiti.md)
- [ ] 3 product landings with full CRO sections + alternating image/text desktop layout
- [ ] Bundle selector + cart + cross-sell + checkout upsell + thank you
- [ ] Phone validation Kuwait +965 (see note in checkout doc — client said "KSA" once; **market is KWT**)
- [ ] Web pixels deferred; CAPI hashed PII; `event_id` dedup
- [ ] Orders in Postgres + Google Sheet via Apps Script
- [ ] `frontend/.env.example`, `backend/.env.example`, Dockerfiles, migrations on backend start
- [ ] Placeholder images where real assets missing

## Read next

[architecture.md](./01-architecture.md) → [frontend-spec.md](./06-frontend-spec.md) + [backend-spec.md](./07-backend-spec.md)
