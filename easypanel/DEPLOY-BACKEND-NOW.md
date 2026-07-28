# EasyPanel — Backend API (حل Build Path)

EasyPanel **ما كيقبلش** Build Path فارغ ولا `/`.

## ✅ الإعداد الصحيح (اختار واحد)

### الطريقة 1 — الأسهل (ننصحك بها)

| الحقل | القيمة |
|--------|--------|
| Branch | `main` |
| Build Path | `backend` |
| Port | `8000` |

### الطريقة 2 — فرع backend

| الحقل | القيمة |
|--------|--------|
| Branch | `backend` |
| Build Path | `.` |
| Port | `8000` |

**`.` = نقطة واحدة فقط** (الجذر ديال الفرع)

---

## ❌ ما تستعملش

| Build Path | النتيجة |
|------------|---------|
| `/` | Invalid ❌ |
| فارغ | ما كيقبلش ❌ |
| `backend` مع branch `backend` | غلط ❌ |

---

## Test

```bash
curl https://api.larabeauty.store/health
```
