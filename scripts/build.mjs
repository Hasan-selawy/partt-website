import { mkdir, cp, rm, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { assertVercelConfig, netlifyHeaders } from './policy.mjs';
import { siteRoutes } from './routes.mjs';

const originFiles = ['index.html', 'styles.css', 'content.js', 'app.js', 'assets', 'robots.txt', 'sitemap.xml', 'site.webmanifest'];

function redirectPage(route, origin) {
  const hash = `/#/${route}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting — partt</title>
<link rel="canonical" href="${origin}/#/${route}">
<meta http-equiv="refresh" content="0; url=${hash}">
<meta name="robots" content="noindex">
</head>
<body>
<p><a href="${hash}">Continue</a></p>
</body>
</html>
`;
}

const notFoundPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>This part is missing. — partt</title>
<meta name="robots" content="noindex">
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B0344;color:#FFFFF9;font-family:sans-serif;text-align:center;padding:24px}
  a{color:#FFFFF9}span{color:#E7292B;letter-spacing:.18em;font-size:13px}h1{font-weight:500;font-size:40px;margin:12px 0}
</style>
</head>
<body>
<main><span>404</span><h1>This part is missing.</h1><p><a href="/">Back to home</a></p></main>
</body>
</html>
`;

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const name of originFiles) await cp(name, join('dist', name), { recursive: true });
const { site, routes } = await siteRoutes();
for (const route of routes) {
  const file = join('dist', route, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, redirectPage(route, site.url));
}
await writeFile('dist/404.html', notFoundPage);
await writeFile('dist/_headers', netlifyHeaders());
assertVercelConfig(JSON.parse(await readFile('vercel.json', 'utf8')));
console.log(`Built static website in dist/. ${routes.length} path redirects.`);
