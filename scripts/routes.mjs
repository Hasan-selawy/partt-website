import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

export async function siteRoutes() {
  const context = { window: {} };
  runInNewContext(await readFile(new URL('../content.js', import.meta.url), 'utf8'), context);
  const content = context.window.PARTT_CONTENT;
  const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  const templates = app.match(/const templates=\{([^}]+)\}/);
  const aliases = app.match(/const aliases=\{([^}]+)\}/);
  const projectAlias = app.match(/if\(slug==='([^']+)'\)slug='([^']+)'/);
  if (!templates || !aliases || !projectAlias) throw new Error('Could not read routes from app.js');
  const routes = new Set();
  for (const match of templates[1].matchAll(/(?:^|,)\s*(?:'([^']+)'|(\w+))\s*:/g)) routes.add(match[1] || match[2]);
  for (const service of content.services) routes.add(`services/${service.slug}`);
  for (const project of content.projects) routes.add(`work/${project.slug}`);
  for (const match of aliases[1].matchAll(/(\w+):'([^']+)'/g)) routes.add(`services/${match[1]}`);
  routes.add(`work/${projectAlias[1]}`);
  for (const route of routes) {
    if (!/^[a-z0-9/-]+$/.test(route)) throw new Error(`Unsafe route: ${route}`);
  }
  return { site: content.site, routes: [...routes].sort() };
}
