# EasyPanel — Deploy fix (main branch)

Deploy fails in ~2 seconds when **path / Dockerfile / port** are wrong.

## Service 1: STORE (larabeauty.store)

| Setting | Value |
|---------|--------|
| Git branch | `main` |
| **Root path** | `frontend` |
| Dockerfile | `Dockerfile` (inside frontend) |
| **Port** | `3000` |
| Domain | `larabeauty.store` |

Environment (minimum):

```env
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
```

## Service 2: API (api.larabeauty.store)

| Setting | Value |
|---------|--------|
| Git branch | `main` |
| **Root path** | `backend` |
| Dockerfile | `Dockerfile` (inside backend) |
| **Port** | `8000` |
| Domain | `api.larabeauty.store` |

Environment (minimum):

```env
PORT=8000
FRONTEND_URL=https://larabeauty.store
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store
DATABASE_URL=postgres://larabeauty:YOUR_PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
```

## Common mistakes

| Mistake | Result |
|---------|--------|
| Root path empty + Dockerfile at repo root | Builds API on store domain → broken page |
| Store port `8000` | Connection refused |
| API root path `frontend` | API crash / wrong app |
| `npm` build without `frontend` context | Instant Docker fail |

## After deploy — test

- https://larabeauty.store → Arabic shop homepage
- https://api.larabeauty.store/health → `{"status":"ok",...}`

## Redeploy

Push to `main` → EasyPanel → Redeploy both services.
