import { businessConfig } from '@/config/business';

/** UAE mobile: 9 digits starting with 5 (same rule as api.larabeauty.store). */
const AE = /^(?:\+?971)?0?(5\d{8})$/;

export const UAE_PHONE_DIGITS = 9;
export const UAE_PHONE_EXAMPLE = '501234567';

function cleanPhone(input: string) {
  return input.replace(/\s|[-().]/g, '');
}

export function parseUaePhoneDigits(input: string): string | null {
  const m = cleanPhone(input).match(AE);
  return m ? m[1] : null;
}

export function isValidUaePhone(input: string): boolean {
  return parseUaePhoneDigits(input) !== null;
}

export function normalizeUaePhone(input: string): string | null {
  const local = parseUaePhoneDigits(input);
  return local ? `+971${local}` : null;
}

export function formatUaePhoneInput(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('971')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, UAE_PHONE_DIGITS);
}

export function uaePhoneErrorMessage(input: string): string {
  const digits = formatUaePhoneInput(input);
  if (!digits) return 'رقم الجوال مطلوب';
  if (digits.length < UAE_PHONE_DIGITS) {
    return `رقم الجوال ناقص — لازم ${UAE_PHONE_DIGITS} أرقام`;
  }
  if (!digits.startsWith('5')) {
    return 'رقم الجوال الإماراتي لازم يبدأ بـ 5 — مثال: 501234567';
  }
  return `رقم الجوال لازم يكون ${UAE_PHONE_DIGITS} أرقام`;
}

/** Store + API helpers */
export function normalizePhone(input: string): string | null {
  return normalizeUaePhone(input);
}

export function isValidPhone(input: string): boolean {
  return isValidUaePhone(input);
}

export function isValidMarketPhone(input: string): boolean {
  const normalized = normalizePhone(input);
  if (!normalized) return false;
  return normalized.startsWith(businessConfig.market.phoneCountryCode);
}

/** @deprecated */
export const isValidKuwaitPhone = isValidMarketPhone;
/** @deprecated */
export const normalizeKuwaitPhone = normalizePhone;
