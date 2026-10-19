import { getPayload } from 'payload';
import config from '@payload-config';
import { isStaff } from '@/cms/access';

export const runtime = 'nodejs';
function cell(value: unknown) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@\-\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export async function GET(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!isStaff({ user })) return Response.json({ error: 'Sign in to HR first.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const rows: unknown[][] = [['Name', 'Email', 'Phone', 'Job', 'Status', 'Portfolio', 'Applied at']];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const applications = await payload.find({ collection: 'applications', overrideAccess: false, user, depth: 1, limit: 100, page, sort: '-createdAt' });
    applications.docs.forEach(app => rows.push([app.fullName, app.email, app.phone, typeof app.job === 'object' ? app.job.title : app.job, app.status, app.portfolioUrl, app.createdAt]));
    hasNext = applications.hasNextPage; page++;
  }
  return new Response('\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n'), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="partt-applications.csv"', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
