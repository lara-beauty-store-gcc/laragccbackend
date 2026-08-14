import { createHash } from 'node:crypto';

export function sha256(value: string): string {
  const normalized = value.trim().toLowerCase();
  return createHash('sha256').update(normalized).digest('hex');
}

export function phoneDigitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

/** TikTok Events API — E.164 with leading + before hash. */
export function hashPhoneForTikTok(phoneE164: string): string {
  const digits = phoneDigitsOnly(phoneE164);
  const e164 = phoneE164.startsWith('+') ? phoneE164 : `+${digits}`;
  return sha256(e164);
}

/** Snap Conversions API — digits only (country code, no +). */
export function hashPhoneForSnap(phoneE164: string): string {
  return sha256(phoneDigitsOnly(phoneE164));
}
