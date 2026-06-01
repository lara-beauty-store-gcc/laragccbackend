# 04 — CRO Playbook (12/10 DTC)

## North star metrics

| Metric | Target |
|--------|--------|
| AOV | **≥ 23 KWD** (push 29 KWD bundles) |
| Cart attach (cross-sell) | ≥ 25% add second SKU |
| Upsell take rate | ≥ 15% @ 9 KWD |
| Checkout start → order | ≥ 60% |
| Confirmation rate (COD) | Maximize via phone validation + trust |

## Pricing psychology

- **Anchor high:** show "قيمة الروتين 48 د.ك" crossed → bundle 29
- **Decoy:** 1× @ 16 makes 2× @ 23 look smart; 3× @ 29 = "أفضل قيمة"
- **Per-unit math:** "≈ 9.7 د.ك للعلبة" under 3-pack
- **COD:** repeat "ما في دفع أونلاين" every major step

## Homepage CRO order

1. Trust bar (COD + Kuwait shipping + guarantee)
2. Hero: outcome + 3 product visual + primary CTA
3. Trust badges row (4 icons)
4. Featured products (3 cards → PDP)
5. Why Lara (authority cards)
6. Social proof strip (reviews)
7. How it works (3 steps COD)
8. Ingredient/science teaser
9. FAQ
10. Final CTA band (green)
11. Footer (links + disclaimer)

## Product page CRO order

1. Sticky bar: back + price from
2. Product image placeholder (large)
3. H1 + stars + review count
4. **Bundle selector** (radio cards — default **3-pack** preselected)
5. Scarcity: "الدفعة الحالية: باقي 23 علبة" (configurable, don't fake illegal scarcity)
6. Primary CTA: **أضيفي للسلة وشوفي السلة**
7. Trust microcopy under CTA
8. Sections (alternating L/R desktop):
   - Pain agitation
   - Solution / mechanism
   - Ingredients
   - How to use
   - Timeline ("متى تلاحظين الفرق")
   - Comparison table
   - Reviews
   - FAQ
   - Final bundle CTA (repeat selector)

## Cart drawer

- Line items with bundle label ("3 علبات — نوم")
- Subtotal + "التوصيل: مجاني داخل الكويت" (if policy)
- **Cross-sell:** 2 cards — other products not in cart
  - Headline: "كمّلي الروتين"
  - One-click add
- Scarcity: "احجزي طلبچ — الدفع عند الاستلام"
- CTA: **إتمام الطلب**

## Checkout popup

- Order summary (items, total KWD 3 decimals)
- Mini social proof: "أكثر من 2,400 طلب في الكويت" (config)
- Fields: **الاسم** · **رقم الجوال**
- Trust bullets + COD reminder
- CTA: **أكّدي الطلب**

## Upsell modal (10–15 seconds)

- Timer bar 15s auto-continue if no action
- Show **one** relevant product (rules in [products-catalog.md](./11-products-catalog.md))
- Price **9.000 KWD** only here — "عرض خاص مع طلبچ"
- Buttons: **نعم أضيفي** / **لا شكراً**
- On yes: append upsell line item, recalc total, then submit order

## Thank you page

- Confirm order ID
- "بنتصل فيچ خلال ساعات العمل لتأكيد العنوان"
- WhatsApp optional (config)
- **Do not** fire Purchase pixel twice

## Scarcity & urgency (ethical)

- Low stock from config `stockHint` per SKU
- Timer only in upsell modal (real countdown)
- No fake "50 people viewing"

## Cross-sell matrix

| Cart contains | Cross-sell priority |
|---------------|---------------------|
| Magnesium | Focus, then Epimedium |
| Epimedium | Magnesium, then Focus |
| Focus | Magnesium, then Epimedium |

## Confirmation / delivery rate

- Validate phone before submit (reduces fake orders)
- Show "تأكديلك رقمچ صحيح — بنتصل فيچ"
- Backend log `phone_validated: true`

## A/B hooks (future)

- Default bundle: 3-pack vs 2-pack
- Upsell product rotation
- Hero video vs static
