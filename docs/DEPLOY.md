# Deploy — branch `main` (أو `deploy-fix` — نفس الكود)

كل الشغل (store + backend) موجود على **`main`** — مو على branches `cursor/*`.

## EasyPanel — Git

| الحقل | القيمة |
|--------|--------|
| **Branch** | `main` |
| **Commit** | آخر commit (مثلاً `7bf61e9` أو أحدث) |

## خدمتين منفصلتين

### 1) المتجر (الواجهة)

| | |
|--|--|
| **Root / Path** | `frontend` |
| **Dockerfile** | `frontend/Dockerfile` |
| **Port** | `3000` |

### 2) Backend CAPI

| | |
|--|--|
| **Root / Path** | `/` (جذر المشروع) |
| **Dockerfile** | `Dockerfile` |
| **Port** | `3000` |

بعد تغيير Branch إلى `main` → **Redeploy**.

## تحقق

على GitHub: `main` → مجلد `frontend/` → `src/app/page.tsx`  
إذا ما شفتها، الـ branch غلط.
