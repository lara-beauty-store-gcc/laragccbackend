# صور صفحة المنتج — روتين التركيز

**GitHub path:**  
`frontend/public/images/products/focus-clarity/`

**URL على الموقع:**  
`https://larabeauty.store/images/products/focus-clarity/اسم-الملف.png`

---

## الملفات (سمّيهم هكذا بالضبط)

| الملف | فين كيبان فالصفحة |
|--------|-------------------|
| **`hero.png`** | الصورة الكبيرة فوق (أهم وحدة) |
| `problem.png` | قسم «ليش يصير هالشي؟» |
| `ingredients.png` | قسم المكوّنات |
| `authority.png` | جودة وثقة (اختياري) |
| `lifestyle.png` | (اختياري) |
| `comparison.png` | (اختياري) |

**أسماء بسيطة** — بلا مسافات، بلا `ChatGPT Image...`

---

## كيف تزيديهم فـ GitHub

1. افتح: https://github.com/lara-beauty-store-gcc/laragccbackend  
2. `frontend` → `public` → `images` → `products` → `focus-clarity`  
3. **Add file** → ارفع `hero.png` (وباقي الصور)  
4. Commit على **`main`**  
5. EasyPanel → Redeploy store  

---

## ربط تلقائي

منين ترفع الملفات، الكود فـ `src/config/products.ts` كيقراهم.  
إلا ما رفعتي `hero.png` بعد، الصورة ديال الـ homepage (`focus-clarity.png`) كتبان فوق مؤقتاً.
