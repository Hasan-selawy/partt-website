import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, projectPath, projects } from '@/content/projects';
import { pageMeta } from '@/lib/seo';
import { CaseStudyView } from '@/views/CaseStudyView';

type Props = { params: Promise<{ slug: string }> };

// every project in content/projects.ts becomes a static page at build time
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const image = project.banner ?? project.hero;
  return pageMeta({
    title: project.sector ? `${project.client}: ${project.sector}` : project.client,
    description: [project.statement, project.brand[0]].filter(Boolean).join(' ') || `${project.client}, a brand partt works with.`,
    path: projectPath(project.slug),
    image: image ? { src: image.src, w: image.w, h: image.h, alt: image.alt } : undefined,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudyView project={project} />;
}
