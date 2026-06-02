# ⚠️ جوج repos — ماشي نفس الشي

| Repo | شنو فيه | EasyPanel Store |
|------|---------|-----------------|
| **laragccbackend** | Store + API + docs (كل التحديثات) | **استعمل هادا** |
| **laragccfrontend** | كان فارغ / HTML قديم | **ماشي محدّث** |

---

## Store — الإعداد الصحيح

```
Repository: lara-beauty-store-gcc/laragccbackend
Branch:     main
Source path: frontend
Dockerfile: Dockerfile
Port:        3000
Domain:      larabeauty.store
```

**ماشي** `laragccfrontend` — فيه ما كاينش المتجر الجديد.

---

## API

```
Repository: lara-beauty-store-gcc/laragccbackend
Branch:     main
Source path: backend
Port:        8000
Domain:      api.larabeauty.store
```

---

## إلا EasyPanel مربوط بـ laragccfrontend

1. Store → Source → بدّل Repo إلى **laragccbackend**
2. Source path: **frontend**
3. Redeploy

أو دير push يدوي للمتجر من `laragccbackend/frontend` إلى `laragccfrontend` (نفس الكود).

---

## الموقع ما يفتح (site inaccessible)

حتى مع Repo صحيح، خاص **DNS** ف Cloudflare:

- **A** `@` → IP السيرفر
- **A** `api` → نفس IP
