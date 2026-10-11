/**
 * Contact form rules. The browser and the server both use this one file, so they can never disagree.
 */

export type ContactInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
};

export type ContactField = keyof ContactInput;

export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_LIMITS = { name: 120, company: 160, email: 200, phone: 40, service: 80, budget: 120, message: 4000 } as const;

export const emptyContact: ContactInput = { name: '', company: '', email: '', phone: '', service: '', budget: '', message: '' };

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

// deliberately simple: one @, something on both sides, a dot in the domain
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d][\d\s().-]{5,}$/;

export function validateContact(
  data: Record<string, unknown>,
): { ok: true; value: ContactInput } | { ok: false; errors: ContactErrors } {
  const value: ContactInput = {
    name: text(data.name),
    company: text(data.company),
    email: text(data.email),
    phone: text(data.phone),
    service: text(data.service),
    budget: text(data.budget),
    message: text(data.message),
  };
  const errors: ContactErrors = {};

  if (!value.name) errors.name = 'Enter your name.';
  if (!value.email) errors.email = 'Enter your email address.';
  else if (!EMAIL.test(value.email)) errors.email = 'Enter an email address like name@company.com.';
  if (value.phone && !PHONE.test(value.phone)) errors.phone = 'Enter a phone number using digits, spaces or +.';
  if (!value.message) errors.message = 'Tell us a little about the project.';
  else if (value.message.length < 20) errors.message = 'Add a little more detail: at least 20 characters.';

  (Object.keys(CONTACT_LIMITS) as ContactField[]).forEach((k) => {
    if (!errors[k] && value[k].length > CONTACT_LIMITS[k]) errors[k] = `Keep this under ${CONTACT_LIMITS[k]} characters.`;
  });

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

/** What the API answers. `not_configured` means the form works but no inbox has been connected yet. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; code: 'invalid'; errors: ContactErrors }
  | { ok: false; code: 'not_configured' | 'delivery_failed' | 'bad_request' };
