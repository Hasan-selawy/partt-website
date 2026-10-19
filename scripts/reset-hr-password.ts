// Local server access is required. HR can reset other users in the dashboard.
import { getPayload } from 'payload';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import config from '../payload.config';

process.env.DISABLE_PAYLOAD_HMR = 'true';
const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error('Usage: npm run hr:reset -- administrator@email.com');
const payload = await getPayload({ config });
try {
  const result = await payload.find({ collection: 'staff', where: { email: { equals: email } }, overrideAccess: true, limit: 1 });
  const user = result.docs[0];
  if (!user) throw new Error('No matching HR user. No password was changed.');
  const password = randomBytes(24).toString('base64url');
  await payload.update({ collection: 'staff', id: user.id, overrideAccess: true, data: { password, sessions: [], loginAttempts: 0, lockUntil: null } });
  writeFileSync('.local/hr-recovery.txt', `Email: ${email}\nPassword: ${password}\n\nPrevious sessions were revoked. Change this password after signing in.\n`, { mode: 0o600 });
  console.log('Password reset. Private access details: .local/hr-recovery.txt');
} finally { await payload.destroy(); }
