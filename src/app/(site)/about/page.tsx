import { pageMeta } from '@/lib/seo';
import { AboutView } from '@/views/AboutView';

export const metadata = pageMeta({
  title: 'About',
  description: 'partt is a strategic marketing agency built on true partnership. How we think, how we work, and where the name comes from.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutView />;
}
