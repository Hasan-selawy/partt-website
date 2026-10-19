import { getPayload } from 'payload';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import config from '../payload.config';

process.env.DISABLE_PAYLOAD_HMR = 'true';
const payload = await getPayload({ config });
const existing = await payload.count({ collection: 'staff', overrideAccess: true });
if (existing.totalDocs) {
  console.log('HR already has a user. Existing credentials were preserved.');
} else {
  const email = process.env.HR_ADMIN_EMAIL || 'info@parttagency.com';
  const password = process.env.HR_ADMIN_PASSWORD || randomBytes(24).toString('base64url');
  await payload.create({ collection: 'staff', overrideAccess: true, context: { bootstrapStaff: true },
    data: { name: 'Partt Administrator', email, password, role: 'admin' },
  });
  writeFileSync('.local/hr-access.txt', `Partt HR — local access\nURL: http://localhost:3000/hr\nEmail: ${email}\nPassword: ${password}\n\nChange your password in Account after signing in. Keep this file private.\n`, { mode: 0o600, flag: 'wx' });
  console.log('Administrator created. Private access details: .local/hr-access.txt');
}
await payload.destroy();
