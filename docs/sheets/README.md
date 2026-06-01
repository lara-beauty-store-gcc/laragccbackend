# Google Sheets Integration

## Setup

1. Create a new Google Sheet named **Lara Beauty Orders**
2. Import headers from [orders-template.csv](./orders-template.csv) OR let script auto-create
3. **Extensions → Apps Script** → paste [ORDERS_WEBHOOK.gs](./ORDERS_WEBHOOK.gs)
4. Set `SCRIPT_SECRET` to a long random string
5. **Deploy → New deployment → Web app**
   - Execute as: Me
   - Who has access: **Anyone**
6. Copy Web App URL → `GOOGLE_SHEETS_WEBHOOK_URL` in backend EasyPanel
7. Set `SHEETS_WEBHOOK_SECRET` to the same value as `SCRIPT_SECRET`

## Backend payload example

```json
{
  "secret": "your-secret",
  "order_number": "LARA-20260601-A1B2C3",
  "created_at": "2026-06-01T12:00:00Z",
  "customer_name": "نورة",
  "phone_e164": "+96550001234",
  "area_notes": "حولي",
  "items": [{ "sku": "LARA-MG-01", "bundleId": "b3", "lineTotalKwd": 29 }],
  "subtotal_kwd": 29,
  "total_kwd": 29,
  "currency": "KWD",
  "payment_method": "COD",
  "upsell_accepted": false,
  "event_id": "purchase_xxx",
  "source_url": "https://larabeauty.store/products/magnesium-sleep",
  "status": "pending_confirmation"
}
```
