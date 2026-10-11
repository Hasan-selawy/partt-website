import { pageMeta } from '@/lib/seo';
import { ContactView } from '@/views/ContactView';

export const metadata = pageMeta({
  title: 'Start a project',
  description: 'Tell partt what you are working on. Send a project inquiry, or reach us by email or phone in Amman, Jordan.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactView />;
}
