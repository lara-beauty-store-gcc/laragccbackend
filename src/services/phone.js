/** Kuwait mobile: +965, 8 digits, starts 5/6/9 */
const KW_MOBILE = /^(?:\+?965)?0?([569]\d{7})$/;

export function normalizeKuwaitPhone(input) {
  const raw = String(input || '').replace(/\s|-/g, '');
  const m = raw.match(KW_MOBILE);
  if (!m) return null;
  return `+965${m[1]}`;
}

export function isValidKuwaitPhone(input) {
  return normalizeKuwaitPhone(input) !== null;
}
