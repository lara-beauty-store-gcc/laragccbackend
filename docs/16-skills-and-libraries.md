# 16 — Skills & Libraries Reference

## Frontend (recommended)

| Library | Why |
|---------|-----|
| **Next.js 14** | App Router, SEO, `standalone` Docker, image optimization |
| **React 18** | Ecosystem, concurrent features |
| **Tailwind CSS 3** | Fast RTL styling, design tokens |
| **TypeScript** | Safer config-driven UI |
| **Zod** | Phone + form validation |
| **Zustand** | Lightweight cart (or React Context) |
| **lucide-react** | Icons |
| **clsx** / **tailwind-merge** | Conditional classes |

### Avoid v1

- Heavy UI kits (MUI) — hurts brand uniqueness
- Redux — overkill for cart-only state
- i18n frameworks — single locale Arabic

## Backend (recommended)

| Library | Why |
|---------|-----|
| **FastAPI** | Async, OpenAPI docs, fast dev |
| **SQLAlchemy 2** | ORM + Alembic migrations |
| **httpx** | Async CAPI + webhook calls |
| **pydantic-settings** | Env management |
| **python-multipart** | If file upload later |

## AI / Cursor skills to apply

When implementing, follow these mental models:

1. **Premium DTC CRO** — bundle default 3-pack, upsell once, cross-sell in cart
2. **Kuwait COD trust** — repeat COD, phone confirm, no card fields
3. **Tracking hygiene** — deferred web, hashed CAPI, `event_id` dedup
4. **Config-first** — one file to add product #4 later

## Optional future libs

- **Partytown** — offload pixels to web worker
- **Sentry** — error monitoring
- **PostHog** — product analytics (self-host)

## Copy generation

Implement `src/lib/copy-engine.ts`:

```ts
export function productHero(product: Product) {
  return {
    title: product.cardHeadline,
    subtitle: product.cardSubheadline,
  };
}
```

Extend with template strings from `problem` + `mainIngredient` — no LLM required at runtime for v1.
