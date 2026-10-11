import type { MetadataRoute } from 'next';
import { projectPath, projects } from '@/content/projects';
import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/work', '/services', '/about', '/contact'];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path === '/' ? '' : path}`, changeFrequency: 'monthly' as const, priority: path === '/' ? 1 : 0.8 })),
    ...projects.map((project) => ({ url: `${site.url}${projectPath(project.slug)}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
