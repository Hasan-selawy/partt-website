import type { MetadataRoute } from 'next';
import { projectPath, projects } from '@/content/projects';
import { site } from '@/content/site';
import { policies } from '@/content/policies';
import { getOpenJobs } from '@/lib/careers/queries';

export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getOpenJobs();
  const pages = ['/', '/work', '/services', '/about', '/contact', '/careers', ...Object.values(policies).map((policy) => policy.path)];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path === '/' ? '' : path}`, changeFrequency: 'monthly' as const, priority: path === '/' ? 1 : 0.8 })),
    ...projects.map((project) => ({ url: `${site.url}${projectPath(project.slug)}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...jobs.map((job) => ({ url: `${site.url}/careers/${job.slug}`, lastModified: new Date(job.updatedAt), changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
