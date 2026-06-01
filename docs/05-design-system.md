# 05 — Design System

## Brand colors (chosen — until logo upload)

| Token | Hex | Usage |
|-------|-----|--------|
| `primary` | `#1B4332` | Headers, CTA, icons |
| `primary-dark` | `#0F2922` | Hover, footer band |
| `accent` | `#C9A227` | Stars, badges, secondary CTA |
| `accent-soft` | `#E8D5A3` | Borders, highlights |
| `surface` | `#F7F4EE` | Page background (warm cream) |
| `card` | `#FFFFFF` | Cards |
| `ink` | `#1A2E28` | Body text |
| `muted` | `#5C6B66` | Secondary text |
| `border` | `#E5DDD0` | Dividers |
| `success` | `#2D6A4F` | Validation OK |
| `error` | `#B91C1C` | Errors |

Logo placeholder: circle `primary` bg + gold Arabic **ل** until `public/logo.png` provided.

## Typography

- **Arabic:** `Noto Kufi Arabic` (Google Fonts) — weights 400, 600, 700
- **English subtitle:** `Inter` or system-ui, 10–12px tracking under Arabic name
- **Scale:** mobile-first
  - H1: 1.75–2rem bold
  - H2: 1.25–1.5rem bold
  - Body: 0.875–1rem, line-height 1.7

## Spacing & radius

- Container max-width: `32rem` mobile, `72rem` desktop centered
- Card radius: `1rem` (`rounded-2xl`)
- Button radius: `0.75rem` (`rounded-xl`)
- Section padding: `py-10` mobile, `py-16` desktop

## Layout — alternating sections (desktop)

Odd sections: **image left · text right** (RTL: image on visual right = `flex-row-reverse` in RTL)

Even sections: **text left · image right**

Mobile: stack image top, text below.

Implement via `<SplitSection reverse={index % 2 === 1} />`.

## Components library

| Component | Notes |
|-----------|--------|
| `SiteHeader` | sticky, logo+brand, menu, cart |
| `AnnouncementBar` | primary bg, white text |
| `BundleSelector` | 3 radio cards, preselect 3-pack |
| `ProductCard` | image, badge, stars, price from |
| `CartDrawer` | slide from left (RTL), cross-sells |
| `CheckoutModal` | centered sheet |
| `UpsellModal` | countdown 15s |
| `FAQAccordion` | + icon rotate |
| `ReviewCard` | beige bg, stars, Kuwait meta |
| `TrustBadge` | icon + label |
| `PlaceholderImage` | SVG per product hue |

## Imagery placeholders

Generate SVG placeholders in `frontend/public/placeholders/`:

- `hero-home.svg` — 3 bottles silhouette
- `product-magnesium.svg` — indigo/lavender mood
- `product-epimedium.svg` — amber/green mood
- `product-focus.svg` — teal/blue mood
- `section-ingredient.svg` — abstract leaves/molecules

Client replaces with JPG/WebP later — keep `imageUrl` in config empty → fallback placeholder.

## Motion

- Subtle: `transition-shadow`, `hover:scale-[1.02]` on cards
- Cart drawer: `transform translate` 300ms ease
- No heavy parallax (perf + Snap traffic)

## Icons

Lucide React or inline SVG — consistent 20–24px stroke.

## Accessibility

- RTL `dir="rtl"` on `<html>`
- Focus rings on buttons
- `aria-expanded` on FAQ
- Form labels associated
