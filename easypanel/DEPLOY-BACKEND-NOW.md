# EasyPanel — Backend API (حل فوري)

## إلا EasyPanel يقول: *"This has to be a valid branch"*

**ما تستعملش `/` فـ Build Path.** خَلّيه **فارغ** (empty).

---

## الحل 1 — الأضمن (يخدم دائماً)

| الحقل | القيمة |
|--------|--------|
| **Repository** | `lara-beauty-store-gcc/laragccbackend` |
| **Branch** | `main` |
| **Build Path** | `backend` |
| **Build type** | Dockerfile |
| **Dockerfile** | `Dockerfile` |
| **Port** | `8000` |
| **Domain** | `api.larabeauty.store` |

---

## الحل 2 — فرع deploy منفصل

| الحقل | القيمة |
|--------|--------|
| **Repository** | `lara-beauty-store-gcc/laragccbackend` |
| **Branch** | `backend` |
| **Build Path** | *(فارغ — ما تكتبش `/`)* |
| **Dockerfile** | `Dockerfile` |
| **Port** | `8000` |

الفرع `backend` كيتsync تلقائياً من `main` (GitHub Actions).

---

## Environment (API)

```env
PORT=8000
APP_ENV=production
FRONTEND_URL=https://larabeauty.store
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store
DATABASE_URL=postgres://larabeauty:PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
```

---

## Test

```bash
curl https://api.larabeauty.store/health
```

---

## إلا Branch ما بانش فـ EasyPanel

1. EasyPanel → **Settings** → **Git** → **Reconnect GitHub**
2. تأكد الـ repo: `lara-beauty-store-gcc/laragccbackend`
3. استعمل **الحل 1** (`main` + `backend`) — ما محتاجش فرع `backend`

Branches: https://github.com/lara-beauty-store-gcc/laragccbackend/branches
