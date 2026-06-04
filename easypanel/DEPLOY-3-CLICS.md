# Deploy — اتبع هاد الخطوات بالترتيب

## ① Git (مرة وحدة)

EasyPanel → service **store** → **Source**

```
Repository: lara-beauty-store-gcc/laragccbackend
Branch:     main
Path:       frontend
```

**Save**

---

## ② Build

```
Build method: Dockerfile
Dockerfile:   Dockerfile
```

**ماشي** Nixpacks فقط — خاص Dockerfile.

---

## ③ Port + Domain

```
Proxy port: 3000
Domain:     larabeauty.store
HTTPS:      Let's Encrypt ON
```

---

## ④ Environment (copy)

```
PORT=3000
HOSTNAME=0.0.0.0
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
```

---

## ⑤ Deploy

1. **Rebuild** (انتظر 3–8 دقائق)
2. **Deploy** / **Start**

Logs → Build → خاصك تشوف: `✓ Compiled successfully`

---

## إلا ما خدمش

| المشكل | الحل |
|--------|------|
| ما كاينش Deploy | Git reconnect |
| Branch not found | `main` + repo `laragccbackend` |
| Build fail OOM | زيد RAM VPS ولا Build timeout |
| Build fail timeout | Settings → timeout 900s |
| SSL error | Domains → Let's Encrypt |

**صوّر Build log** (آخر 15 سطر) وصيفط.

---

## Test

https://larabeauty.store/api/health
