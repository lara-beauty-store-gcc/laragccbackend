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
