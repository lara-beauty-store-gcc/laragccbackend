# تحديث Apps Script (ضروري للاسم الكامل و +971)

## المشكل
- الاسم كيوصل ناقص (مثال: `LISM` بدل `LISM LKAMIL`)
- التيليفون بلا `+` (مثال: `971888...` بدل `+971888...`)
- تأخير 2-3 دقايق = طلبات قديمة كتتسنى فالطابور

## الحل (5 دقايق)

1. افتح الشيت → **Extensions → Apps Script**
2. امسح الكود القديم → الصق محتوى ملف **`ORDERS_WEBHOOK.gs`** من هاد الـ repo
3. **Deploy → Manage deployments → Edit → New version → Deploy**
4. Who has access: **Anyone**

## بعد التحديث — test

```bash
curl -sS https://script.google.com/macros/s/AKfycbz9pzO6lTU_C1hKmlHDnIq6SbvQiVE2_Hny0Em5sJ_-yFhfvu0PCmFi8-0N9rI4-bHpsQ/exec
```

لازم يرجع: `"version":"2026-07-28-v2"`

## EasyPanel Store

بدّل الـ repo من `laragccfrontend` إلى:
- Repository: `laragccbackend`
- Branch: **`frontend`**

بعد deploy:
```bash
curl https://larabeauty.store/api/health
```
لازم: `"repo":"laragccbackend"`
