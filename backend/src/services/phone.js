/** GCC mobile: UAE (+971, 9 digits) and Kuwait (+965, 8 digits) */

function digitsOnly(input) {
  return String(input || '').replace(/\D/g, '');
}

export function normalizeGccPhone(input) {
  const raw = String(input || '').replace(/[\s\-()]/g, '');
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

export function isValidGccPhone(input) {
  return normalizeGccPhone(input) !== null;
}

/** @deprecated use normalizeGccPhone */
export const normalizeKuwaitPhone = normalizeGccPhone;

/** @deprecated use isValidGccPhone */
export const isValidKuwaitPhone = isValidGccPhone;
