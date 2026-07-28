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

**Important:** Replace your Apps Script with [ORDERS_WEBHOOK.gs](./ORDERS_WEBHOOK.gs) and **Deploy → New version**. Old scripts can write `[Ljava.lang.Object;@...` garbage in cells.

Delete bad test rows in the sheet (empty name / weird product text).

## Backend payload example

```json
{
  "secret": "your-secret",
  "order_number": "LARA-20260601-A1B2C3",
  "date": "2026-06-01 12:00",
  "customer_name": "نورة",
  "phone_e164": "+971501234567",
  "country": "AE",
  "area_notes": "دبي — مارينا",
  "items": [{ "sku": "LARA-MG-01", "productName": "Magnesium Glycinate Gummies", "quantity": 2, "lineTotal": 239 }],
  "total_aed": 239,
  "totalprice": 239,
  "currency": "AED",
  "product": "Magnesium Glycinate Gummies x2",
  "url": "https://larabeauty.store/products/magnesium-sleep",
  "payment_method": "COD"
}
```
