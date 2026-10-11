import type { Metadata } from 'next';
import { site } from '@/content/site';

type PageMetaInput = {
  /** page title without the site name */
  title: string;
  description: string;
  /** path starting with "/" */
  path: string;
  /** share image path; defaults to the site-wide one */
  image?: { src: string; w: number; h: number; alt: string };
};

/** Title, description, canonical link and share-preview tags for one page. */
export function pageMeta({ title, description, path, image }: PageMetaInput): Metadata {
  const og = image ?? { src: '/og.png', w: 1200, h: 630, alt: 'partt' };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      url: path,
      images: [{ url: og.src, width: og.w, height: og.h, alt: og.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${site.name}`,
      description,
      images: [og.src],
    },
  };
}

/** Organization details for search engines. */
export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.legalName,
  url: site.url,
  logo: `${site.url}/og.png`,
  email: site.email,
  telephone: site.phoneHref,
  address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' },
});
