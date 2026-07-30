import { businessConfig } from '@/config/business';

const { whatsapp } = businessConfig;

/** E.164 digits only for wa.me links */
export function whatsappDialDigits(): string {
  return whatsapp.e164.replace(/\D/g, '');
}

export function whatsappDisplayNumber(): string {
  return whatsapp.display;
}

export function buildWhatsAppUrl(text?: string): string {
  const digits = whatsappDialDigits();
  const message = (text ?? whatsapp.defaultMessage).trim();
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
