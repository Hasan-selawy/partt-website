import { notFound } from 'next/navigation';
import { getOpenJob } from '@/lib/careers/queries';
import { JobView } from '@/views/JobView';
import { pageMeta } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getOpenJob(slug);
  if (!job) return { title: 'Opening unavailable', robots: { index: false, follow: false } };
  return pageMeta({ title: `${job.title} — Careers`, description: job.summary.slice(0, 160), path: `/careers/${job.slug}` });
}
export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getOpenJob(slug);
  if (!job) notFound();
  return <JobView job={job} />;
}
