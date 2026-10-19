// Local integration checks. Uses only marked temporary fixtures, never real records.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

const base = 'http://localhost:3000';
const access = readFileSync('.local/hr-access.txt', 'utf8');
const credentials = { email: access.match(/Email: (.+)/)[1], password: access.match(/Password: (.+)/)[1] };
const results = [];
async function request(path, { method = 'GET', data, cookie, form } = {}) {
  const headers = { Origin: base, ...(data ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}) };
  const response = await fetch(base + path, { method, headers, body: form || (data ? JSON.stringify(data) : undefined), redirect: 'manual' });
  const text = await response.text();
  let json; try { json = JSON.parse(text); } catch {}
  return { response, status: response.status, json, text };
}
function check(name, condition) { assert.ok(condition, name); results.push(name); }
const login = await request('/api/cms/staff/login', { method: 'POST', data: credentials });
check('Administrator login succeeds', login.status === 200);
const cookie = login.response.headers.getSetCookie().find(value => value.startsWith('payload-token=')).split(';')[0];
check('Session cookie is HttpOnly and SameSite=Lax', /httponly/i.test(login.response.headers.get('set-cookie')) && /samesite=lax/i.test(login.response.headers.get('set-cookie')));
const suffix = Date.now();
const slug = `verification-role-${suffix}`;
const job = await request('/api/cms/jobs', { method: 'POST', cookie, data: {
  title: 'Verification role — temporary', slug, status: 'draft', department: 'Verification', location: 'Amman, Jordan',
  employmentType: 'full-time', workplace: 'hybrid', summary: 'A temporary role used to verify the Careers experience. This is not a real vacancy.',
  responsibilities: 'Collaborate with the team\nTurn clear ideas into thoughtful work', requirements: 'A considered portfolio\nClear communication',
} });
if (job.status !== 201) console.log('Create job response:', job.status, job.text.slice(0,1000));
check('HR can create a draft opening', job.status === 201);
const jobId = job.json.doc.id;
writeFileSync('.local/careers-verification.json', JSON.stringify({ jobId, slug }));
const hidden = await request(`/api/cms/jobs/${jobId}`);
check('Draft roles are inaccessible to anonymous visitors', hidden.status === 404 || hidden.status === 403);
check('Public role creation denied', (await request('/api/cms/jobs', { method: 'POST', data: { title: 'Unwanted' } })).status === 403);
check('Public HR user creation denied', (await request('/api/cms/staff', { method: 'POST', data: { email: 'unwanted@example.test', password: randomBytes(24).toString('hex'), name: 'Unwanted', role: 'admin' } })).status === 403);
check('Public first-user registration denied', (await request('/api/cms/staff/first-register', { method: 'POST', data: { email: 'unwanted@example.test', password: randomBytes(24).toString('hex'), name: 'Unwanted' } })).status >= 400);
check('Public applicant listing denied', (await request('/api/cms/applications')).status === 403);
check('Public CSV export denied', (await request('/api/careers/export')).status === 401);
await request(`/api/cms/jobs/${jobId}`, { method: 'PATCH', cookie, data: { status: 'open' } });
const visible = await request(`/api/cms/jobs/${jobId}`);
check('Opening is public after HR publishes', visible.status === 200 && visible.json.status === 'open');
check('Live Careers page includes published role', (await request('/careers')).text.includes(slug));
check('Sitemap includes open role', (await request('/sitemap.xml')).text.includes(`/careers/${slug}`));
const content = 'BT /F1 16 Tf 40 180 Td (Temporary verification CV) Tj ET';
const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 240] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${content.length} >>\nstream\n${content}\nendstream`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
let pdfText = '%PDF-1.4\n'; const offsets = [0];
objects.forEach((object, i) => { offsets.push(Buffer.byteLength(pdfText)); pdfText += `${i + 1} 0 obj\n${object}\nendobj\n`; });
const xref = Buffer.byteLength(pdfText);
pdfText += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
const pdf = Buffer.from(pdfText);
writeFileSync('.local/verification-cv.pdf', pdf);
function application(overrides = {}, file = pdf, mime = 'application/pdf') {
  const form = new FormData();
  for (const [key, value] of Object.entries({ job: jobId, fullName: 'Verification Applicant', email: `verification-${suffix}@example.test`, phone: '', portfolioUrl: '', coverNote: 'Temporary integration verification.', privacyConsent: 'on', ...overrides })) form.set(key, String(value));
  form.set('cv', new Blob([file], { type: mime }), 'cv.pdf'); return form;
}
check('Disguised HTML upload rejected', (await request('/api/careers/apply', { method: 'POST', form: application({}, Buffer.from('<html>bad</html>')) })).status === 400);
check('Unsafe portfolio URL rejected', (await request('/api/careers/apply', { method: 'POST', form: application({ portfolioUrl: 'javascript:alert(1)' }) })).status === 400);
check('Missing privacy consent rejected', (await request('/api/careers/apply', { method: 'POST', form: application({ privacyConsent: '' }) })).status === 400);
check('Oversized CV rejected', [400, 413].includes((await request('/api/careers/apply', { method: 'POST', form: application({}, Buffer.alloc(5 * 1024 * 1024 + 1)) })).status));
const submit = await request('/api/careers/apply', { method: 'POST', form: application() });
if (submit.status !== 201) console.log('Apply response:', submit.status, submit.text);
check('Valid PDF application saved without exposing a record', submit.status === 201 && JSON.stringify(submit.json) === '{"ok":true}');
check('Duplicate application blocked', (await request('/api/careers/apply', { method: 'POST', form: application() })).status === 409);
const apps = await request(`/api/cms/applications?where[job][equals]=${jobId}`, { cookie });
const app = apps.json.docs[0];
check('Consent and server-controlled status recorded', app.privacyConsent && app.consentedAt && app.privacyPolicyVersion && app.status === 'new');
writeFileSync('.local/careers-verification.json', JSON.stringify({ jobId, slug, applicationId: app.id, filename: app.filename }));
const filePath = `/api/cms/applications/file/${app.filename}`;
check('Anonymous CV download denied', [403, 404].includes((await request(filePath)).status));
const download = await request(filePath, { cookie });
check('HR can download private PDF', download.status === 200 && download.text.startsWith('%PDF-'));
check('Private CVs cannot be cached and download as attachments', download.response.headers.get('cache-control').includes('no-store') && download.response.headers.get('content-disposition').includes('attachment'));
check('Applicant API responses cannot be cached', apps.response.headers.get('cache-control').includes('no-store'));
const review = await request(`/api/cms/applications/${app.id}`, { method: 'PATCH', cookie, data: { status: 'shortlisted', internalNotes: 'Verification: review saved.' } });
check('Review status and private notes save', review.status === 200 && review.json.doc.status === 'shortlisted');
const csv = await request('/api/careers/export', { cookie });
check('Authorized CSV export works', csv.status === 200 && csv.text.includes('Verification Applicant') && csv.response.headers.get('cache-control').includes('no-store'));
check('Deleting a role with applicants is prevented', (await request(`/api/cms/jobs/${jobId}`, { method: 'DELETE', cookie })).status === 400);
await request(`/api/cms/jobs/${jobId}`, { method: 'PATCH', cookie, data: { status: 'closed' } });
check('Closed role disappears from public API', [403, 404].includes((await request(`/api/cms/jobs/${jobId}`)).status));
check('Closed role refuses applications', (await request('/api/careers/apply', { method: 'POST', form: application({ email: `closed-${suffix}@example.test` }) })).status === 410);
check('Closed role retains applicants', (await request(`/api/cms/applications/${app.id}`, { cookie })).status === 200);
check('Closed role is absent from sitemap', !(await request('/sitemap.xml')).text.includes(`/careers/${slug}`));
// Reopen this marked fixture only for browser tests. Cleanup runs separately.
await request(`/api/cms/jobs/${jobId}`, { method: 'PATCH', cookie, data: { status: 'open' } });
const hrPassword = randomBytes(24).toString('hex');
const hr = await request('/api/cms/staff', { method: 'POST', cookie, data: { name: 'Verification HR', email: `hr-${suffix}@example.test`, password: hrPassword, role: 'hr' } });
check('Administrator can add an HR user', hr.status === 201);
const hrId = hr.json.doc.id;
const hrLogin = await request('/api/cms/staff/login', { method: 'POST', data: { email: `hr-${suffix}@example.test`, password: hrPassword } });
const hrCookie = hrLogin.response.headers.getSetCookie().find(value => value.startsWith('payload-token=')).split(';')[0];
check('HR user can review applicants', (await request(`/api/cms/applications/${app.id}`, { cookie: hrCookie })).status === 200);
check('HR user cannot create staff', (await request('/api/cms/staff', { method: 'POST', cookie: hrCookie, data: { name: 'Escalated', email: 'escalated@example.test', password: hrPassword, role: 'admin' } })).status === 403);
await request(`/api/cms/staff/${hrId}`, { method: 'PATCH', cookie: hrCookie, data: { role: 'admin' } });
const unchanged = await request(`/api/cms/staff/${hrId}`, { cookie });
check('HR user cannot promote their own role', unchanged.json.role === 'hr');
await request('/api/cms/staff/logout', { method: 'POST', cookie: hrCookie });
check('Sign-out invalidates the server session', (await request('/api/cms/applications', { cookie: hrCookie })).status === 403);
await request(`/api/cms/staff/${hrId}`, { method: 'DELETE', cookie });
writeFileSync('.planning/quick/20261018-careers-dashboard/integration-results.json', JSON.stringify({ passed: results.length, checks: results }, null, 2));
console.log(`${results.length} integration checks passed. Temporary role remains for browser verification; remove it with the cleanup command.`);
