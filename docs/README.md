# Lara Beauty — Documentation Index (AI Coder)

**Brand:** لارا للجمال / Lara Beauty  
**Market:** Kuwait (KWT) · COD only · Arabic RTL · Kuwaiti dialect  
**Domains:** `larabeauty.store` (frontend) · `api.larabeauty.store` (backend)  
**Database:** `larabeauty` (PostgreSQL on EasyPanel)

Read documents **in order** before writing code.

| # | Document | Purpose |
|---|----------|---------|
| 00 | [ai-coder-brief.md](./00-ai-coder-brief.md) | Mission, scope, acceptance criteria |
| 01 | [architecture.md](./01-architecture.md) | System design, folders, APIs |
| 02 | [brand-positioning.md](./02-brand-positioning.md) | Brand, ICP, positioning, emotions |
| 03 | [icp-copy-kuwaiti.md](./03-icp-copy-kuwaiti.md) | Voice, dialect, copy rules |
| 04 | [cro-playbook.md](./04-cro-playbook.md) | CRO, offers, AOV, scarcity |
| 05 | [design-system.md](./05-design-system.md) | Colors, typography, layout |
| 06 | [frontend-spec.md](./06-frontend-spec.md) | Next.js pages, components, libs |
| 07 | [backend-spec.md](./07-backend-spec.md) | FastAPI, migrations, webhooks |
| 08 | [database-schema.md](./08-database-schema.md) | Tables, migrations |
| 09 | [tracking-pixels-capi.md](./09-tracking-pixels-capi.md) | Meta/TikTok/Snap web + CAPI |
| 10 | [checkout-cod-flow.md](./10-checkout-cod-flow.md) | Cart, upsell, sheets |
| 11 | [products-catalog.md](./11-products-catalog.md) | 3 products, bundles, cross-sell |
| 12 | [pages-structure.md](./12-pages-structure.md) | Every page & section |
| 13 | [deployment-easypanel.md](./13-deployment-easypanel.md) | Docker, env, deploy |
| 14 | [coding-standards.md](./14-coding-standards.md) | Rules for AI & humans |
| 15 | [env-variables.md](./15-env-variables.md) | Full env reference |

### Assets & integrations

| File | Purpose |
|------|---------|
| [sheets/orders-template.csv](./sheets/orders-template.csv) | Google Sheet column headers |
| [sheets/ORDERS_WEBHOOK.gs](./sheets/ORDERS_WEBHOOK.gs) | Apps Script to deploy in Sheet |
| [prompts/AI_CODER_START_PROMPT.md](./prompts/AI_CODER_START_PROMPT.md) | **Copy-paste prompt** to start build |

### Repo layout (target)

```
/
├── frontend/          # Next.js 14+ store
├── backend/           # FastAPI API
├── docs/              # This folder
└── README.md
```

> **Note:** Repo may contain legacy Node CAPI code at root. New backend must live in `backend/` per architecture doc.
