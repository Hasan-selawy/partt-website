import { WorkGrid } from '@/components/work/WorkGrid';
import { workIntro, workShowcase, workTitle } from '@/content/home';
import { getProject } from '@/content/projects';

/** Scene 4. The selected projects as the shared tile grid, rising on paper over the navy block. */
export function SelectedWork() {
  const items = workShowcase.flatMap((slug) => {
    const project = getProject(slug);
    return project ? [project] : [];
  });

  return (
    <section className="work" id="work" data-nav="paper" aria-labelledby="work-title">
      <div className="work-head">
        <h2 className="disp" id="work-title">
          {workTitle}
        </h2>
        <p>{workIntro}</p>
      </div>
      <WorkGrid projects={items} allLink />
    </section>
  );
}
