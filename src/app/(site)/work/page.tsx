import { pageMeta } from '@/lib/seo';
import { WorkView } from '@/views/WorkView';

export const metadata = pageMeta({
  title: 'Work',
  description: 'Selected work from partt for brands across tourism, hospitality, retail and services.',
  path: '/work',
});

export default function WorkPage() {
  return <WorkView />;
}
