# ⚠️ STORE — بدّل هادا دابا (السبب: الطلبات ما كتوصلش للشيت)

## المشكل

`https://larabeauty.store/api/health` كيعطي:

```json
"repo": "laragccfrontend"
```

هادا **repo قديم**. الطلبات كيتسجلو محلياً (`00001`) و **ما كيوصلوش** لـ API ولا Google Sheet.

**API خدام** (`api.larabeauty.store`) — الطلبات من API كتوصل للشيت ف ثواني.

---

## EasyPanel — خدمة STORE (ماشي API)

| الحقل | القيمة الصحيحة |
|--------|----------------|
| Repository | `lara-beauty-store-gcc/laragccbackend` |
| Branch | **`frontend`** |
| Build Path | **`/`** |
| Dockerfile | `Dockerfile` |
| Port | **3000** |

**ماشي** `laragccfrontend` — **ماشي** branch `main`.

### Environment

```
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

---

## بعد Deploy — تحقق

```bash
curl https://larabeauty.store/api/health
```

**صحيح:**
```json
"repo": "laragccbackend"
"ordersProxy": true
```

**غلط (مازال قديم):**
```json
"repo": "laragccfrontend"
```

---

## Test طلب

1. طلب من الموقع برقم يبدأ بـ `5` (مثال `501234567`)
2. Thank-you: **`LARA-XXXX`** (مش `00001`)
3. Google Sheet: صف جديد ف 2-3 ثواني
