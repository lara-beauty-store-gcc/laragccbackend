import { businessInputs } from '@/config/business';
import type { Product } from '@/config/products';
import { products } from '@/config/products';

const { brand, market } = businessInputs;

export function formatPrice(amount: number): string {
  return `${amount.toFixed(3)} ${market.currencySymbol}`;
}

export function formatPriceFrom(amount: number): string {
  return `يبدأ من ${formatPrice(amount)}`;
}

export function getHeroCopy() {
  const count = products.length;
  return {
    eyebrow: 'OUR FORMULATIONS',
    title: `${count === 3 ? 'ثلاث علكات' : `${count} علكات`}. ثلاث احتياجات. روتين واحد.`,
    subtitle:
      'علكات لارا اليومية — ذاكرة، طاقة، ونوم. تركيبات واضحة، جرعات مدروسة، ودفع عند الاستلام داخل الكويت.',
    cta: 'استكشفي العلكات',
    proofTitle: 'دفع عند الاستلام',
    proofSubtitle: 'ما في دفع أونلاين — تدفعين لما يوصلك الطلب',
  };
}

export function getAnnouncementText(): string {
  return `شحن داخل ${market.countryName} • دفع عند الاستلام • ضمان استرجاع 30 يوم`;
}

export function getTrustBadges() {
  return [
    { icon: 'shield', label: 'جودة معتمدة', sub: 'تصنيع GMP' },
    { icon: 'leaf', label: 'حلال 100%', sub: 'نباتي' },
    { icon: 'truck', label: `شحن ${market.countryName}`, sub: '2–4 أيام عمل' },
    { icon: 'heart', label: 'ضمان 30 يوم', sub: 'استرجاع فلوس' },
  ];
}

export function getWhyBrandCards() {
  return [
    {
      icon: 'shield',
      title: 'تركيبات واضحة، مو وعود فاضية',
      body: 'كل مكوّن مكتوب على العلبة بجرعة واضحة. ما عندنا مكونات سرية ولا خلطات عشوائية.',
    },
    {
      icon: 'microscope',
      title: 'جرعات مدروسة لكل هدف',
      body: 'كل علكة مصممة لمشكلة محددة: تركيز، طاقة، أو نوم — مو علكة واحدة لكل شي.',
    },
    {
      icon: 'handshake',
      title: 'دفع عند الاستلام + ضمان',
      body: 'تجرّبين الروتين براحتك. ما عجبك؟ نرجّع لك فلوسك خلال 30 يوم.',
    },
  ];
}

export function getHowItWorksSteps() {
  return [
    {
      n: '١',
      title: 'اختاري علكتك',
      body: 'ثلاث علكات: ذاكرة، طاقة، أو نوم. اختاري وحدة أو الروتين الكامل حسب احتياجك.',
    },
    {
      n: '٢',
      title: 'أكّدي طلبك (بدون دفع)',
      body: `اسمك ورقم جوالك بس (${market.phoneCountryCode}). الدفع عند الاستلام وفريقنا يتصل فيك يأكد العنوان.`,
    },
    {
      n: '٣',
      title: 'استلمي وادفعي',
      body: `نوصّل لباب بيتك داخل ${market.countryName} خلال 2–4 أيام. تدفعين كاش أو كي نت وقت الاستلام.`,
    },
  ];
}

export function getTestimonials(forProduct?: Product) {
  const focus = forProduct?.shortName ?? 'العلكات';
  return [
    {
      name: 'نورة العتيبي',
      meta: `34 سنة • الكويت • مشترية مؤكدة`,
      initial: 'ن',
      text: `جرّبت علكة ${focus} شهر كامل. حسّيت فرق بالتركيز بالشغل — وما احتجت أدفع أونلاين، الدفع كان عند الاستلام.`,
      rating: 5,
    },
    {
      name: 'فاطمة الخالدي',
      meta: `29 سنة • الفروانية • مشترية مؤكدة`,
      initial: 'ف',
      text: 'أهم شي عندي المكونات واضحة والتوصيل سريع داخل الكويت. الطلب سهل — اسم ورقم بس.',
      rating: 5,
    },
    {
      name: 'سارة الدوسري',
      meta: `41 سنة • حولي • مشترية مؤكدة`,
      initial: 'س',
      text: `الروتين الكامل أنسب شي — ذاكرة بالصبح، طاقة الظهر، ومغنيسيوم بالليل. خدمة ممتازة.`,
      rating: 5,
    },
  ];
}

export function getFaqs(forProduct?: Product) {
  const ing = forProduct?.mainIngredient ?? 'المكوّنات';
  return [
    {
      q: 'هل الدفع عند الاستلام متاح داخل الكويت؟',
      a: `إي نعم. نوصّل لكل مناطق ${market.countryName} والدفع يكون كاش أو كي نت عند الاستلام.`,
    },
    {
      q: 'هل العلكات حلال وبدون جيلاتين حيواني؟',
      a: 'إي، علكاتنا نباتية (بكتين) وحلال 100% — بدون جيلاتين حيواني.',
    },
    {
      q: 'كم يستغرق التوصيل؟',
      a: 'عادة من 2 إلى 4 أيام عمل داخل الكويت حسب المنطقة.',
    },
    {
      q: 'شنو ضمان الاسترجاع؟',
      a: 'عندك 30 يوم. إذا ما حسيتي فرق، تواصلي معنا ونرجّع لك المبلغ.',
    },
    {
      q: `متى ألاحظ نتيجة ${forProduct?.shortName ?? 'العلكة'}؟`,
      a: `معظم العميلات يلاحظون فرق خلال 2–4 أسابيع استخدام يومي. ${ing} يحتاج انتظام.`,
    },
  ];
}

export function getFinalCta() {
  return {
    eyebrow: 'BEGIN YOUR RITUAL',
    title: 'جسمك يستاهل دعم يومي، مو حلول سريعة',
    subtitle: `ابدئي روتين لارا اليوم. دفع عند الاستلام، شحن ${market.countryName}، وضمان 30 يوم.`,
    cta: 'استكشفي العلكات الآن',
  };
}

export function getProductPageCopy(product: Product) {
  return {
    benefits: [
      `يستهدف: ${product.problem}`,
      `المكوّن الرئيسي: ${product.mainIngredient}`,
      `الفئة: ${product.category}`,
    ],
    description: `${product.name} — ${product.cardSubheadline} تركيبة ${brand.nameLocal} للسوق الكويتي. ${formatPriceFrom(product.priceFrom)} مع دفع عند الاستلام.`,
  };
}

export { brand, market };
