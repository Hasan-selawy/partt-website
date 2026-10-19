import Link from 'next/link';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';
import { isStaff } from '@/cms/access';

export async function HROverview() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!isStaff({ user })) return null;
  const [open, fresh, total, recent] = await Promise.all([
    payload.count({ collection: 'jobs', where: { status: { equals: 'open' } }, overrideAccess: false, user }),
    payload.count({ collection: 'applications', where: { status: { equals: 'new' } }, overrideAccess: false, user }),
    payload.count({ collection: 'applications', overrideAccess: false, user }),
    payload.find({ collection: 'applications', limit: 5, sort: '-createdAt', depth: 1, overrideAccess: false, user }),
  ]);
  return <section className="hr-overview">
    <div className="hr-overview-heading"><div><p className="hr-eyebrow">PARTT / RECRUITMENT</p><h1>A place for the next part.</h1><p>Publish a role, meet your applicants, and move good people forward.</p></div><Link className="hr-primary" href="/hr/collections/jobs/create">Create an opening ↗</Link></div>
    <div className="hr-stats">
      <Link href="/hr/collections/jobs"><strong>{open.totalDocs}</strong><span>Open roles</span></Link>
      <Link href={'/hr/collections/applications?where[status][equals]=new'}><strong>{fresh.totalDocs}</strong><span>New applications</span></Link>
      <Link href="/hr/collections/applications"><strong>{total.totalDocs}</strong><span>Total applications</span></Link>
    </div>
    <div className="hr-section-heading"><h2>Latest applications</h2><a href="/api/careers/export">Export applications (CSV)</a></div>
    {recent.docs.length ? <ul className="hr-recent">{recent.docs.map(app => <li key={app.id}><Link href={`/hr/collections/applications/${app.id}`}><strong>{app.fullName}</strong><span>{typeof app.job === 'object' ? app.job.title : 'Job opening'}</span><span className="hr-status">{app.status}</span></Link></li>)}</ul> : <p className="hr-empty">No applications yet. Create an opening and set its status to Open to list it on the Careers page.</p>}
    <div className="hr-help"><p><strong>Your hiring workflow</strong> — Draft a role, set it to Open, then share its Careers URL on LinkedIn. Close the role when applications end; existing applicants stay available.</p><Link href="/careers" target="_blank">View public Careers page ↗</Link></div>
  </section>;
}
