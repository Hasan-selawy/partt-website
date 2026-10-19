import { getPayload } from 'payload';
import config from '../payload.config';
process.env.DISABLE_PAYLOAD_HMR = 'true';
const payload = await getPayload({ config });
try {
  const jobs = await payload.find({ collection: 'jobs', overrideAccess: true, pagination: false,
    where: { slug: { like: 'verification-role-' } },
  });
  let deletedApps = 0;
  for (const job of jobs.docs.filter(job => job.slug.startsWith('verification-role-') && ['Verification role — temporary', 'Browser verification role'].includes(job.title))) {
    const apps = await payload.find({ collection: 'applications', overrideAccess: true, pagination: false, where: { job: { equals: job.id } } });
    // Refuse to delete anything except the explicit verification candidates.
    if (apps.docs.some(app => !app.email.endsWith('@example.test'))) throw new Error('Unexpected applicant on test role; cleanup stopped.');
    for (const app of apps.docs) { await payload.delete({ collection: 'applications', id: app.id, overrideAccess: true }); deletedApps++; }
    await payload.delete({ collection: 'jobs', id: job.id, overrideAccess: true });
  }
  console.log(`Removed ${jobs.docs.length} temporary roles and ${deletedApps} temporary applications. Private test CVs were deleted with their records.`);
} finally { await payload.destroy(); }
