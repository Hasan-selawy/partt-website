import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, readFile, access, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createServer } from 'node:net';
import { serverOptions } from '../server.mjs';
import { securityHeaders, assetCache, documentCache, metadataCache } from './policy.mjs';
import { siteRoutes } from './routes.mjs';

const root = resolve('.');
function spawnNode(args, env) {
  const child = spawn(process.execPath, args, { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  child.output = () => output;
  return child;
}
function baseEnv(extra) {
  const env = { ...process.env, ...extra };
  if (!Object.hasOwn(extra, 'SERVE_DIR')) delete env.SERVE_DIR;
  return env;
}
function request(port, path, method = 'GET') {
  return new Promise((resolveRequest, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path, method }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolveRequest({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.end();
  });
}
async function waitReady(child) {
  const start = Date.now();
  while (Date.now() - start < 8000) {
    if (child.output().includes('Partt website')) return;
    if (child.exitCode !== null) throw new Error(child.output() || `server exited ${child.exitCode}`);
    await new Promise(r => setTimeout(r, 40));
  }
  throw new Error(`server timeout\n${child.output()}`);
}
async function stop(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await Promise.race([once(child, 'exit'), new Promise(r => setTimeout(r, 2000))]);
  if (child.exitCode === null) child.kill('SIGKILL');
}
function freePort() {
  return new Promise((resolvePort, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolvePort(port));
    });
  });
}
function pngSize(buffer) {
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const local = serverOptions({ PORT: '5173' });
assert.equal(local.host, '127.0.0.1');
assert.equal(local.root, root);
assert.equal(local.production, false);
const production = serverOptions({ NODE_ENV: 'production', PORT: '8080' });
assert.equal(production.host, '0.0.0.0');
assert.equal(production.root, resolve('dist'));
assert.throws(() => serverOptions({ PORT: 'nope' }), /Invalid PORT/);

const empty = await mkdtemp(join(tmpdir(), 'partt-empty-'));
const missingPort = await freePort();
const missing = spawnNode(['scripts/start-prod.mjs'], baseEnv({ HOST: '127.0.0.1', PORT: String(missingPort), SERVE_DIR: empty }));
const [missingCode] = await once(missing, 'exit');
assert.equal(missingCode, 1, missing.output());
assert.match(missing.output(), /Missing/);

const build = spawnNode(['scripts/build.mjs'], baseEnv({}));
const [buildCode] = await once(build, 'exit');
assert.equal(buildCode, 0, build.output());
const { site, routes } = await siteRoutes();
assert.equal(site.url, 'https://www.parttagency.com');
for (const name of ['index.html', '404.html', '_headers', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'work/olvy/index.html', 'services/brand/index.html']) {
  await access(resolve('dist', name));
}
await assert.rejects(access(resolve('dist/server.mjs')));
await assert.rejects(access(resolve('dist/.local')));
const built = await readFile('dist/index.html', 'utf8');
assert.match(built, /rel="canonical" href="https:\/\/www\.parttagency\.com\/"/);
assert.match(built, /property="og:image" content="https:\/\/www\.parttagency\.com\/assets\/og\.png"/);
const headersFile = await readFile('dist/_headers', 'utf8');
for (const value of Object.values(securityHeaders)) assert.ok(headersFile.includes(value), value);
assert.ok(headersFile.indexOf(documentCache) < headersFile.indexOf(`/assets/*\n  Cache-Control: ${assetCache}`));
assert.ok(headersFile.includes(metadataCache));

const refs = new Set();
for (const name of ['index.html', 'styles.css', 'app.js', 'content.js', 'site.webmanifest', '404.html', 'robots.txt', 'sitemap.xml']) {
  const text = await readFile(resolve('dist', name), 'utf8');
  for (const match of text.matchAll(/assets\/[A-Za-z0-9_./-]+/g)) refs.add(resolve('dist', match[0]));
  for (const match of text.matchAll(/https:\/\/www\.parttagency\.com(\/assets\/[^"' #\s]+)/g)) refs.add(resolve('dist', match[1].slice(1)));
}
const missingRefs = [];
for (const file of refs) {
  try {
    const info = await stat(file);
    if (!info.isFile() || info.size === 0) missingRefs.push(file);
  } catch { missingRefs.push(file); }
}
assert.deepEqual(missingRefs, [], `Missing published files:\n${missingRefs.join('\n')}`);
const og = pngSize(await readFile('dist/assets/og.png'));
const icon = pngSize(await readFile('dist/assets/icon-512.png'));
assert.deepEqual(og, { width: 1200, height: 630 });
assert.deepEqual(icon, { width: 512, height: 512 });

let child;
const prodPort = await freePort();
try {
  child = spawnNode(['scripts/start-prod.mjs'], baseEnv({ HOST: '127.0.0.1', PORT: String(prodPort) }));
  await waitReady(child);
  assert.match(child.output(), /production/);
  const home = await request(prodPort, '/');
  assert.equal(home.status, 200);
  assert.match(home.headers['content-type'], /^text\/html/);
  assert.equal(home.headers['cache-control'], documentCache);
  for (const [key, value] of Object.entries(securityHeaders)) assert.equal(home.headers[key.toLowerCase()], value, key);
  assert.equal(home.headers['access-control-allow-origin'], undefined);
  const head = await request(prodPort, '/', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.body.length, 0);
  const denied = await request(prodPort, '/', 'POST');
  assert.equal(denied.status, 405);
  assert.match(denied.headers.allow, /GET, HEAD/);
  const asset = await request(prodPort, '/assets/logo.svg');
  assert.equal(asset.status, 200);
  assert.equal(asset.headers['cache-control'], assetCache);
  assert.match(asset.headers['content-type'], /^image\/svg\+xml/);
  const robots = await request(prodPort, '/robots.txt');
  assert.equal(robots.status, 200);
  assert.match(robots.body.toString(), /Sitemap: https:\/\/www\.parttagency\.com\/sitemap\.xml/);
  assert.equal(robots.headers['cache-control'], metadataCache);
  const sitemap = await request(prodPort, '/sitemap.xml');
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers['content-type'], /application\/xml/);
  assert.match(sitemap.body.toString(), /<loc>https:\/\/www\.parttagency\.com\/<\/loc>/);
  const manifest = await request(prodPort, '/site.webmanifest');
  assert.equal(manifest.status, 200);
  assert.match(manifest.headers['content-type'], /application\/manifest\+json/);
  const license = await request(prodPort, '/assets/fonts/Poppins-OFL.txt');
  assert.equal(license.status, 200);
  assert.match(license.body.toString(), /SIL Open Font License/);
  for (const route of routes) {
    for (const path of [`/${route}`, `/${route}/`]) {
      const page = await request(prodPort, path);
      assert.equal(page.status, 200, path);
      assert.match(page.body.toString(), new RegExp(`url=/#/${route}`));
      assert.match(page.body.toString(), /noindex/);
    }
  }
  const lost = await request(prodPort, '/not-a-page');
  assert.equal(lost.status, 404);
  assert.match(lost.body.toString(), /This part is missing/);
  assert.equal(lost.headers['x-content-type-options'], 'nosniff');
  for (const path of ['/%2e%2e/package.json', '/assets/%2e%2e/%2e%2e/package.json', '/%5c..%5cpackage.json']) {
    const escaped = await request(prodPort, path);
    assert.equal(escaped.status, 404, path);
    assert.equal(escaped.body.includes('partt-website'), false, path);
  }
} finally {
  await stop(child);
}

let dev;
const devPort = await freePort();
try {
  dev = spawnNode(['server.mjs'], baseEnv({ NODE_ENV: 'development', HOST: '127.0.0.1', PORT: String(devPort) }));
  await waitReady(dev);
  assert.match(dev.output(), /local/);
  const preview = await request(devPort, '/assets/logo.svg');
  assert.equal(preview.status, 200);
  assert.equal(preview.headers['cache-control'], 'no-cache');
  assert.equal(preview.headers['x-content-type-options'], 'nosniff');
  const plain = await request(devPort, '/work/olvy');
  assert.equal(plain.status, 404);
  assert.equal(plain.body.toString(), 'Not found');
} finally {
  await stop(dev);
}

console.log(`PASS: deploy checks. ${routes.length} path redirects, ${refs.size} assets, production server on dist/, local server unchanged.`);
