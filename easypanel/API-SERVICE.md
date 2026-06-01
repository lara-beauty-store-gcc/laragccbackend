# EasyPanel — API (copy settings)

```
Service name: api  (or backend — name does not set the git subfolder)
Domain: api.larabeauty.store
Git repo: lara-beauty-store-gcc/laragccbackend
Branch: main
Source path: backend           ← REQUIRED (not repo root)
Build: Dockerfile
Dockerfile file: Dockerfile    ← NOT backend/Dockerfile
Domains proxy port: 8000
```

**Misconfig:** Service name `backend` ≠ Source path `backend`. The path must be set in Build → Source path.

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
