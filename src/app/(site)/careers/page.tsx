import { CareersView } from '@/views/CareersView';
import { getOpenJobs } from '@/lib/careers/queries';
import { pageMeta } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata = pageMeta({ title: 'Careers', description: 'Find your next role at partt. Explore current opportunities in strategy, design, and digital.', path: '/careers' });
export default async function CareersPage() { return <CareersView jobs={await getOpenJobs()} />; }
