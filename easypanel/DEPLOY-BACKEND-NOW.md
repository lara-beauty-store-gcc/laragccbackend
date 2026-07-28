# EasyPanel — Backend API

## الإعداد (نفس الشي على branch `backend` أو `main`)

| الحقل | القيمة |
|--------|--------|
| Repository | `lara-beauty-store-gcc/laragccbackend` |
| Branch | `backend` |
| Build Path | `backend` |
| Dockerfile | `Dockerfile` |
| Port | `8000` |

**ما تستعملش `/` ولا `.` ولا فارغ** — كتب `backend` فـ Build Path.

نفس الإعداد يخدم مع Branch `main` + Build Path `backend`.

## Test

```bash
curl https://api.larabeauty.store/health
```
