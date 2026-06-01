# 08 — Database Schema

**Database name:** `larabeauty`

## Tables

### `orders`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| order_number | VARCHAR(32) UNIQUE | e.g. `LARA-20260601-ABC123` |
| customer_name | VARCHAR(255) | |
| phone_e164 | VARCHAR(20) | +965... |
| phone_display | VARCHAR(20) | |
| area_notes | TEXT NULL | optional address/area from future |
| subtotal_kwd | DECIMAL(10,3) | |
| total_kwd | DECIMAL(10,3) | |
| currency | CHAR(3) | KWD |
| payment_method | VARCHAR(10) | COD |
| status | VARCHAR(20) | pending_confirmation, confirmed, cancelled |
| upsell_accepted | BOOLEAN | |
| upsell_product_id | VARCHAR(50) NULL | |
| upsell_amount_kwd | DECIMAL(10,3) NULL | |
| event_id | VARCHAR(64) | for pixel/CAPI dedup |
| source_url | TEXT NULL | |
| client_ip | INET NULL | |
| user_agent | TEXT NULL | |
| sheet_synced | BOOLEAN DEFAULT false | |
| sheet_sync_error | TEXT NULL | |
| created_at | TIMESTAMPTZ | |

### `order_items`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| order_id | UUID FK | |
| product_id | VARCHAR(50) | |
| sku | VARCHAR(50) | |
| product_name | VARCHAR(255) | snapshot |
| bundle_id | VARCHAR(10) | b1,b2,b3,UPSELL |
| quantity | INT | packs |
| unit_price_kwd | DECIMAL(10,3) | |
| line_total_kwd | DECIMAL(10,3) | |

### `capi_event_log` (optional but recommended)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| event_id | VARCHAR(64) UNIQUE | |
| event_name | VARCHAR(50) | Purchase |
| platforms | JSONB | {meta:ok,tiktok:ok} |
| created_at | TIMESTAMPTZ | |

## Alembic

- Initial revision: `001_initial`
- Seed: none (products from frontend config; backend stores snapshots only)

## Connection string

```env
DATABASE_URL=postgres://larabeauty:CHANGE_ME@larabeauty_database:5432/larabeauty?sslmode=disable
```

Use real password from EasyPanel secrets in production.

## Indexes

- `orders(created_at DESC)`
- `orders(phone_e164)`
- `order_items(order_id)`
