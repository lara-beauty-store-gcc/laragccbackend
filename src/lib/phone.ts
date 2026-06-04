/** Kuwait mobile validation */
const KW = /^(?:\+?965)?0?([569]\d{7})$/;

export function isValidKuwaitPhone(input: string): boolean {
  return KW.test(input.replace(/\s|-/g, ''));
}

export function normalizeKuwaitPhone(input: string): string | null {
  const m = input.replace(/\s|-/g, '').match(KW);
  if (!m) return null;
  return `+965${m[1]}`;
}
