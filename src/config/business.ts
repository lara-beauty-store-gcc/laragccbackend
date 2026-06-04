export const businessConfig = {
  brand: {
    nameLocal: 'لارا للجمال',
    nameEnglish: 'LARA BEAUTY',
    tagline: 'علكات يومية تدعم جسمك من الداخل',
    description:
      'علكات لارا — تركيبات مدروسة للنوم، الطاقة، والتركيز. دفع عند الاستلام داخل الكويت.',
    logoUrl: '',
    iconUrl: '',
  },
  market: {
    countryName: 'الكويت',
    countryCode: 'KW',
    language: 'ar',
    direction: 'rtl' as const,
    currency: 'KWD',
    currencySymbol: 'د.ك',
    phoneCountryCode: '+965',
    phoneExample: '50000000',
  },
  cod: {
    enabled: true,
    paymentLabel: 'دفع عند الاستلام — بدون دفع أونلاين',
    deliveryPromise: 'توصيل 2–4 أيام عمل لكل مناطق الكويت',
    confirmationPromise: 'فريقنا يتصل فيك خلال ساعات لتأكيد العنوان',
    returnGuarantee: 'ضمان استرجاع 30 يوم — فلوسك ترجع إذا ما عجبك الروتين',
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
