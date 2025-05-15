import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tetemeko Media Group',
  description: 'Streaming | News | Marketplace | Podcasts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
     
      <body suppressHydrationWarning className="bg-primary font-sans">
        {children}
      </body>
    </html>
  );
}
