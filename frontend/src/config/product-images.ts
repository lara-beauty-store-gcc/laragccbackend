/** Product shots in public/images/products/ — use simple filenames (no spaces) for reliable deploy */
const BASE = '/images/products';

export const PRODUCT_COLLECTION_IMAGES = {
  'magnesium-sleep': `${BASE}/magnesium-sleep.png`,
  'epimedium-energy': `${BASE}/epimedium-energy.png`,
  'focus-clarity': `${BASE}/focus-clarity.png`,
} as const;

export const homeHeroImagePath = `${BASE}/home-hero.png`;

export function collectionImageFor(slug: keyof typeof PRODUCT_COLLECTION_IMAGES) {
  return PRODUCT_COLLECTION_IMAGES[slug];
}

/** Product page images: upload to public/images/products/{slug}/ on GitHub */
const PAGE = `${BASE}`;

export type ProductPageSlug = keyof typeof PRODUCT_COLLECTION_IMAGES;

/** Hero only — other slots stay placeholder until you upload more files */
export function productPageHero(slug: ProductPageSlug) {
  const hero = `${PAGE}/${slug}/hero.png`;
  return {
    heroBeforeAfter: hero,
    heroProduct: hero,
  };
}

/** All page sections — use only when every file exists in the folder */
export function productPageImagesFull(slug: ProductPageSlug) {
  const dir = `${PAGE}/${slug}`;
  return {
    ...productPageHero(slug),
    problemImage: `${dir}/problem.png`,
    ingredientImage: `${dir}/ingredients.png`,
    authorityImage: `${dir}/authority.png`,
    lifestyleImage: `${dir}/lifestyle.png`,
    testimonialImage: `${dir}/testimonial.png`,
    comparisonImage: `${dir}/comparison.png`,
  };
}
