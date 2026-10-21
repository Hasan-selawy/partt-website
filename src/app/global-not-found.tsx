import SiteLayout from './(site)/layout';
import { NotFoundView } from '@/views/NotFoundView';

export const metadata = { title: 'Page not found | partt', robots: { index: false, follow: false } };

// With the root layout inside a route group, unmatched URLs need an explicit document.
// Reuse the existing site layout and 404 design without changing public URLs.
export default function GlobalNotFound() {
  return <SiteLayout><NotFoundView /></SiteLayout>;
}
