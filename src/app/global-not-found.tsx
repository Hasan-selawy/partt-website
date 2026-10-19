import SiteLayout from './(site)/layout';
import { NotFoundView } from '@/views/NotFoundView';

export const metadata = { title: 'Page not found | partt', robots: { index: false, follow: false } };

// With separate site and HR roots, unmatched URLs need an explicit document.
// Reuse the existing site layout and 404 design without changing public URLs.
export default function GlobalNotFound() {
  return <SiteLayout><NotFoundView /></SiteLayout>;
}
