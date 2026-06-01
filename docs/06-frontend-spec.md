# 06 — Frontend Specification

## Stack

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.x | App Router, SSR/SSG |
| react | 18.x | UI |
| typescript | 5.x | Types |
| tailwindcss | 3.x | Styling |
| zustand or react context | latest | Cart state (persist localStorage) |
| zod | 3.x | Form/phone validation |
| lucide-react | latest | Icons |

Optional:

- `@next/third-parties` — deferred Google if needed
- `partytown` — advanced pixel isolation (if perf budget allows)

## Config files (no hardcoded marketing in components)

```
src/config/
  business.ts      # brand, market, design tokens
  products.ts      # 3 products + bundles
  navigation.ts    # menu/footer links
  copy.ts          # OR generate from lib/copy-engine.ts
```

## Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About us |
| `/contact` | Contact |
| `/collections/all` | All products |
| `/products/[slug]` | Product PDP |
| `/thank-you` | Order confirmation |

## Key components

See [pages-structure.md](./12-pages-structure.md) for section lists.

### Cart store shape

```ts
type CartLine = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  bundleId: 'b1' | 'b2' | 'b3';
  qty: number;        // bundle count (each bundle has inner qty from offer)
  unitPriceKwd: number;
  lineTotalKwd: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  addBundle: (product, bundleId) => void;
  addUpsell: (product) => void;
  removeLine: (id) => void;
  openCart: () => void;
};
```

### Product page CTA behavior

```ts
function onPrimaryCta() {
  addBundle(selectedProduct, selectedBundleId);
  openCart(); // REQUIRED
}
```

## API client

```ts
const API = process.env.NEXT_PUBLIC_API_URL; // https://api.larabeauty.store

POST ${API}/api/v1/orders
Body: OrderCreatePayload
```

## Sample images

Create SVG placeholders under `public/placeholders/` — reference in `PremiumImagePlaceholder.tsx`.

When `product.imageUrl` empty → use `/placeholders/product-{slug}.svg`.

## Responsive breakpoints

- default: mobile
- `md:` 768px — 2-col where needed
- `lg:` 1024px — split sections side-by-side

## SEO

- `metadata` per page Arabic titles
- OpenGraph placeholder
- `larabeauty.store` canonical

## Performance budget

- LCP &lt; 2.5s on 4G
- No pixel scripts in `<head>` blocking — see tracking doc
- `next/image` for all raster later

## Dockerfile

Multi-stage Next `output: 'standalone'` — port 3000.

## Files to deliver

- `frontend/Dockerfile`
- `frontend/.env.example`
- `frontend/package.json`
- Full `src/` per specs
