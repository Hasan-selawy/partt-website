/**
 * Site-wide facts. Everything here is real partt content unless marked CONFIRM.
 * A CMS can replace this file later: the pages only read these exports.
 */
export const site = {
  name: 'partt',
  legalName: 'partt agency',
  /** CONFIRM: the live domain. Used for canonical links, the sitemap and share previews. */
  url: 'https://www.parttagency.com',
  tagline: 'Strategic marketing agency',
  description:
    'partt is a strategic marketing agency built on true partnership. We work as part of your team, from strategy and brand to execution and growth.',
  footerLine:
    'Helping brands grow through clear strategies, creative ideas, and digital experiences that make an impact.',
  email: 'info@parttagency.com',
  phone: '+962 791910808',
  phoneHref: '+962791910808',
  location: 'Amman, Jordan',
  /**
   * Sections that still need real content from partt show a clearly marked "Content needed" note while the site
   * runs in development. The production build never shows them.
   */
  showPlaceholders: process.env.NODE_ENV !== 'production',
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/** One label for the one main action, used everywhere. */
export const primaryCta = { label: 'Start a project', href: '/contact' } as const;
