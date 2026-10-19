import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function getOpenJobs() {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: 'jobs', overrideAccess: false, depth: 0,
    pagination: false, sort: '-publishedAt', where: { status: { equals: 'open' } } });
  return result.docs;
}
export async function getOpenJob(slug: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: 'jobs', overrideAccess: false, depth: 0, limit: 1,
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'open' } }] } });
  return result.docs[0] || null;
}
