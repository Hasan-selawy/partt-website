import Link from 'next/link';
import { Media } from '@/components/ui/Media';
import { Reveal } from '@/components/ui/Reveal';
import { projectPath, type Project } from '@/content/projects';
import { services } from '@/content/services';

/** What partt did on the project when known, otherwise the client's sector. */
const projectType = (project: Project) =>
  project.services?.map((slug) => services.find((s) => s.slug === slug)?.name ?? slug).join(', ') ?? project.sector;

const SIZES = '(max-width:820px) 100vw, 46vw';

/**
 * Every project as the same tile: its hero photo (the first gallery photo fades in on hover), then the number,
 * name, type and line. Two columns; the right one sits half a tile lower so the grid keeps a rhythm. The name is
 * the link and its hit area covers the whole tile. Used by the homepage and the Work page.
 */
export function WorkGrid({ projects, allLink = false }: { projects: Project[]; allLink?: boolean }) {
  return (
    <ul className="work-list">
      {projects.map((project, i) => {
        const alt = project.gallery[0];
        return (
          // each tile spans two grid rows, one row below the tile before it
          <li key={project.slug} style={{ gridRow: `${i + 1} / span 2` }}>
            <Reveal className="pj">
              <div className="pj-img">
                <Media media={project.hero} fill sizes={SIZES} />
                {alt ? <Media media={alt} fill sizes={SIZES} className="pj-alt" /> : null}
              </div>
              <div className="pj-cap">
                <span className="pj-no disp" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="pj-name disp">
                  <Link href={projectPath(project.slug)}>{project.displayName}</Link>
                </h3>
                <p className="pj-meta">
                  {projectType(project)}
                  {project.location ? `, ${project.location}` : ''}
                </p>
                <p className="pj-st">{project.statement}</p>
              </div>
            </Reveal>
          </li>
        );
      })}
      {allLink ? (
        // when the count is odd the last row of the right column is free: the way to every project sits there
        <li className="work-all" style={projects.length % 2 ? { gridRow: `${projects.length + 1}`, gridColumn: 2 } : undefined}>
          <Link className="disp" href="/work">
            All work <i aria-hidden="true">→</i>
          </Link>
        </li>
      ) : null}
    </ul>
  );
}
