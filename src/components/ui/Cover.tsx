import Image from 'next/image';
import { Media } from '@/components/ui/Media';
import { clientByName } from '@/content/clients';
import type { Project } from '@/content/projects';

type Props = {
  project: Project;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * A project's lead visual: its hero photo, filling the parent box. Until the photos arrive, a navy cover with the
 * brand's own logo, or its name in display type when no logo file exists yet. Nothing is invented to fill it.
 */
export function Cover({ project, sizes, priority = false, className }: Props) {
  if (project.hero) return <Media media={project.hero} fill priority={priority} sizes={sizes} className={className} />;
  const logo = project.logoClient ? clientByName(project.logoClient) : undefined;
  return (
    <span className={`cover${className ? ` ${className}` : ''}`}>
      {logo ? (
        <Image src={logo.logo} alt={`${project.client} logo`} width={logo.w} height={logo.h} sizes={sizes} className="cover-logo" />
      ) : (
        <span className="cover-name disp" aria-hidden="true">
          {project.displayName}
        </span>
      )}
    </span>
  );
}
