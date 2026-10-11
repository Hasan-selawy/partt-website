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
  return pageMeta({
    title: `${project.client}: ${project.sector}`,
    description: `${project.statement} ${project.brand[0]}`,
    path: projectPath(project.slug),
    image: { src: project.hero.src, w: project.hero.w, h: project.hero.h, alt: project.hero.alt },
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudyView project={project} />;
}
