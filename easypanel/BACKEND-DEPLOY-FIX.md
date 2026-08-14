# EasyPanel — Backend Deploy (حل المشكل)

## الإعداد الصحيح (اختار واحد)

### ✅ الطريقة 1 — الأسهل (branch `main`)

| الحقل | القيمة |
|--------|--------|
| Repository | `lara-beauty-store-gcc/laragccbackend` |
| **Branch** | **`main`** |
| **Source path / Build path** | **`backend`** |
| Builder | Dockerfile |
| Dockerfile file | `Dockerfile` |
| **Proxy port** | **`8000`** |
| Domain | `api.larabeauty.store` |

### ✅ الطريقة 2 — فرع منفصل (branch `backend`)

| الحقل | القيمة |
|--------|--------|
| Repository | `lara-beauty-store-gcc/laragccbackend` |
| **Branch** | **`backend`** |
| **Source path / Build path** | **`/`** (فارغ — ماشي `backend`) |
| Builder | Dockerfile |
| Dockerfile file | `Dockerfile` |
| **Proxy port** | **`8000`** |
| Domain | `api.larabeauty.store` |

---

## ❌ الأخطاء اللي كتخلي Deploy يفشل

| الخطأ | السبب | الحل |
|--------|--------|------|
| `open Dockerfile: no such file` | Branch `backend` + Source path = `backend` | Source path = **فارغ** `/` |
| `backend/package.json: not found` | Branch `main` + Source path فارغ | Source path = **`backend`** |
| `src/index.js missing` | Build path غلط | راجع الجدول فوق |
| Build كيتوقف ف 2 ثواني | Source path فارغ على `main` | حط `backend` أو استعمل branch `backend` |
| Build OK ولكن service down | Port غلط | Domains → Proxy port = **8000** |
| `frontend/Dockerfile` not found | خدمة API مربوطة بـ store | API = `backend` path أو branch `backend` |

**مهم:** اسم الخدمة ف EasyPanel (مثلاً `backend`) **ماشي** نفس Source path. لازم تحدد Source path ف **Build** settings.

---

## Environment variables (API)

```env
NODE_ENV=production
PORT=8000
APP_ENV=production
APP_NAME=Lara Beauty API
FRONTEND_URL=https://larabeauty.store
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store
DATABASE_URL=postgres://larabeauty:PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
```

**ما تحطش** `TIKTOK_*` ولا `SNAP_*` على API — marketing كامل على frontend.

---

## بعد Deploy — Test

```bash
curl https://api.larabeauty.store/health
```

خاصك تشوف:

```json
{"status":"ok","app":"Lara Beauty API","db":true}
```

---

## Build logs خاصهم يبانو هكذا

```
>>> [api] npm ci --omit=dev
```

## Runtime logs خاصهم يبانو هكذا

```
Lara Beauty API — container start
Lara Beauty API READY on 0.0.0.0:8000
```

إلا Build كياخد **2 ثواني بس** → الإعدادات غلط (راجع Source path + Branch).

---

## إلا باقي المشكل

1. EasyPanel → Service API → **Rebuild** (ماشي Redeploy بس)
2. شوف **Build logs** — صور الخطأ أو copy/paste السطر الأحمر
3. تأكد `larabeauty_database` service **running** (DATABASE_URL)
