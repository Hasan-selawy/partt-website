import { Closing } from '@/components/layout/Closing';
import { PageHero } from '@/components/ui/PageHero';
import { WorkGrid } from '@/components/work/WorkGrid';
import { projects } from '@/content/projects';

/** Every project, in the same tile grid as the homepage, on paper rising over the navy title. */
export function WorkView() {
  return (
    <>
      <main id="main" className="wk t-deep" data-nav="deep">
        <PageHero lines={['Selected', 'work.']} theme="deep" piece={2} lede="Brands we are part of, across tourism, hospitality, retail and services." />
        <section className="work work--page" data-nav="paper" aria-label="All projects">
          <WorkGrid projects={projects} />
        </section>
      </main>
      <Closing />
    </>
  );
}
