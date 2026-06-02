# FIX — NET::ERR_CERT_AUTHORITY_INVALID (larabeauty.store)

## المشكل (شنو لقينا)

المتصفح كيعرض: **« Votre connexion n'est pas privée »** / `NET::ERR_CERT_AUTHORITY_INVALID`

السبب: السيرفر كيستعمل **شهادة EasyPanel الافتراضية** (self-signed):

```text
subject = CN = Easypanel
issuer  = CN = Easypanel
```

هاد الشهادة **ماشي Let's Encrypt** — Chrome ما كيثقهاش.  
**ماشي مشكل فـ Next.js ولا Git** — خاصك تصلّح SSL فـ EasyPanel ولا Cloudflare.

---

## الحل 1 (الأحسن) — Let's Encrypt فـ EasyPanel

1. Cloudflare → DNS → record `@` → **Proxy OFF** (سحابة **رمادية**) مؤقتاً  
   (Let's Encrypt خاصو يوصل للسيرفر مباشرة)

2. EasyPanel → service **store** → **Domains**
   - Domain: `larabeauty.store`
   - **Enable HTTPS** / **Let's Encrypt** → Generate

3. نفس الشيء لـ service **api** → `api.larabeauty.store`

4. استنى 1–2 دقيقة → Redeploy إلا طلب

5. Test:

```bash
echo | openssl s_client -connect larabeauty.store:443 -servername larabeauty.store 2>/dev/null | openssl x509 -noout -issuer
```

خاصك تشوف شي حاجة بحال: `issuer=... Let's Encrypt...`  
**ماشي** `issuer=CN = Easypanel`

6. من بعد SSL خدام، تقدر ترجع Cloudflare proxy (برتقالي) بـ SSL mode **Full (strict)**

---

## الحل 2 (سريع) — Cloudflare SSL (إلا Let's Encrypt ما خدمش)

1. Cloudflare → DNS → `@` و `api` → **Proxy ON** (سحابة **برتقالية**)

2. Cloudflare → **SSL/TLS** → Overview → mode: **Full**  
   (ماشي Full strict — حيت origin عندو شهادة EasyPanel self-signed)

3. الزوار كيشوفو شهادة Cloudflare صحيحة فالمتصفح

4. على المدى الطويل: خدم الحل 1 (Let's Encrypt) وبدّل لـ **Full (strict)**

---

## إعدادات EasyPanel (تأكد)

| Service | Branch | Source path | Port | Domain |
|---------|--------|-------------|------|--------|
| Store | `frontend` | *(فارغ)* | **3000** | larabeauty.store + HTTPS |
| API | `backend` | *(فارغ)* | **8000** | api.larabeauty.store + HTTPS |

Repo: `lara-beauty-store-gcc/laragccbackend`

---

## شنو ما تديرش

- ما تضغطش « Continuer vers le site » للزبائن — غير للتست
- ما تصلّحش هاد المشكل بـ push GitHub — SSL كيتدار فالسيرفر

---

## Test من بعد الإصلاح

- https://larabeauty.store/ — قفل أخضر فـ Chrome
- https://larabeauty.store/api/health
- https://api.larabeauty.store/health
