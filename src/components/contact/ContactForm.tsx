'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { CONTACT_LIMITS, emptyContact, validateContact, type ContactErrors, type ContactField, type ContactInput, type ContactResponse } from '@/lib/contact/validate';

type Status = 'idle' | 'sending' | 'sent' | 'not_configured' | 'failed';

const ORDER: ContactField[] = ['name', 'company', 'email', 'phone', 'service', 'budget', 'message'];

/**
 * The project inquiry form. It checks the fields in the browser, sends them to /api/contact, and reports
 * exactly what happened. It only says "sent" when the server confirms delivery.
 */
export function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<ContactInput>(emptyContact);
  const [trap, setTrap] = useState('');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const id = (field: string) => `${uid}-${field}`;
  const set = (field: ContactField) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const showErrors = (next: ContactErrors) => {
    setErrors(next);
    const first = ORDER.find((f) => next[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const check = validateContact(values);
    if (!check.ok) {
      setStatus('idle');
      showErrors(check.errors);
      return;
    }
    setErrors({});
    setStatus('sending');
    let next: Status = 'failed';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...check.value, hp_check: trap }),
      });
      const data = (await res.json()) as ContactResponse;
      if (data.ok) next = 'sent';
      else if (data.code === 'invalid') {
        setStatus('idle');
        showErrors(data.errors);
        return;
      } else if (data.code === 'not_configured') next = 'not_configured';
    } catch {
      next = 'failed';
    }
    setStatus(next);
    if (next === 'sent') setValues(emptyContact);
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const field = (name: ContactField, label: string, opts: { required?: boolean; type?: string; autoComplete?: string; hint?: string } = {}) => (
    <div className={`fld${errors[name] ? ' bad' : ''}`}>
      <label htmlFor={id(name)}>
        {label}
        {opts.required ? null : <span className="opt"> (optional)</span>}
      </label>
      <input
        id={id(name)}
        name={name}
        type={opts.type ?? 'text'}
        autoComplete={opts.autoComplete}
        value={values[name]}
        onChange={set(name)}
        maxLength={CONTACT_LIMITS[name]}
        required={opts.required}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={`${opts.hint ? `${id(name)}-hint ` : ''}${errors[name] ? `${id(name)}-err` : ''}`.trim() || undefined}
      />
      {opts.hint ? (
        <p className="hint" id={`${id(name)}-hint`}>
          {opts.hint}
        </p>
      ) : null}
      {errors[name] ? (
        <p className="err" id={`${id(name)}-err`}>
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  return (
    <form ref={formRef} className="form" onSubmit={submit} noValidate aria-label="Start a project">
      <div className="form-grid">
        {field('name', 'Your name', { required: true, autoComplete: 'name' })}
        {field('company', 'Company or brand', { autoComplete: 'organization' })}
        {field('email', 'Email', { required: true, type: 'email', autoComplete: 'email' })}
        {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}

        <div className="fld">
          <label htmlFor={id('service')}>
            What do you need help with?<span className="opt"> (optional)</span>
          </label>
          <select id={id('service')} name="service" value={values.service} onChange={set('service')}>
            <option value="">Choose one</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Several of these">Several of these</option>
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>

        {field('budget', 'Approximate budget', { hint: 'A rough range is enough.' })}

        <div className={`fld wide${errors.message ? ' bad' : ''}`}>
          <label htmlFor={id('message')}>About the project</label>
          <textarea
            id={id('message')}
            name="message"
            rows={6}
            value={values.message}
            onChange={set('message')}
            maxLength={CONTACT_LIMITS.message}
            required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={`${id('message')}-hint${errors.message ? ` ${id('message')}-err` : ''}`}
          />
          <p className="hint" id={`${id('message')}-hint`}>
            What you are working on, what you want it to achieve, and any dates that matter.
          </p>
          {errors.message ? (
            <p className="err" id={`${id('message')}-err`}>
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* a field people never see: anything typed here marks the message as automated */}
        <div className="trap" aria-hidden="true">
          <label htmlFor={id('hp_check')}>Leave this field empty</label>
          <input id={id('hp_check')} name="hp_check" tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </div>
      </div>

      <div className="form-end">
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending' : 'Send message'} <i aria-hidden="true">→</i>
        </button>
        <p className="form-note">We only use these details to reply to you.</p>
      </div>

      <div ref={statusRef} className={`form-status${status === 'idle' || status === 'sending' ? '' : ` is-${status}`}`} role="status" aria-live="polite" tabIndex={-1}>
        {status === 'sent' && <p>Your message is with us. We will reply by email.</p>}
        {status === 'not_configured' && (
          <p>
            This form is not connected to our inbox yet, so your message was not sent. Please email <a href={`mailto:${site.email}`}>{site.email}</a> or call{' '}
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>.
          </p>
        )}
        {status === 'failed' && (
          <p>
            We could not send your message, and what you typed is still here. Try again, or email <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
