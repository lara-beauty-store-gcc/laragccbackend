import type { Metadata } from 'next';
import { businessInputs } from '@/config/business';
import { CartProvider } from '@/lib/cart';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';

const { brand, market } = businessInputs;

export const metadata: Metadata = {
  title: `${brand.nameLocal} | علكات يومية`,
  description: brand.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={market.language} dir={market.direction}>
      <body>
        <CartProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main className="mx-auto min-h-screen max-w-lg">{children}</main>
          <CheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
