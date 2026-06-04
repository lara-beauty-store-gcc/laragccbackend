# Plan B — إلا branch `frontend` ما خدمش

استعمل **`main`** + **Source path** (ما تخلّيش path فارغ):

## Store

| الحقل | القيمة |
|--------|--------|
| Branch | **`main`** |
| Source path | **`frontend`** |
| Dockerfile | `Dockerfile` |
| Port | **3000** |

## API

| Branch | **`main`** |
| Source path | **`backend`** |
| Port | **8000** |

نفس الـ env و نفس Domains. Redeploy.

---

# إلا Deploy كيتعطل (build fail)

1. EasyPanel → service → **Logs** → **Build** — انسخ آخر 20 سطر
2. زيد **Build timeout** إلا موجود (15 دقيقة)
3. تأكد **Build type** = **Dockerfile** (ماشي Nixpacks فقط)
4. **Reconnect GitHub**: Settings → Git → `lara-beauty-store-gcc/laragccbackend`

---

# إلا ما كاينش زر Deploy

- Service واقف؟ Start / Redeploy
- Git متصل؟ جرّب **Pull** ثم **Deploy**
- Branch موجود؟ GitHub → branches → `frontend` و `backend`
