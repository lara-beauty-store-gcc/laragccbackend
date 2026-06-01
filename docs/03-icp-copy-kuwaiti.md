# 03 — ICP & Kuwaiti Copy Guidelines

## Primary ICP

| Attribute | Detail |
|-----------|--------|
| Geo | Kuwait only (v1) |
| Age | 25–55 |
| Gender | Men & women (slight skew women for wellness) |
| Income | Middle to upper-middle — willing to pay **16–29 KWD** if trust is high |
| Channels | TikTok, Snapchat, Instagram Reels (UGC / AI video) |
| Behavior | Buys COD; compares reviews; fears scam shops |

## Pain language (use in headlines)

- "تعبانة من غير سبب؟" / "تشتت بالشغل؟" / "ما تنامين زين؟"
- "جربتي فيتامينات وما حسيتي شي؟"
- "ما أبي أدفع أونلاين وأخاف من النصب"

## Trust language

- "دفع عند الاستلام — تدفعين لما يوصلك"
- "اسم ورقم بس"
- "فريقنا يتصل ويأكد العنوان"
- "ضمان 30 يوم — ما عجبچ؟ نرجع لچ فلوسچ"

## Kuwaiti dialect cues (not full Saudization)

| Prefer (KW) | Avoid (SA-heavy) |
|-------------|------------------|
| چ / چذي (sparingly) | حبيبتي / عزيزتي (too retail SA) |
| شنو / ليش | إيش / ليه (OK sometimes) |
| زين / حيل | مرّة / كثير (SA) |
| يوصلكم / نتصل فيچ | يوصلك مباشرة (formal) |
| كي نت | مدى (unless you mean SA) |

Keep **Modern Standard Arabic** base for clarity; sprinkle Kuwaiti flavor in CTAs and FAQs.

## Phone validation — **Kuwait (+965)**

> Client once wrote "KSA numbers" — **store is Kuwait**. Validate **+965** only.

Rules:

- Country code: `965`
- Local mobile: 8 digits, typically starts with `5`, `6`, or `9`
- Accept input: `50001234`, `050001234`, `+96550001234`, `96550001234`
- Normalize storage: `+96550001234` (E.164)
- Reject: wrong length, landlines if you want mobile-only, non-KW codes

Example regex (adjust in code):

```regex
^(?:\+?965)?0?(5|6|9)\d{7}$
```

Error copy: `رقم جوال كويتي غير صحيح — مثال: 50001234`

## Copy blocks to generate per product

- Hero H1 + sub (pain → promise)
- 3 bullet benefits (ingredient-backed)
- "Who it's for" / "Who it's not for"
- How to use (2 gummies daily, etc. — placeholder OK)
- Ingredient spotlight (300–500 chars)
- Comparison table vs "generic vitamins"
- FAQ (5–7, Kuwait-specific)
- Reviews (3+ with Kuwait areas)

## Compliance (Kuwait)

- No guaranteed cure claims
- Use: يدعم، يساعد، قد يساهم، للاسترخاء، للتركيز
- Supplement disclaimer in footer: "المنتج مكمل غذائي وليس بديلاً عن استشارة طبية"

## English on site

Brand subtitle **Lara Beauty** only in header/footer — body copy **Arabic**.
