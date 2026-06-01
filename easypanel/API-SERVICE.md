# EasyPanel — API (copy settings)

```
Service name: api  (or backend — name does not set the git subfolder)
Domain: api.larabeauty.store
Git repo: lara-beauty-store-gcc/laragccbackend
Branch: main
Source path: backend          ← recommended
Build: Dockerfile
Dockerfile file: Dockerfile   ← if source path is empty, root Dockerfile builds API
Port: 8000
```

**If build failed with “Wrong EasyPanel source path”:** pull latest `main` — root `Dockerfile` now builds the API from repo root.

**Misconfig:** Service name `backend` is NOT the same as source path `backend`. Set **Source path** to `backend` in the Build tab, or leave it empty and use root `Dockerfile`.

Environment:
```
PORT=8000
APP_ENV=production
FRONTEND_URL=https://larabeauty.store
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store
DATABASE_URL=postgres://larabeauty:PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
GOOGLE_SHEETS_WEBHOOK_URL=
SHEETS_WEBHOOK_SECRET=
```

Test: `curl https://api.larabeauty.store/health`
