# 10 — Checkout & COD Flow

## State machine

```
PDP → [Select bundle] → CTA → Cart Open
Cart → [Cross-sell add?] → CTA → Checkout Modal
Checkout Modal → [Valid name+phone] → CTA → Upsell Modal (15s)
Upsell → Yes/No/Timeout → POST /api/v1/orders → Thank You
```

## Cart drawer UI

- Slide from **start** side in RTL (right visually)
- List lines with bundle description: "3 علبات — علكات المغنيسيوم..."
- Remove line button
- Cross-sell section (max 2 cards)
- Footer: subtotal, "الشحن مجاني" (if policy), total
- Primary: **إتمام الطلب — دفع عند الاستلام**

## Checkout modal

Fields:

| Field | Validation |
|-------|------------|
| `customerName` | min 2 chars Arabic/Latin |
| `phone` | Kuwait mobile — see [03-icp-copy-kuwaiti.md](./03-icp-copy-kuwaiti.md) |

Display:

- Order summary table
- Total KWD (3 decimals: `29.000`)
- Social proof line
- Scarcity: "باقي X طلبات اليوم" (config)

On submit click:

1. Validate → if fail show inline errors
2. Open upsell modal (do NOT POST yet)

## Upsell modal (10–15 seconds)

- Progress bar countdown **15s** → auto "No" and proceed
- Copy: "عرض لمرة وحدة مع طلبچ — [product name] بـ **9 د.ك** فقط"
- Yes → add upsell line to pending order payload
- No / timeout → proceed without upsell

## Order payload

```json
{
  "customerName": "نورة العتيبي",
  "phone": "50001234",
  "phoneCountry": "965",
  "items": [
    {
      "productId": "magnesium-sleep",
      "sku": "LARA-MG-01",
      "name": "علكات المغنيسيوم لتحسين جودة النوم",
      "bundleId": "b3",
      "quantity": 1,
      "unitPriceKwd": 29.0,
      "lineTotalKwd": 29.0
    }
  ],
  "upsell": {
    "accepted": true,
    "productId": "focus-clarity",
    "sku": "LARA-FC-01",
    "priceKwd": 9.0
  },
  "subtotalKwd": 38.0,
  "totalKwd": 38.0,
  "currency": "KWD",
  "paymentMethod": "COD",
  "eventId": "purchase_LARA-xxx",
  "sourceUrl": "https://larabeauty.store/products/magnesium-sleep",
  "fbc": "cookie|null",
  "fbp": "cookie|null",
  "ttclid": "cookie|null"
}
```

## After successful POST

1. Fire web pixels Purchase with `eventId`
2. `router.push(/thank-you?order={orderNumber})`
3. Clear cart localStorage

## Thank you page

- Show order number
- WhatsApp CTA optional: `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Do not duplicate Purchase event on refresh (use session flag `purchaseFired`)

## Google Sheets sync

Backend POSTs to Apps Script — see [sheets/ORDERS_WEBHOOK.gs](./sheets/ORDERS_WEBHOOK.gs)

## Error handling

| Error | UX |
|-------|-----|
| 400 phone | Arabic inline message |
| 500 server | "صار خطأ — حاولي مرة ثانية أو واتساب" |
| Sheet fail | Order still saved DB; log `sheet_synced=false` |
