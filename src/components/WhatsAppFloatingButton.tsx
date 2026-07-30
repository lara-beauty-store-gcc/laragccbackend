'use client';

import { IconWhatsApp } from '@/components/icons';
import { buildWhatsAppUrl, whatsappDisplayNumber } from '@/lib/whatsapp';

export function WhatsAppFloatingButton() {
  const href = buildWhatsAppUrl();

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-[max(1.25rem,env(safe-area-inset-right))] z-[90] flex flex-col items-end gap-2"
      dir="rtl"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`واتساب — ${whatsappDisplayNumber()}`}
        className="group pointer-events-auto relative flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <span
          className="pointer-events-none max-w-[0] overflow-hidden whitespace-nowrap rounded-full border border-white/20 bg-[#0f1f18]/95 px-0 py-2.5 text-sm font-bold text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:max-w-[14rem] group-hover:px-4 group-hover:opacity-100 group-focus-visible:max-w-[14rem] group-focus-visible:px-4 group-focus-visible:opacity-100"
          aria-hidden
        >
          تواصلي معنا على واتساب
        </span>

        <span className="relative flex h-[3.75rem] w-[3.75rem] items-center justify-center sm:h-16 sm:w-16">
          <span
            className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/35 motion-reduce:animate-none"
            aria-hidden
          />
          <span
            className="absolute inset-0 scale-110 rounded-full bg-[#25D366]/20 blur-md"
            aria-hidden
          />
          <span className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#3DFF8B] via-[#25D366] to-[#128C7E] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.75)] ring-2 ring-white/90 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <IconWhatsApp className="h-[1.65rem] w-[1.65rem] sm:h-7 sm:w-7" />
          </span>
          <span
            className="absolute -top-0.5 -start-0.5 flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 shadow-sm"
            aria-hidden
          />
        </span>
      </a>
    </div>
  );
}
