# Deploy — كلشي فصفحة وحدة (EasyPanel)

## الريبو الوحيد

```
lara-beauty-store-gcc/laragccbackend
```

**ماشي** `laragccfrontend`.

---

## 1) Store (الموقع) — larabeauty.store

EasyPanel → service **store** → **Source / Git**

| الحقل | القيمة |
|--------|--------|
| Repository | `lara-beauty-store-gcc/laragccbackend` |
| Branch | **`frontend`** |
| Source path | **فارغ** (ما تكتب والو) |
| Dockerfile | `Dockerfile` |
| Proxy port | **3000** |
| Domain | `larabeauty.store` |

**Environment** (نسخ ولصق):

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
```

**Domains** → فعّل **HTTPS / Let's Encrypt** (باش ما يطلعش خطأ SSL).

→ **Deploy** أو **Redeploy** → استنى 3–5 دقائق.

**Test:** https://larabeauty.store/images/products/magnesium-sleep.png

---

## 2) API — api.larabeauty.store

EasyPanel → service **api** (ولا backend)

| الحقل | القيمة |
|--------|--------|
| Repository | `lara-beauty-store-gcc/laragccbackend` |
| Branch | **`backend`** |
| Source path | **فارغ** |
| Dockerfile | `Dockerfile` |
| Proxy port | **8000** |
| Domain | `api.larabeauty.store` |

**Environment:**

```env
APP_ENV=production
PORT=8000
FRONTEND_URL=https://larabeauty.store
CORS_ORIGINS=https://larabeauty.store,https://www.larabeauty.store
DATABASE_URL=postgres://larabeauty:PASSWORD@larabeauty_database:5432/larabeauty?sslmode=disable
```

→ **Redeploy**

**Test:** https://api.larabeauty.store/health

---

## 3) Cloudflare DNS

| Type | Name | IP |
|------|------|-----|
| A | `@` | IP ديال السيرفر |
| A | `api` | نفس IP |

أول مرة: سحابة **رمادية** (DNS only). من بعد SSL خدام، تقدر برتقالي.

---

## 4) منين تبدّل الكود

1. Push على **`main`** فـ GitHub
2. ولا: Actions كيسync **`frontend`** و **`backend`** تلقائياً
3. EasyPanel → **Redeploy** store + api

---

## أخطاء شائعة

| الخطأ | الحل |
|-------|------|
| صور مكسورة | Branch = `frontend` + Redeploy |
| SSL / connexion pas privée | Let's Encrypt فـ Domains |
| Branch not found | Repo `laragccbackend` + branch `frontend` |
| Service not reachable | Port 3000 store / 8000 api |
| Store يبني API | Branch غلط — خاص `frontend` ماشي `main` ب path فارغ |

---

## Checklist سريع

- [ ] Store: branch `frontend`, path فارغ, port 3000
- [ ] API: branch `backend`, path فارغ, port 8000
- [ ] HTTPS على الجوج domains
- [ ] Redeploy الاثنين
- [ ] Ctrl+F5 على الموقع
