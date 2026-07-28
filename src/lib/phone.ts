import { businessConfig } from '@/config/business';

function digitsOnly(input: string): string {
  return input.replace(/\D/g, '');
}

export function normalizePhone(input: string): string | null {
  const raw = input.replace(/[\s\-()]/g, '');
  const digits = digitsOnly(raw);

  if (digits.startsWith('971')) {
    const national = digits.slice(3).replace(/^0+/, '');
    if (/^5[0-9]{8}$/.test(national)) return `+971${national}`;
  }

  if (digits.startsWith('965')) {
    const national = digits.slice(3).replace(/^0+/, '');
    if (/^[569]\d{7}$/.test(national)) return `+965${national}`;
  }

  const national = digits.replace(/^0+/, '');
  if (/^5[0-9]{8}$/.test(national)) return `+971${national}`;
  if (/^[569]\d{7}$/.test(national)) return `+965${national}`;

  return null;
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}

export function isValidMarketPhone(input: string): boolean {
  const normalized = normalizePhone(input);
  if (!normalized) return false;
  return normalized.startsWith(businessConfig.market.phoneCountryCode);
}

/** @deprecated use isValidMarketPhone */
export const isValidKuwaitPhone = isValidMarketPhone;

/** @deprecated use normalizePhone */
export const normalizeKuwaitPhone = normalizePhone;
