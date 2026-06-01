# 09 — Tracking: Web Pixels + CAPI

## Principles

| Layer | PII hashing | When |
|-------|-------------|------|
| **Browser (web pixel)** | **No** — send plain to pixel where allowed | PageView, ViewContent, AddToCart, InitiateCheckout |
| **Server (CAPI)** | **Yes** — SHA-256 normalized | Purchase (required), optional Lead |

**Dedup:** same `event_id` on browser Purchase and server Purchase.

Generate once per checkout:

```ts
const eventId = `purchase_${orderId}_${Date.now()}`;
```

Store in order row + pass to pixels + backend.

## Deferred web pixels (performance)

Load **after** `window.load` or `requestIdleCallback`:

```tsx
// next/script
<Script id="meta-pixel" strategy="lazyOnload" ... />
```

Or dynamic import in `useEffect` + idle callback.

**Do not** put blocking scripts in `<head>`.

### Platforms

| Platform | Web SDK | Env vars |
|----------|---------|----------|
| Meta | `fbevents.js` | `NEXT_PUBLIC_META_PIXEL_ID` |
| TikTok | `ttq` | `NEXT_PUBLIC_TIKTOK_PIXEL_ID` |
| Snap | `snaptr` | `NEXT_PUBLIC_SNAP_PIXEL_ID` |

## Event map

| Funnel step | Web event | CAPI |
|-------------|-----------|------|
| Home view | PageView | — |
| PDP view | ViewContent | — |
| Add bundle | AddToCart | — |
| Open checkout | InitiateCheckout | — |
| Order complete | **Purchase** | **Purchase** |

## Meta

### Web (no hash)

```js
fbq('track', 'Purchase', {
  value: total,
  currency: 'KWD',
  content_ids: skus,
}, { eventID: eventId });
```

### CAPI (hash required)

Phone normalization for **Meta `ph`**:

- Strip `+`, spaces, dashes, parentheses
- Kuwait example: `+965 5000 1234` → `96550001234` (digits only, country code included, no leading zero on national part)
- SHA-256 lowercase hex

```python
import hashlib, re
def meta_hash_phone(e164: str) -> str:
    digits = re.sub(r'\D', '', e164)
    if digits.startswith('965') and len(digits) == 11:
        pass  # OK
    normalized = digits  # 96550001234
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()
```

Email `em`: lowercase trim → sha256.

Reference: [Meta customer information parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/)

## TikTok

### Web

```js
ttq.track('CompletePayment', { value, currency: 'KWD' }, { event_id: eventId });
```

### CAPI / Events API

Phone: **E.164 with `+`** before hash per TikTok docs — e.g. `+96550001234`

```python
def tiktok_hash_phone(e164: str) -> str:
    if not e164.startswith('+'):
        e164 = '+' + e164.lstrip('+')
    return hashlib.sha256(e164.encode('utf-8')).hexdigest()
```

Confirm in implementation against latest TikTok Events API docs.

## Snapchat

### Web

```js
snaptr('track', 'PURCHASE', { price: total, currency: 'KWD', transaction_id: orderId });
```

### CAPI

`hashed_phone_number`: digits only with country code, no `+` — e.g. `96550001234` → SHA-256

Reference: [Snap parameters](https://developers.snap.com/api/marketing-api/Conversions-API/Parameters)

## Backend env (secrets — never in frontend)

```env
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_API_VERSION=v21.0
TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=
SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=
ENABLE_META_CAPI=true
ENABLE_TIKTOK_CAPI=true
ENABLE_SNAP_CAPI=true
```

## Frontend env (public pixels only)

```env
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=
```

## Consent (Kuwait)

v1: implicit by use — add cookie banner in v2 if legal requires.

## Testing

- Meta Events Manager → Test Events
- TikTok Events Manager → Test
- Snap Pixel Helper
- Verify dedup: one Purchase in UI per order, matched event_id

## Kuwait vs KSA phone note

Store validates **+965**. CAPI hashing uses Kuwait normalization. Do not use +966 unless expanding to Saudi later.
