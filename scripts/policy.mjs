// Security and cache policy shared by the Node server, dist/_headers, and vercel.json.
// ponytail: asset filenames are not hashed, so a week is the ceiling. Fingerprint the files if a stale image after deploy becomes a problem.
// ponytail: page templates set inline style attributes. Remove 'unsafe-inline' only after those move into classes.

export const assetCache = 'public, max-age=604800';
export const documentCache = 'no-cache';
export const metadataCache = 'public, max-age=3600';

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "img-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "script-src 'self'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'self'",
    "object-src 'none'",
  ].join('; '),
};

export function cacheControl(pathname) {
  if (pathname.startsWith('/assets/')) return assetCache;
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname === '/site.webmanifest') return metadataCache;
  return documentCache;
}

export function netlifyHeaders() {
  const security = Object.entries(securityHeaders).map(([key, value]) => `  ${key}: ${value}`).join('\n');
  return [
    '/*',
    security,
    `  Cache-Control: ${documentCache}`,
    '',
    '/robots.txt',
    `  Cache-Control: ${metadataCache}`,
    '',
    '/sitemap.xml',
    `  Cache-Control: ${metadataCache}`,
    '',
    '/site.webmanifest',
    `  Cache-Control: ${metadataCache}`,
    '',
    '/assets/*',
    `  Cache-Control: ${assetCache}`,
    '',
  ].join('\n');
}

export function assertVercelConfig(config) {
  const flat = (config.headers || []).flatMap(group => group.headers || []);
  for (const [key, value] of Object.entries(securityHeaders)) {
    if (!flat.some(item => item.key === key && item.value === value)) throw new Error(`vercel.json missing ${key}`);
  }
  if (!flat.some(item => item.key === 'Cache-Control' && item.value === assetCache)) throw new Error('vercel.json missing asset cache');
  if (config.framework !== null || config.outputDirectory !== 'dist' || config.buildCommand !== 'npm run build' || config.installCommand !== 'npm install --omit=dev') {
    throw new Error('vercel.json does not publish dist/');
  }
}
