# 14 — Coding Standards

## General

1. **Config-driven** — no hardcoded product names, prices, or brand strings in components
2. **TypeScript strict** on frontend; **mypy optional** on backend
3. **Arabic RTL first** — test every page mobile 375px width
4. **KWD** always 3 decimal places in display (`16.000 د.ك`)
5. **Comments** only for non-obvious business rules (phone normalize, CAPI hash)

## Git

- Branch: `main` for production
- Commits: conventional `feat:`, `fix:`, `docs:`
- No secrets in git

## Frontend rules

- Use Server Components where no client state; `'use client'` only for cart, modals, tracking
- One cart provider at root
- API calls only to `NEXT_PUBLIC_API_URL`
- No `console.log` in production — use structured client logger optional
- Extract copy to `lib/copy-engine.ts` reading product config

## Backend rules

- Pydantic models for all request/response
- DB session per request dependency injection
- BackgroundTasks for CAPI + Sheets (don't block response >500ms)
- Hash PII only in `services/capi/` — never log raw phone

## Testing (minimum)

- `phone.py` unit tests: Kuwait valid/invalid numbers
- `hashing.py` unit tests: vectors for Meta/TikTok/Snap formats
- One Playwright or manual QA checklist in `docs/QA.md` (optional)

## Accessibility

- Buttons min height 44px
- Color contrast WCAG AA on green/cream

## Security

- Validate all prices **server-side** — never trust client totals
- Recalculate order total from catalog price table in backend
- Rate limit orders endpoint

## AI coder workflow

1. Read `docs/README.md` index
2. Implement `backend/` + migrations first
3. Implement `frontend/` config then components
4. Wire tracking last
5. Docker build test locally
