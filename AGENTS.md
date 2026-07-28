# AGENTS.md

## Cursor Cloud specific instructions

Monorepo with two independently deployable services (do NOT deploy the repo root):

- `backend/` — Express API (ESM, `"type": "module"`), CAPI relay (Meta/TikTok/Snap) + Google Sheets + COD orders. Runs on port `8000`.
- `frontend/` — Next.js 14 store (App Router, Tailwind, Arabic RTL). Runs on port `3000`.

The root `src/` is legacy/unused; the active API is `backend/src/`.

### Running the services (dev)

Each service is installed and run from its own folder (the startup update script runs `npm ci` in both). Standard scripts live in each `package.json`:

- Backend dev: `npm run dev` in `backend/` (uses `node --watch`).
- Frontend dev: `npm run dev` in `frontend/`.

Non-obvious caveats:

- The backend runs WITHOUT a database. `DATABASE_URL` is optional; if unset (or Postgres unreachable) it logs a warning, retries ~10x, then serves anyway. Order creation still returns success with `"db":false`; only DB persistence is skipped. There is no local Postgres in this environment and none is required to run/test the core order flow.
- CORS: the backend blocks unknown origins only when `APP_ENV=production` (the default). For local browser testing (frontend on `:3000` calling API on `:8000`), start the backend with `APP_ENV=development` so cross-origin requests are allowed.
- The frontend calls the API at build/run time via `NEXT_PUBLIC_API_URL`. It defaults to the production domain, so for local end-to-end checkout start the frontend with `NEXT_PUBLIC_API_URL=http://localhost:8000`. If `NEXT_PUBLIC_API_URL` is empty, checkout still "succeeds" client-side with a fake local order id and never hits the backend.
- All marketing pixel / CAPI / Google Sheets integrations are no-ops unless their env vars are set (see `backend/.env.example`); they are not needed to run or test.

### Lint / test / build

- Frontend build (this is the real quality gate, matches CI): `npm run build` in `frontend/` (also runs type-checking).
- Backend "check" (matches CI): `node --check src/index.js` in `backend/`.
- There are no automated test suites in this repo.
- `npm run lint` (frontend) is NOT configured: ESLint has no config committed, so `next lint` drops into an interactive setup prompt. CI does not run lint. Do not rely on it unless ESLint is first configured.
