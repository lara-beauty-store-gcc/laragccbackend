# كل المشاكل المحتملة + الحل (Lara Beauty)

## 1. DNS (خارج الكود)

| المشكل | الحل |
|--------|------|
| `larabeauty.store` ما يفتح | A record → IP السيرفر |
| `api.larabeauty.store` NXDOMAIN | A record `api` → نفس IP |
| SSL | EasyPanel → Enable HTTPS |

## 2. EasyPanel config

| المشكل | الحل |
|--------|------|
| Build 2 ثواني | Path غلط أو Dockerfile Alpine (صلح) |
| Store = API | Store path = `frontend` port 3000 |
| API port 3000 | API path = `backend` port **8000** |
| Branch غلط | **`main`** فقط |

## 3. Docker build

| المشكل | الحل |
|--------|------|
| `adduser --ingroup` | استعمل `adduser -G` (صلح) |
| Next standalone copy | Dockerfile بسيط `npm run start` (صلح) |
| `npm ci` fail | `package-lock.json` موجود f frontend/backend |
| `.next` f context | `frontend/.dockerignore` |

## 4. Runtime

| المشكل | الحل |
|--------|------|
| Next ما يسمع برا | `HOSTNAME=0.0.0.0` |
| API ما يسمع برا | `listen(0.0.0.0)` |
| DB crash | API يكمل بدون DB إذا فشل الاتصال |
| CORS | `larabeauty.store` مضاف تلقائياً |

## 5. المتجر

| المشكل | الحل |
|--------|------|
| صفحة بيضاء | NEXT_PUBLIC_* env على store |
| طلب ما يروح | `NEXT_PUBLIC_API_URL=https://api.larabeauty.store` |
| رقم جوال | كويت +965 فقط |

## 6. بعد كل push

1. EasyPanel → Redeploy store + api
2. انتظر 2–5 دقائق
3. Test `/health` و `/`

## 7. Logs

EasyPanel → Logs → Build + Runtime → آخر خطأ أحمر
