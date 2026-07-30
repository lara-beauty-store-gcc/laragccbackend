export const businessConfig = {
  brand: {
    nameLocal: 'لارا للجمال',
    nameEnglish: 'LARA BEAUTY',
    tagline: 'علكات يومية تدعم جسمك من الداخل',
    description:
      'علكات لارا — تركيبات مدروسة للنوم، الطاقة، والتركيز. دفع عند الاستلام داخل الإمارات.',
    logoUrl: '',
    iconUrl: '',
  },
  market: {
    countryName: 'الإمارات',
    countryCode: 'AE',
    language: 'ar',
    direction: 'rtl' as const,
    currency: 'AED',
    currencySymbol: 'د.إ',
    phoneCountryCode: '+971',
    phoneExample: '501234567',
  },
  delivery: {
    emirates: [
      'دبي',
      'أبوظبي',
      'الشارقة',
      'عجمان',
      'رأس الخيمة',
      'الفجيرة',
      'أم القيوين',
      'دبي مارينا',
      'جبل علي',
      'العين',
    ],
  },
  cod: {
    enabled: true,
    paymentLabel: 'دفع عند الاستلام — بدون دفع أونلاين',
    deliveryPromise: 'توصيل 2–4 أيام عمل لكل إمارات الدولة',
    confirmationPromise: 'فريقنا يتصل فيك خلال ساعات لتأكيد العنوان',
    returnGuarantee: 'ضمان استرجاع 30 يوم — فلوسك ترجع إذا ما عجبك الروتين',
  },
  social: {
    instagram: 'https://www.instagram.com/lara_beauty_gcc',
    tiktok: 'https://www.tiktok.com/@lara_beauty_gcc',
    facebook: 'https://www.facebook.com/profile.php?id=61592789362233',
    website: 'https://larabeauty.store',
    whatsapp: 'https://wa.me/12402107635',
  },
  whatsapp: {
    e164: '+12402107635',
    display: '+1 (240) 210-7635',
    defaultMessage: 'مرحباً لارا للجمال، عندي استفسار عن المنتجات والطلب 🌿',
  },
  design: {
    primaryColor: '#134E3A',
    primaryDarkColor: '#0F3D2E',
    accentColor: '#C8A55C',
    backgroundColor: '#FBF8F2',
    cardColor: '#FFFFFF',
    textColor: '#1A2E22',
    mutedTextColor: '#5F6B62',
    borderColor: '#E5DFCD',
    primarySoftColor: '#E8EFE9',
    secondarySoftColor: '#F5EDD8',
    surfaceRoseColor: '#F5F0E5',
    themeColor: '#134E3A',
  },
};

/** @deprecated use businessConfig — kept for existing imports */
export const businessInputs = businessConfig;
