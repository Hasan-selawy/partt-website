import { pageMeta } from '@/lib/seo';
import { ServicesView } from '@/views/ServicesView';

export const metadata = pageMeta({
  title: 'Services',
  description: 'Strategy and brand, content and communication, events and activations, digital and growth. What partt does and how the work runs.',
  path: '/services',
});

export default function ServicesPage() {
  return <ServicesView />;
}
