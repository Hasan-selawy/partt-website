import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

mkdirSync('.local/careers/cvs', { recursive: true });
const envFile = '.env.local';
let env = existsSync(envFile) ? readFileSync(envFile, 'utf8') : '';
if (!/^PAYLOAD_SECRET=.+/m.test(env)) {
  env += `\nPAYLOAD_SECRET=${randomBytes(48).toString('hex')}\n`;
  writeFileSync(envFile, env, { mode: 0o600 });
}
console.log('Local HR configuration ready. Secrets remain in .env.local.');
