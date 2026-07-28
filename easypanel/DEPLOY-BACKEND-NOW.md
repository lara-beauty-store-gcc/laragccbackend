# EasyPanel — Backend API

## إعدادك (ما تبدّلوش)

| الحقل | القيمة |
|--------|--------|
| Repository | `lara-beauty-store-gcc/laragccbackend` |
| Branch | **`backend`** |
| Build Path | **`/`** (فارغ أو slash واحد — **ماشي** `backend`) |
| Dockerfile | `Dockerfile` |
| Port | `8000` |

فرع `backend` فيه `Dockerfile` + `src/` فـ **جذر الفرع** (ماشي داخل folder `backend/`).

## إلا Deploy فشل — الأخطاء الشائعة

| الخطأ ف EasyPanel | السبب | الحل |
|-------------------|--------|------|
| `open Dockerfile: no such file` | Build Path = `backend` | حط Build Path = **`/`** |
| `backend/package.json: not found` | Branch `main` + Build Path `/` | استعمل Branch = **`backend`** |
| `src/index.js missing` | Build Path غلط | Branch `backend` + Build Path `/` |
| Build OK ولكن service down | Port غلط | Domains → Proxy port **`8000`** |

## بعد Deploy — Test

```bash
curl https://api.larabeauty.store/health
```

خاصك تشوف: `"status":"ok"` و `"app":"Lara Beauty API"`

## Env (EasyPanel → Environment)

```
DATABASE_URL=postgresql://...
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
FRONTEND_URL=https://larabeauty.store
NODE_ENV=production
PORT=8000
```
