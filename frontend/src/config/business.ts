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
    primaryColor: '#1B3A2D',
    primaryDarkColor: '#142E24',
    accentColor: '#C4A574',
    backgroundColor: '#F7F3EC',
    cardColor: '#FFFFFF',
    textColor: '#1A2E26',
    mutedTextColor: '#5C6B64',
    borderColor: '#E5DDD0',
  },
};

/** @deprecated use businessConfig — kept for existing imports */
export const businessInputs = businessConfig;
