import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

const origin = process.argv[2] || 'http://127.0.0.1:3100';
const results = [];
const retired = /careers|recruitment|payload-token|\/hr(?:[\/"<]|$)|\/api\/cms/i;
const request = (path, options) => fetch(new URL(path, origin), {
  ...options,
  redirect: 'manual',
  signal: AbortSignal.timeout(15000),
});

const sitemapResponse = await request('/sitemap.xml');
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
assert.doesNotMatch(sitemap, retired);
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
assert.equal(paths.length, 16, 'All existing public pages and eight case studies must remain');
assert(paths.includes('/privacy-policy') && paths.includes('/cookie-policy') && paths.includes('/terms-and-conditions'));
results.push({ path: '/sitemap.xml', status: 200, publicPages: paths.length });

for (const path of paths) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('set-cookie'), null, path);
  const html = await response.text();
  assert.doesNotMatch(html, retired, `${path} must not advertise the retired system`);
  assert.match(html, /<footer/, `${path} must retain the shared footer`);
  results.push({ path, status: response.status });
}

for (const [path, method] of [
  ['/careers', 'GET'], ['/careers/example-role', 'GET'],
  ['/hr', 'GET'], ['/hr/login', 'GET'], ['/hr/collections/jobs', 'GET'],
  ['/api/careers/apply', 'POST'], ['/api/careers/export', 'GET'],
  ['/api/cms/jobs', 'GET'], ['/api/cms/applications', 'GET'], ['/api/cms/staff/login', 'POST'],
]) {
  const response = await request(path, { method });
  assert.equal(response.status, 404, `${method} ${path}`);
  assert.doesNotMatch(await response.text(), /payload-token|type="password"/i);
  results.push({ path, method, status: response.status });
}

for (const [body, status, code] of [['{', 400, 'bad_request'], ['{}', 422, 'invalid']]) {
  const response = await request('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  assert.equal(response.status, status);
  assert.equal((await response.json()).code, code);
  results.push({ path: '/api/contact', method: 'POST', status, code });
}

const robots = await request('/robots.txt');
assert.equal(robots.status, 200);
assert.match(await robots.text(), /Disallow: \/api\//);
results.push({ path: '/robots.txt', status: 200 });
const manifest = JSON.parse(await readFile('.next-build/server/app-paths-manifest.json', 'utf8'));
assert.doesNotMatch(Object.keys(manifest).join('\n'), /careers|\(cms\)|\/hr/);

await writeFile(new URL('./http-verification.json', import.meta.url), `${JSON.stringify({ origin, checks: results.length, results }, null, 2)}\n`);
console.log(`Passed ${results.length} production HTTP checks; public routes retained and recruitment routes return 404.`);
