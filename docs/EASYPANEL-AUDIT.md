# EasyPanel deployment audit (final)

## Branch and commit

| Use in EasyPanel | Value |
|------------------|--------|
| **Branch** | `main` (or `deploy-fix` — same after sync) |
| **Latest deploy-ready commit** | see `git log -1` on `main` |

## Root cause of “build fails in ~2 seconds”

| Cause | Fix |
|-------|-----|
| **Source path empty** (repo root) | Set `frontend` or `backend` — there is **no** root `Dockerfile` |
| **Wrong Dockerfile path** | Use `Dockerfile` only (not `frontend/Dockerfile` when path is already `frontend`) |
| **Store service = API** | Two separate App services |
| **Proxy port wrong** | Store **3000**, API **8000** |
| **DNS missing** | Cloudflare A records — `docs/CLOUDFLARE-DNS-FIX.md` |

---

## Store service (EasyPanel)

| Setting | Value |
|---------|--------|
| Type | App |
| Git repo | `lara-beauty-store-gcc/laragccbackend` |
| Branch | `main` |
| **Source path** | **`frontend`** |
| Builder | **Dockerfile** |
| **Dockerfile file** | **`Dockerfile`** |
| **Domains → Proxy port** | **3000** |
| Domain | `larabeauty.store` |

### Store environment variables

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
```

### Store build logs (success)

```text
>>> [store] npm ci (deps)
>>> [store] npm run build
>>> [store] npm ci (production)
```

### Store runtime logs (success)

```text
Lara Beauty Store — container start
Build: frontend/ | Port: 3000
[OK] Starting Next.js on 0.0.0.0:3000
```

### Store test URLs

- `https://larabeauty.store/`
- `https://larabeauty.store/api/health` → `{"status":"ok","service":"lara-beauty-store"}`

---

## API service (EasyPanel)

| Setting | Value |
|---------|--------|
| Type | App |
| Branch | `main` |
| **Source path** | **`backend`** (or **empty** → uses root `Dockerfile`) |
| Builder | **Dockerfile** |
| **Dockerfile file** | **`Dockerfile`** (if path empty) or **`Dockerfile`** in `backend/` |
| **Domains → Proxy port** | **8000** |
| Domain | `api.larabeauty.store` |

### API environment variables

```env
NODE_ENV=production
PORT=8000
APP_ENV=production
APP_NAME=Lara Beauty API
FRONTEND_URL=https://larabeauty.store
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store
DATABASE_URL=postgres://larabeauty:PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
```

Optional: CAPI, Sheets, Meta/TikTok/Snap keys (see `backend/.env.example`).

### API build logs (success)

```text
>>> [api] npm ci --omit=dev
```

### API runtime logs (success)

```text
Lara Beauty API — container start
Lara Beauty API READY on 0.0.0.0:8000
```

### API test URLs

- `https://api.larabeauty.store/health` → `200` + `"status":"ok"`

---

## Local Docker test

```bash
git clone https://github.com/lara-beauty-store-gcc/laragccbackend.git
cd laragccbackend
./scripts/docker-test.sh
```

Or manually:

```bash
docker build -t lara-store ./frontend
docker build -t lara-api ./backend
docker run --rm -p 3000:3000 -e HOSTNAME=0.0.0.0 lara-store
docker run --rm -p 8000:8000 lara-api
curl http://127.0.0.1:3000/api/health
curl http://127.0.0.1:8000/health
```

---

## Common EasyPanel mistakes

| Mistake | Symptom |
|---------|---------|
| Service named `backend` but Source path empty | Buildpack / instant fail |
| Dockerfile file = `frontend/Dockerfile` with path `frontend` | File not found |
| API on port 3000 | Health check / proxy fail |
| Only one service for whole repo | Wrong app on domain |
| Orange Cloudflare proxy before origin SSL | 52x errors |

---

## Files that must exist on branch

- `frontend/Dockerfile`
- `frontend/docker-entrypoint.sh`
- `frontend/package-lock.json`
- `backend/Dockerfile`
- `backend/docker-entrypoint.sh`
- `backend/package-lock.json`
- `/Dockerfile` at repo root — **API only** when Source path is empty
- `/Dockerfile.store` — **Store only** when Source path is empty
