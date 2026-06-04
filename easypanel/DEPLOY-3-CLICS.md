# Deploy فـ 3 خطوات (EasyPanel)

## Store — larabeauty.store

1. EasyPanel → **Projects** → service **store** (ولا lara-store)
2. تبويب **Source** (ولا Git):

```
Repository:  lara-beauty-store-gcc/laragccbackend
Branch:      main
Source path: frontend
```

3. تبويب **Build**:

```
Type:        Dockerfile
Dockerfile:  Dockerfile
```

4. تبويب **Domains** → Port: **3000** → Domain: larabeauty.store

5. **Environment** (لصق):

```
PORT=3000
HOSTNAME=0.0.0.0
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_API_URL=https://api.larabeauty.store
```

6. اضغط **Deploy** (أو **Rebuild** ثم **Deploy**)

⏱ استنى **5–10 دقائق** — Build كيطول بسبب الصور.

---

## إلا الزر Deploy ما خدامش

| جرّب |
|------|
| **Settings** → Git → Disconnect → Connect من جديد |
| تأكد repo: `laragccbackend` ماشي `laragccfrontend` |
| Service **Stopped**? → **Start** |
| شوف **Logs** → Build — آخر سطر أحمر = السبب |

---

## إلا Build كيطيح (fail)

انسخ آخر **10 أسطر** من Build log وصيفطهم.

غالباً:
- **timeout** → زيد Build timeout فـ Settings
- **no space** → السيرفر ممتلئ
- **npm error** → قولنا السطر

---

## API (اختياري دابا)

```
Branch: main
Source path: backend
Port: 8000
```

---

## Test منين ينجح

https://larabeauty.store/api/health  
https://larabeauty.store/products/focus-clarity
