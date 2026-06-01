export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  routineNameLocal: string;
  routineNameEnglish: string;
  category: string;
  format: string;
  problem: string;
  mainIngredient: string;
  cardHeadline: string;
  cardSubheadline: string;
  rating: number;
  reviewsCount: number;
  priceFrom: number;
  imageUrl: string;
  imageAlt: string;
  badgeText: string;
  placeholderHue: 'teal' | 'amber' | 'indigo';
};

export const products: Product[] = [
  {
    id: 'memory-focus',
    slug: 'memory-focus',
    sku: 'LARA-MEM-01',
    name: 'علكات لارا لدعم الذاكرة والتركيز',
    shortName: 'الذاكرة والتركيز',
    routineNameLocal: 'روتين الذاكرة',
    routineNameEnglish: 'Memory Routine',
    category: 'cognitive',
    format: 'gummies',
    problem: 'النسيان وضعف التركيز',
    mainIngredient: 'أوميغا 3 + فيتامينات B',
    cardHeadline: 'ذاكرة أوضح وتركيز أطول',
    cardSubheadline:
      'تركيبة يومية تدعم الوظائف المعرفية — مثالية للشغل، الدراسة، واليوم المزدحم.',
    rating: 4.9,
    reviewsCount: 248,
    priceFrom: 14.5,
    imageUrl: '',
    imageAlt: 'علكات لارا لدعم الذاكرة والتركيز',
    badgeText: 'لارا • روتين الذاكرة',
    placeholderHue: 'teal',
  },
  {
    id: 'energy-vitality',
    slug: 'energy-vitality',
    sku: 'LARA-ENR-01',
    name: 'علكات لارا لدعم الطاقة والحيوية',
    shortName: 'الطاقة والحيوية',
    routineNameLocal: 'روتين الطاقة',
    routineNameEnglish: 'Energy Routine',
    category: 'energy',
    format: 'gummies',
    problem: 'التعب وقلة النشاط',
    mainIngredient: 'فيتامين B12 + حديد',
    cardHeadline: 'طاقة طبيعية بدون تهيج',
    cardSubheadline:
      'علكات يومية تساعدك تحسينين حيويتك — من غير كافيين زايد ولا انهيار بعد الظهر.',
    rating: 4.8,
    reviewsCount: 312,
    priceFrom: 14.5,
    imageUrl: '',
    imageAlt: 'علكات لارا لدعم الطاقة والحيوية',
    badgeText: 'لارا • روتين الطاقة',
    placeholderHue: 'amber',
  },
  {
    id: 'magnesium-sleep',
    slug: 'magnesium-sleep',
    sku: 'LARA-MG-01',
    name: 'علكات المغنيسيوم للنوم والاسترخاء',
    shortName: 'النوم والاسترخاء',
    routineNameLocal: 'روتين النوم',
    routineNameEnglish: 'Sleep Routine',
    category: 'sleep',
    format: 'gummies',
    problem: 'صعوبة النوم والتوتر',
    mainIngredient: 'مغنيسيوم + L-ثيانين',
    cardHeadline: 'نوم أهدأ وجسم أخف',
    cardSubheadline:
      'مغنيسيوم بجرعة مدروسة يساعد على الاسترخاء قبل النوم — بدون إدمان أو صداع الصباح.',
    rating: 4.9,
    reviewsCount: 276,
    priceFrom: 14.5,
    imageUrl: '',
    imageAlt: 'علكات المغنيسيوم للنوم والاسترخاء',
    badgeText: 'لارا • روتين النوم',
    placeholderHue: 'indigo',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
