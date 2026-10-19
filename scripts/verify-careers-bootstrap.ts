import assert from 'node:assert/strict';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { getPayload } from 'payload';
import config from '../payload.config';

if (path.resolve(process.env.CAREERS_DATA_DIR || '') !== path.resolve('.local/production-verification')) throw new Error('Use the isolated production-verification directory only.');
const payload = await getPayload({ config });
try {
  assert.equal((await payload.count({ collection: 'staff', overrideAccess: true })).totalDocs, 0);
  let denied = false;
  try {
    // Payload's public first-register operation uses overrideAccess. The hook
    // must still block it when the staff table is completely empty.
    await payload.create({ collection: 'staff', overrideAccess: true, data: { name: 'Untrusted first user', email: 'untrusted@example.test', password: randomBytes(24).toString('hex'), role: 'admin' } });
  } catch (error) { denied = error instanceof Error && error.name === 'Forbidden'; }
  assert.ok(denied, 'Public first-user bypass must be denied even on an empty database');
  assert.equal((await payload.count({ collection: 'staff', overrideAccess: true })).totalDocs, 0);
  const staff = await payload.create({ collection: 'staff', overrideAccess: true, context: { bootstrapStaff: true },
    data: { name: 'Trusted bootstrap', email: 'bootstrap@example.test', password: randomBytes(24).toString('hex'), role: 'admin' },
  });
  assert.equal(staff.role, 'admin');
  writeFileSync('.planning/quick/20261018-careers-dashboard/bootstrap-results.json', JSON.stringify({ productionMigration: 'passed on fresh isolated database', publicFirstUserOnEmptyDatabase: 'denied', privilegedLocalBootstrap: 'passed' }, null, 2));
  console.log('Fresh production schema, empty-database registration denial, and privileged bootstrap verified.');
} finally { await payload.destroy(); }
