/** ChatGPT product shots in public/images/products/ */
const BASE = '/images/products';

export function productImagePath(filename: string) {
  return `${BASE}/${encodeURIComponent(filename)}`;
}

export const PRODUCT_COLLECTION_FILES = {
  'magnesium-sleep': 'ChatGPT Image Jun 4, 2026, 04_59_07 PM.png',
  'epimedium-energy': 'ChatGPT Image Jun 4, 2026, 04_59_13 PM.png',
  'focus-clarity': 'ChatGPT Image Jun 4, 2026, 05_01_37 PM.png',
} as const;

/** All three bottles — homepage hero */
export const HOME_HERO_IMAGE_FILE = 'ChatGPT Image Jun 4, 2026, 05_20_40 PM.png';

export function collectionImageFor(slug: keyof typeof PRODUCT_COLLECTION_FILES) {
  return productImagePath(PRODUCT_COLLECTION_FILES[slug]);
}

export const homeHeroImagePath = productImagePath(HOME_HERO_IMAGE_FILE);
