# 11 — Products Catalog

## SKU config (single source: `frontend/src/config/products.ts` + mirror in backend)

### Product 1 — Sleep

```yaml
id: magnesium-sleep
slug: magnesium-sleep
sku: LARA-MG-01
name_ar: علكات المغنيسيوم لتحسين جودة النوم
shortName: النوم
routineLabel: لارا • روتين النوم
problem: أرق وتوتر ونوم خفيف
mainIngredient: مغنيسيوم + L-ثيانين
placeholderHue: indigo
crossSellPriority: [epimedium-energy, focus-clarity]
upsellFor: [epimedium-energy, focus-clarity]  # when cart has others
```

### Product 2 — Energy

```yaml
id: epimedium-energy
slug: epimedium-energy
sku: LARA-EP-01
name_ar: علكات عشبة العنزة ضد الإرهاق والتعب
shortName: الطاقة
routineLabel: لارا • روتين الطاقة
problem: إرهاق وتعب وخمول
mainIngredient: عشبة العنزة (Epimedium) + فيتامين B
placeholderHue: amber
crossSellPriority: [magnesium-sleep, focus-clarity]
```

### Product 3 — Focus

```yaml
id: focus-clarity
slug: focus-clarity
sku: LARA-FC-01
name_ar: علكات ضد التشتت وضعف التركيز
shortName: التركيز
routineLabel: لارا • روتين التركيز
problem: تشتت وضعف تركيز
mainIngredient: أوميغا 3 + فيتامينات B
placeholderHue: teal
crossSellPriority: [magnesium-sleep, epimedium-energy]
```

## Bundle offers (identical per product)

```ts
export const bundleOffers = [
  { id: 'b1', qty: 1, priceKwd: 16.0, label: 'علبة وحدة', badge: null },
  { id: 'b2', qty: 2, priceKwd: 23.0, label: 'علبتين', badge: 'الأكثر طلباً' },
  { id: 'b3', qty: 3, priceKwd: 29.0, label: '3 علبات', badge: 'أفضل قيمة' },
] as const;
```

Default selected: **`b3`** (max AOV).

## Checkout upsell (9 KWD only)

```ts
export const UPSELL_PRICE_KWD = 9.0;

// Pick first cross-sell SKU not already in cart
function getUpsellProduct(cartProductIds: string[]): Product { ... }
```

| Cart has | Upsell product |
|----------|----------------|
| magnesium-sleep only | epimedium-energy |
| epimedium-energy only | magnesium-sleep |
| focus-clarity only | magnesium-sleep |
| 2+ products | cheapest not in cart OR rotate |

Upsell bundle: always **1 unit @ 9 KWD** (special line `UPSELL-9`).

## Collection page

Route: `/collections/all` — grid of 3 products with card headline/sub from config.

## Card copy pattern

- **Headline:** outcome (4–6 words)
- **Subheadline:** mechanism hint (1 sentence)
- **Stars:** 4.8–4.9 (config)
- **Scarcity:** optional `stockHint`

Example magnesium card:

- H: "نوم أهدأ يبدأ من الليلة"
- Sub: "مغنيسيوم بجرعة يومية تساعد على الاسترخاء قبل النوم"

## Ingredient claims (soft)

Do not claim cure. Use "يدعم", "يساعد", "للمساعدة على".

## Full routine bundle (future)

Not v1 — but copy can tease "الروتين الكامل" linking 3 PDPs.
