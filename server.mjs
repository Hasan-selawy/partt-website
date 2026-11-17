import http from 'node:http';
import { access, readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { cacheControl, securityHeaders } from './scripts/policy.mjs';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.ico': 'image/x-icon',
};

export function serverOptions(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const port = Number(env.PORT || 5173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
  return {
    production,
    port,
    host: env.HOST || (production ? '0.0.0.0' : '127.0.0.1'),
    root: resolve(env.SERVE_DIR || (production ? 'dist' : '.')),
  };
}

function inside(root, file) {
  return file === root || file.startsWith(root + sep);
}

function send(res, status, headers, body, method) {
  res.writeHead(status, headers);
  if (method === 'HEAD') res.end();
  else res.end(body);
}

async function sendMissing(req, res, root) {
  const file = resolve(root, '404.html');
  if (inside(root, file)) {
    try {
      const body = await readFile(file);
      send(res, 404, { 'Content-Type': types['.html'], 'Cache-Control': 'no-cache', ...securityHeaders }, body, req.method);
      return;
    } catch { /* plain response below */ }
  }
  send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache', ...securityHeaders }, 'Not found', req.method);
}

async function respond(req, res, options) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, { Allow: 'GET, HEAD', ...securityHeaders }, '', req.method);
    return;
  }
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname.includes('\\') || pathname.includes('\0')) return sendMissing(req, res, options.root);
  let file = resolve(options.root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!inside(options.root, file)) return sendMissing(req, res, options.root);
  let info;
  try { info = await stat(file); }
  catch { return sendMissing(req, res, options.root); }
  if (info.isDirectory()) {
    file = resolve(file, 'index.html');
    if (!inside(options.root, file)) return sendMissing(req, res, options.root);
  }
  const type = types[extname(file)];
  if (!type) return sendMissing(req, res, options.root);
  const body = await readFile(file);
  send(res, 200, {
    'Content-Type': type,
    'Cache-Control': options.production ? cacheControl(pathname) : 'no-cache',
    ...securityHeaders,
  }, body, req.method);
}

export async function startServer(env = process.env) {
  const options = serverOptions(env);
  if (options.production) {
    try { await access(resolve(options.root, 'index.html')); }
    catch { throw new Error(`Missing ${resolve(options.root, 'index.html')}. Run npm run build.`); }
  }
  const server = http.createServer((req, res) => {
    respond(req, res, options).catch(() => sendMissing(req, res, options.root).catch(() => {}));
  });
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(options.port, options.host, resolveListen);
  });
  console.log(`Partt website: http://${options.host}:${options.port} (${options.production ? 'production' : 'local'} ${options.root})`);
  return server;
}

const isMain = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isMain) startServer().catch(error => { console.error(error.message); process.exit(1); });
