import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Poppins } from 'next/font/google';
import type { ReactNode } from 'react';
import { MOTION_BOOT_SCRIPT } from '@/lib/motion/boot';
import { SiteShell } from '@/components/layout/SiteShell';
import { site } from '@/content/site';
import { organizationJsonLd } from '@/lib/seo';
import '@/styles/base.css';
import '@/styles/layout.css';
import '@/styles/home.css';
import '@/styles/pages.css';

// both brand fonts are downloaded at build time and served from this site: no layout shift, no third-party request
const display = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-disp', display: 'swap' });
const body = Poppins({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.slogan}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} | ${site.slogan}`,
    description: site.description,
    url: '/',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'partt' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFF9',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        {/* who partt is, for search engines */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
