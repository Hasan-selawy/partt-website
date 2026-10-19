import { z } from 'zod';
import { MAX_CV_BYTES } from './settings';

export const applicationSchema = z.object({
  job: z.coerce.number().int().positive(),
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z.email().max(254).transform(value => value.toLowerCase()),
  phone: z.string().trim().max(40),
  portfolioUrl: z.union([z.literal(''), z.url({ protocol: /^https?$/ }).max(500)]),
  coverNote: z.string().trim().max(4000),
  privacyConsent: z.literal('on', { error: 'Please agree to the privacy notice to apply.' }),
});

export function validateCV(file: File, bytes: Buffer): string | null {
  if (file.size === 0 || file.size > MAX_CV_BYTES) return 'Your CV must be a PDF of up to 5 MB.';
  if (file.type !== 'application/pdf' || bytes.subarray(0, 5).toString('ascii') !== '%PDF-') return 'Please upload a valid PDF CV.';
  if (!bytes.subarray(Math.max(0, bytes.length - 1024)).includes(Buffer.from('%%EOF'))) return 'This PDF appears incomplete. Please export your CV as a PDF and try again.';
  return null;
}

// One persistent app process is the supported local deployment. Shared/edge
// deployments must replace this with a shared limiter at the reverse proxy.
const attempts = new Map<string, { count: number; until: number }>();
export function allowApplication(key: string, limit = 8) {
  const now = Date.now();
  for (const [id, bucket] of attempts) if (bucket.until <= now) attempts.delete(id);
  if (attempts.size > 10000 && !attempts.has(key)) return false;
  const bucket = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
  bucket.count++;
  attempts.set(key, bucket);
  return bucket.count <= limit;
}

export async function readBoundedForm(request: Request) {
  const max = MAX_CV_BYTES + 64 * 1024;
  if (Number(request.headers.get('content-length')) > max) throw new Error('too-large');
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) throw new Error('bad-form');
  if (!request.body) throw new Error('bad-form');
  const reader = request.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > max) { await reader.cancel(); throw new Error('too-large'); }
      chunks.push(new Uint8Array(value));
    }
  } finally { reader.releaseLock(); }
  return new Response(new Blob(chunks), { headers: { 'content-type': request.headers.get('content-type')! } }).formData();
}
