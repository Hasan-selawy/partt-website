import Link from 'next/link';
import { Closing } from '@/components/layout/Closing';
import { Cover } from '@/components/ui/Cover';
import { Media } from '@/components/ui/Media';
import { Reveal } from '@/components/ui/Reveal';
import { nextProject, projectPath, type Project } from '@/content/projects';
import { services } from '@/content/services';

/** The case-study story, in order. Only parts with real content are shown. */
const STORY = [
  ['The challenge', 'challenge'],
  ['Our approach', 'approach'],
  ['Creative execution', 'execution'],
  ['The outcome', 'results'],
] as const;

/** One reusable case-study page. Every project in content/projects.ts gets one. */
export function CaseStudyView({ project }: { project: Project }) {
  const next = nextProject(project.slug);
  const banner = project.banner ?? project.hero;
  const serviceNames = project.services?.map((slug) => services.find((s) => s.slug === slug)?.name ?? slug) ?? null;
  const [lead, ...rest] = project.gallery;
  const told = STORY.filter(([, key]) => project[key]?.length);

  return (
    <>
      <main id="main" className="cs">
        <header className={`cs-hero${project.displayName.length > 12 ? ' cs-hero--long' : ''}`} data-nav="deep">
          <div className="cs-hero-img">
            {banner ? <Media media={banner} fill priority sizes="100vw" /> : <Cover project={project} priority sizes="100vw" />}
          </div>
          <div className="cs-hero-txt">
            <Link className="tlink" href="/work">
              <i aria-hidden="true">←</i> All work
            </Link>
            <h1 className="disp">{project.displayName}</h1>
            {project.statement ? <p className="cs-st">{project.statement}</p> : null}
          </div>
        </header>

        <section className="cs-meta" aria-label="Project details">
          <dl>
            <div>
              <dt>Client</dt>
              <dd>{project.client}</dd>
            </div>
            {project.sector ? (
              <div>
                <dt>Sector</dt>
                <dd>{project.sector}</dd>
              </div>
            ) : null}
            {project.location ? (
              <div>
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
            ) : null}
            {serviceNames ? (
              <div>
                <dt>Our part</dt>
                <dd>{serviceNames.join(', ')}</dd>
              </div>
            ) : null}
            {project.year ? (
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        {project.brand.length ? (
          <section className="cs-brand" aria-labelledby="cs-brand-title">
            <h2 className="disp" id="cs-brand-title">
              The brand
            </h2>
            <Reveal className="cs-brand-txt">
              {project.brand.map((p, i) => (
                <p key={i} className={i === 0 ? 'big' : undefined}>
                  {p}
                </p>
              ))}
            </Reveal>
          </section>
        ) : null}

        {lead ? (
          <Reveal className="cs-lead">
            <Media media={lead} sizes="(max-width:820px) 100vw, 92vw" />
          </Reveal>
        ) : null}

        {told.length ? (
          <section className="cs-story" aria-labelledby="cs-story-title">
            <h2 className="disp" id="cs-story-title">
              The work
            </h2>
            <div className="cs-blocks">
              {told.map(([title, key]) => (
                <div className="cs-block" key={key}>
                  <h3 className="disp">{title}</h3>
                  {project[key]?.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {rest.length ? (
          <section className="cs-gallery" aria-label={`${project.client} gallery`}>
            {rest.map((media, i) => (
              <Reveal key={media.src} className={`cs-shot${rest.length % 2 === 1 && i === rest.length - 1 ? ' cs-shot--full' : ''}`}>
                <Media media={media} sizes="(max-width:820px) 100vw, 46vw" />
              </Reveal>
            ))}
          </section>
        ) : null}

        <nav className="cs-next" aria-label="Next project" data-nav="ink">
          <Link href={projectPath(next.slug)}>
            <span className="cs-next-k">Next project</span>
            <span className="cs-next-n disp">{next.displayName}</span>
            <span className="cs-next-img">
              <Cover project={next} sizes="(max-width:820px) 90vw, 36vw" />
            </span>
          </Link>
        </nav>
      </main>
      <Closing />
    </>
  );
}
