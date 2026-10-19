import Link from 'next/link';
import type { Job } from '@/payload-types';
import { Closing } from '@/components/layout/Closing';
import { ApplicationForm } from '@/components/careers/ApplicationForm';
import { employmentLabels, workplaceLabels } from '@/lib/careers/labels';

export function JobView({ job }: { job: Job }) {
  const lines = (text: string) => text.split(/\r?\n/).map(line => line.trim().replace(/^[-•]\s*/, '')).filter(Boolean);
  return <main id="main" className="careers cr-detail">
    <header className="cr-role-hero" data-nav="paper">
      <Link href="/careers" className="cr-text-link">← All openings</Link>
      {job.department && <p className="cr-eyebrow">{job.department}</p>}
      <h1 className="disp">{job.title}</h1>
      <ul className="cr-role-meta"><li>{job.location}</li><li>{employmentLabels[job.employmentType]}</li><li>{workplaceLabels[job.workplace]}</li></ul>
      <a className="btn" href="#apply">Apply for this role <i aria-hidden="true">↓</i></a>
    </header>
    <div className="cr-role-body">
      <aside className="cr-role-side"><p className="cr-eyebrow">THE OPPORTUNITY</p><h2 className="disp">Bring your<br />part to it.</h2><p>Strategy, creativity, and a shared ambition to make work that matters.</p></aside>
      <div className="cr-role-copy">
        <section><h2>About the role</h2><p className="cr-preserve-lines">{job.summary}</p></section>
        <section><h2>What you’ll do</h2><ul>{lines(job.responsibilities).map((line, i) => <li key={i}>{line}</li>)}</ul></section>
        <section><h2>What you’ll bring</h2><ul>{lines(job.requirements).map((line, i) => <li key={i}>{line}</li>)}</ul></section>
      </div>
    </div>
    <section className="cr-apply-section" id="apply" aria-labelledby="apply-title"><div><p className="cr-eyebrow">LET’S MEET</p><h2 id="apply-title" className="disp">Make the<br />next move.</h2><p>Apply for {job.title}.</p></div><ApplicationForm jobId={job.id} title={job.title} /></section>
    <Closing mode="footer" />
  </main>;
}
