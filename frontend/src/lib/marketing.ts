import { businessConfig } from '@/config/business';
import type { ProductConfig } from '@/config/products';
import { getLowestOfferPrice, products } from '@/config/products';
import { formatPriceFrom } from '@/lib/pricing';

const { brand, market } = businessConfig;

export { formatPrice, formatPriceFrom } from '@/lib/pricing';

export function getHeroCopy() {
  return {
    eyebrow: 'OUR FORMULATIONS',
    title: 'ثلاث علكات. ثلاث احتياجات. روتين واحد.',
    subtitle:
      'علكات لارا — نوم، طاقة، وتركيز. تركيبات واضحة، جرعات مدروسة، ودفع عند الاستلام داخل الكويت.',
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
      body: 'كل علكة لمشكلة محددة: نوم، طاقة، أو تركيز — مو علكة وحدة لكل شي.',
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
      body: 'ثلاث علكات: نوم، طاقة، أو تركيز. اختاري عرض 1 أو 2 أو 3 علب.',
    },
    {
      n: '٢',
      title: 'أكّدي طلبك (بدون دفع)',
      body: `اسمك ورقم جوالك بس (${market.phoneCountryCode}). الدفع عند الاستلام.`,
    },
    {
      n: '٣',
      title: 'استلمي وادفعي',
      body: `نوصّل لباب بيتك داخل ${market.countryName}. تدفعين كاش أو كي نت.`,
    },
  ];
}

export function getTestimonials(forProduct?: ProductConfig) {
  const focus = forProduct?.shortName ?? 'العلكات';
  return [
    {
      name: 'نورة العتيبي',
      meta: '34 سنة • الكويت • مشترية مؤكدة',
      initial: 'ن',
      text: `جرّبت ${focus} شهر كامل. حسّيت فرق — والدفع كان عند الاستلام.`,
      rating: 5,
    },
    {
      name: 'فاطمة الخالدي',
      meta: '29 سنة • الفروانية',
      initial: 'ف',
      text: 'أهم شي المكونات واضحة والتوصيل سريع. الطلب سهل — اسم ورقم بس.',
      rating: 5,
    },
    {
      name: 'سارة الدوسري',
      meta: '41 سنة • حولي',
      initial: 'س',
      text: 'الروتين الكامل أنسب شي — نوم، طاقة، وتركيز. خدمة ممتازة.',
      rating: 5,
    },
  ];
}

export function getFaqs(forProduct?: ProductConfig) {
  const ing = forProduct?.mainIngredient ?? 'المكوّنات';
  const from = forProduct ? formatPriceFrom(getLowestOfferPrice(forProduct)) : 'من 16 د.ك';
  return [
    {
      q: 'هل الدفع عند الاستلام متاح داخل الكويت؟',
      a: `إي نعم. نوصّل لكل مناطق ${market.countryName} والدفع كاش أو كي نت عند الاستلام.`,
    },
    {
      q: 'كم الأسعار؟',
      a: `العروض ${from} — علبة 16 د.ك، علبتين 21 د.ك، 3 علب 29 د.ك.`,
    },
    {
      q: 'هل العلكات حلال؟',
      a: 'إي، بكتين نباتي — حلال 100%.',
    },
    {
      q: 'متى ألاحظ فرق؟',
      a: `تختلف من شخص لشخص. ${ing} يحتاج انتظام 2–4 أسابيع.`,
    },
  ];
}

export function getFinalCta() {
  return {
    eyebrow: 'BEGIN YOUR RITUAL',
    title: 'جسمك يستاهل دعم يومي',
    subtitle: `ابدئي روتين لارا. دفع عند الاستلام وشحن ${market.countryName}.`,
    cta: 'استكشفي العلكات الآن',
  };
}

export { brand, market, products };
