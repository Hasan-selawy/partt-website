import { validateContact, type ContactResponse } from '@/lib/contact/validate';

/**
 * Receives the contact form.
 *
 * It checks the message with the same rules as the browser, then forwards it as JSON to the address in
 * CONTACT_WEBHOOK_URL. Until that is set it answers `not_configured`, and the form tells the visitor the
 * truth instead of pretending the message was sent.
 */

const json = (body: ContactResponse, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, code: 'bad_request' }, 400);
  }
  if (!data || typeof data !== 'object') return json({ ok: false, code: 'bad_request' }, 400);

  // the hidden field people never see: only automated senders fill it in
  if (typeof data.hp_check === 'string' && data.hp_check.trim()) return json({ ok: false, code: 'bad_request' }, 400);

  const check = validateContact(data);
  if (!check.ok) return json({ ok: false, code: 'invalid', errors: check.errors }, 422);

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return json({ ok: false, code: 'not_configured' }, 503);

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...check.value, source: 'partt website', sentAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return json({ ok: false, code: 'delivery_failed' }, 502);
  } catch {
    return json({ ok: false, code: 'delivery_failed' }, 502);
  }

  return json({ ok: true }, 200);
}
