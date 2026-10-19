import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { Staff } from './src/cms/Staff';
import { Jobs } from './src/cms/Jobs';
import { Applications } from './src/cms/Applications';
import { careersDataDir, careersOrigin, MAX_CV_BYTES } from './src/lib/careers/settings';

const dirname = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(careersDataDir, { recursive: true });
if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET is required. Run npm run hr:setup first.');

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: careersOrigin,
  routes: { admin: '/hr', api: '/api/cms' },
  cors: [careersOrigin], csrf: [careersOrigin],
  admin: {
    user: 'staff', importMap: { baseDir: dirname, importMapFile: path.join(dirname, 'src/app/(cms)/hr/importMap.ts') },
    meta: { titleSuffix: ' | partt HR', robots: 'noindex, nofollow' },
    components: {
      graphics: { Logo: '/src/components/hr/HRBrand#HRBrand', Icon: '/src/components/hr/HRBrand#HRIcon' },
      beforeDashboard: ['/src/components/hr/HROverview#HROverview'],
      beforeLogin: ['/src/components/hr/HRBrand#HRLoginNote'],
      views: { forgot: { Component: '/src/components/hr/HRBrand#HRPasswordHelp', path: '/forgot' } },
    },
  },
  collections: [Staff, Jobs, Applications],
  db: sqliteAdapter({
    migrationDir: path.join(dirname, 'src/migrations'),
    busyTimeout: 5000,
    client: {
      url: process.env.DATABASE_URI || `file:${path.join(careersDataDir, 'careers.db')}`,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  upload: { limits: { fileSize: MAX_CV_BYTES }, abortOnLimit: true },
  // No console mail adapter: reset tokens must never be written to server logs.
  email: () => ({
    name: 'mail-not-configured', defaultFromAddress: 'info@parttagency.com', defaultFromName: 'partt',
    sendEmail: async () => { throw new Error('Email delivery is not configured. Ask your administrator to reset your password.'); },
  }),
  typescript: { outputFile: path.join(dirname, 'src/payload-types.ts') },
  graphQL: { disable: true },
});
