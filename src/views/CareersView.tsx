import Link from 'next/link';
import type { Job } from '@/payload-types';
import { PageHero } from '@/components/ui/PageHero';
import { Closing } from '@/components/layout/Closing';
import { employmentLabels, workplaceLabels } from '@/lib/careers/labels';

export function CareersView({ jobs }: { jobs: Job[] }) {
  return <main id="main" className="careers">
    <PageHero lines={['Be part', 'of partt.']} lede="Clear thinkers. Curious makers. People who care about the work and the people behind it." piece={2}>
      <a className="btn" href="#openings">Explore openings <i aria-hidden="true">↓</i></a>
    </PageHero>
    <section className="cr-intro" aria-labelledby="cr-intro-title" data-nav="ink">
      <p className="cr-eyebrow">WORK WITH US</p>
      <h2 id="cr-intro-title">Good work starts<br />with good people.</h2>
      <p>We bring strategy, design, and digital together to help brands move forward. If you like asking better questions and turning ideas into something people can feel, take a look at our openings.</p>
      <Link href="/about" className="cr-text-link">Get to know partt ↗</Link>
    </section>
    <section className="cr-openings" id="openings" aria-labelledby="openings-title" data-nav="paper">
      <div className="cr-openings-head"><h2 className="disp" id="openings-title">Your next part.</h2><p>{jobs.length} {jobs.length === 1 ? 'open role' : 'open roles'}</p></div>
      {jobs.length ? <ul className="cr-jobs">{jobs.map(job => <li key={job.id}>
        <Link href={`/careers/${job.slug}`} className="cr-job">
          <div>{job.department && <p className="cr-eyebrow">{job.department}</p>}<h3>{job.title}</h3><p className="cr-job-meta">{job.location} <span>·</span> {employmentLabels[job.employmentType]} <span>·</span> {workplaceLabels[job.workplace]}</p></div>
          <span className="cr-job-arrow" aria-hidden="true">↗</span>
        </Link>
      </li>)}</ul> : <div className="cr-no-jobs"><h3>No listed openings right now.</h3><p>Check back here for new roles. Questions about working with us? Email <a href="mailto:info@parttagency.com">info@parttagency.com</a>.</p></div>}
      <p className="cr-process-note">See a role that fits? Read the details, send your CV, and our team will review your application.</p>
    </section>
    <Closing mode="footer" />
  </main>;
}
