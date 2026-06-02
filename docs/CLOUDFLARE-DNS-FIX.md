# FIX — larabeauty.store page not found (Cloudflare)

## المشكل الحقيقي (تأكدنا)

الدومين **مسجل** و nameservers = Cloudflare (`chad.ns.cloudflare.com`).

لكن **ما كاينش A record** لـ `@` و `api` → المتصفح ما يلقاوش السيرفر = **page not found**.

هادشي **ماشي GitHub** — خاصك تدخل **Cloudflare** و تزيد 2–3 سطور DNS.

---

## الخطوات (5 دقائق)

### 1. IP ديال السيرفر

EasyPanel → Server/VPS → **Public IPv4** (مثال: `123.45.67.89`)

### 2. Cloudflare → larabeauty.store → DNS → Records

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| **A** | `@` | **IP السيرفر** | **DNS only** (سحابة رمادية) |
| **A** | `api` | **نفس IP** | DNS only |
| **CNAME** | `www` | `larabeauty.store` | DNS only |

**مهم:** أول مرة خلي Proxy **OFF** (grey cloud). من بعد ما EasyPanel SSL (Let's Encrypt) يخدم، تقدر تشغل البرتقالي.

**خطأ SSL فالمتصفح** (`NET::ERR_CERT_AUTHORITY_INVALID` / connexion pas privée): السيرفر كيعطي شهادة `CN=Easypanel` — خاصك تفعّل HTTPS/Let's Encrypt فـ EasyPanel → [`easypanel/SSL-FIX-ERR-CERT.md`](../easypanel/SSL-FIX-ERR-CERT.md)

### 3. EasyPanel — service **store** (ماشي backend)

| Champ | Valeur |
|-------|--------|
| Branch | `main` |
| Source path | `frontend` |
| Port (proxy) | **3000** |
| Domains | `larabeauty.store` + Enable HTTPS |

### 4. EasyPanel — service **api**

| Champ | Valeur |
|-------|--------|
| Source path | `backend` |
| Port (proxy) | **8000** |
| Domains | `api.larabeauty.store` |

### 5. Redeploy store + api

Build = **2–5 min**. Runtime store:

```text
[OK] Starting Next.js on 0.0.0.0:3000
```

### 6. Test

```bash
ping larabeauty.store
curl -I https://larabeauty.store/
curl https://larabeauty.store/api/health
curl https://api.larabeauty.store/health
```

---

## إلا بقى ما خدمش

1. Screenshot Cloudflare DNS (كل records)
2. EasyPanel → store → Domains (port 3000؟)
3. Build log آخر 10 أسطر
