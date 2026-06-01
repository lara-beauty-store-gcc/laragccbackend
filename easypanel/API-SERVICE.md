# EasyPanel — API (copy settings)

```
Service name: api
Domain: api.larabeauty.store
Git repo: lara-beauty-store-gcc/laragccbackend
Branch: main
Source path: backend
Build: Dockerfile
Dockerfile: Dockerfile
Port: 8000
```

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
