# Google Sheets Integration

## Setup

1. Open your Google Sheet: **Sheet Orders Lara beauty**
2. **Extensions → Apps Script** → paste [ORDERS_WEBHOOK.gs](./ORDERS_WEBHOOK.gs)
3. Set `SCRIPT_SECRET = 'lara-beauty-secret-2026'` (same as backend `SHEETS_WEBHOOK_SECRET`)
4. **Deploy → New deployment → Web app**
   - Execute as: Me
   - Who has access: **Anyone**
5. Copy Web App URL → `GOOGLE_SHEETS_WEBHOOK_URL` in EasyPanel API service

**Important:** Use the URL **without** `/u/1/` if possible:
`https://script.google.com/macros/s/AKfycb.../exec`

The backend auto-strips `/u/1/` and handles Google’s 302 redirect correctly.

## Sheet columns (Tabellenblatt1)

| date | order id | country | name | phone | product | url | sku | quantite | totalprice | currency |

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
