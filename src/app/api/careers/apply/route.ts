import { randomUUID, createHash } from 'node:crypto';
import { getPayload } from 'payload';
import config from '@payload-config';
import { allowApplication, applicationSchema, readBoundedForm, validateCV } from '@/lib/careers/validation';
import { careersOrigin } from '@/lib/careers/settings';
import { policyUpdated } from '@/content/policies';

export const runtime = 'nodejs';
const reply = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function POST(request: Request) {
  // A normal browser submission must originate at this site.
  const origin = request.headers.get('origin');
  if (origin && origin !== careersOrigin) return reply({ error: 'Please apply from the Partt website.' }, 403);
  // Only trust a proxy header when the deployment explicitly opts in.
  const network = process.env.TRUST_PROXY === 'true' ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown' : 'local';
  if (!allowApplication(`network:${network}`, process.env.TRUST_PROXY === 'true' ? 20 : 120)) return reply({ error: 'Too many attempts. Please try again in 15 minutes.' }, 429);
  try {
    const form = await readBoundedForm(request);
    if (form.get('companyWebsite')) return reply({ error: 'Unable to accept this application.' }, 400);
    const values = applicationSchema.safeParse(Object.fromEntries(form));
    if (!values.success) return reply({ error: values.error.issues[0]?.message || 'Please check the form fields.' }, 400);
    const cv = form.get('cv');
    if (!(cv instanceof File)) return reply({ error: 'Please attach your CV as a PDF.' }, 400);
    const bytes = Buffer.from(await cv.arrayBuffer());
    const invalidCV = validateCV(cv, bytes);
    if (invalidCV) return reply({ error: invalidCV }, 400);
    const emailKey = createHash('sha256').update(values.data.email).digest('hex');
    if (!allowApplication(`email:${emailKey}`)) return reply({ error: 'Too many attempts. Please try again in 15 minutes.' }, 429);
    const payload = await getPayload({ config });
    const role = await payload.find({ collection: 'jobs', where: { id: { equals: values.data.job } }, limit: 1, depth: 0, overrideAccess: false });
    if (!role.docs.length) return reply({ error: 'This role is no longer accepting applications.' }, 410);
    const duplicate = await payload.count({ collection: 'applications', overrideAccess: true,
      where: { and: [{ job: { equals: values.data.job } }, { email: { equals: values.data.email } }] } });
    if (duplicate.totalDocs) return reply({ error: 'You have already applied for this role. To update your application, email info@parttagency.com.' }, 409);
    await payload.create({ collection: 'applications', overrideAccess: true,
      data: { ...values.data, privacyConsent: true, consentedAt: new Date().toISOString(), privacyPolicyVersion: policyUpdated.date, status: 'new' },
      file: { data: bytes, mimetype: 'application/pdf', name: `${randomUUID()}.pdf`, size: bytes.length },
    });
    return reply({ ok: true }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'too-large') return reply({ error: 'Your CV must be a PDF of up to 5 MB.' }, 413);
    if (error instanceof Error && (error.message === 'bad-form' || error instanceof TypeError)) return reply({ error: 'The form could not be read. Please check your file and try again.' }, 400);
    if (error && typeof error === 'object' && 'status' in error && error.status === 410) return reply({ error: 'This role is no longer accepting applications.' }, 410);
    // The unique database index also prevents concurrent duplicate applications.
    if (error instanceof Error && /unique|already exists/i.test(error.message)) return reply({ error: 'You have already applied for this role.' }, 409);
    if (error instanceof Error && error.name === 'ValidationError') return reply({ error: 'Please check your form details and attach a readable PDF CV.' }, 400);
    console.error('Careers submission failed:', error instanceof Error ? error.name : 'Unknown error');
    return reply({ error: 'We could not save your application. Please try again or email info@parttagency.com.' }, 500);
  }
}
