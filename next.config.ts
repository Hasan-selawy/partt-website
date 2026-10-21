import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  experimental: { globalNotFound: true },
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  outputFileTracingExcludes: { '*': ['./.local/**/*', './.env*'] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    ] }];
  },
  images: {
    localPatterns: [
      { pathname: '/**', search: '' },
      { pathname: '/img/work/**', search: '?v=client-files-20261014' },
    ],
    // serve modern formats and let the browser pick a size close to what it needs
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2400],
  },
};

export default config;
