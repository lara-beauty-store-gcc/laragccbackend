# Product images

## Homepage (collection cards + hero)

| File | Product |
|------|---------|
| `magnesium-sleep.png` | بطاقة روتين النوم |
| `epimedium-energy.png` | بطاقة روتين الطاقة |
| `focus-clarity.png` | بطاقة روتين التركيز |
| `home-hero.png` | صورة كبيرة فوق homepage |

**منفصل** عن مجلدات `focus-clarity/` (صفحة المنتج).

## Product pages (صفحة كل منتج)

مجلد لكل منتج على GitHub:

```
frontend/public/images/products/
├── focus-clarity/     → larabeauty.store/products/focus-clarity
│   ├── hero.png       ← الصورة فوق (الأهم)
│   ├── problem.png
│   └── ingredients.png
├── magnesium-sleep/
└── epimedium-energy/
```

**GitHub:** Add file داخل المجلد → Commit `main` → Redeploy.

See `focus-clarity/README.md` for full guide.
