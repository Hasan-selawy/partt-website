'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';

export function ApplicationForm({ jobId, title }: { jobId: number; title: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get('cv');
    if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024 || file.type !== 'application/pdf') {
      setMessage('Please attach your CV as a PDF of up to 5 MB.'); setState('error');
      form.querySelector<HTMLInputElement>('[name="cv"]')?.focus(); return;
    }
    setState('sending'); setMessage('');
    try {
      const response = await fetch('/api/careers/apply', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'We could not save your application. Please try again.');
      form.reset(); setState('sent');
    } catch (error) {
      setState('error'); setMessage(error instanceof Error ? error.message : 'Connection interrupted. Please try again.');
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }
  if (state === 'sent') return <div className="cr-success" tabIndex={-1} ref={statusRef} role="status"><h3 className="disp">You’re on our radar.</h3><p>Your application for <strong>{title}</strong> has been saved. Our team will review it and contact you if there’s a next step.</p><Link href="/careers" className="cr-text-link">Back to all openings ↗</Link></div>;
  return <form className="form cr-application" onSubmit={submit} aria-label={`Apply for ${title}`} aria-busy={state === 'sending'}>
    <input type="hidden" name="job" value={jobId} />
    <fieldset disabled={state === 'sending'}>
      <div className="form-grid">
        <div className="fld"><label htmlFor="apply-name">Full name</label><input id="apply-name" name="fullName" autoComplete="name" minLength={2} maxLength={120} required /></div>
        <div className="fld"><label htmlFor="apply-email">Email address</label><input id="apply-email" name="email" type="email" autoComplete="email" maxLength={254} required /></div>
        <div className="fld"><label htmlFor="apply-phone">Phone <span className="opt">(optional)</span></label><input id="apply-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} /></div>
        <div className="fld"><label htmlFor="apply-portfolio">Portfolio or LinkedIn <span className="opt">(optional)</span></label><input id="apply-portfolio" name="portfolioUrl" type="url" maxLength={500} placeholder="https://" /></div>
        <div className="fld wide"><label htmlFor="apply-cv">Your CV</label><input id="apply-cv" name="cv" type="file" accept="application/pdf,.pdf" aria-describedby="apply-cv-hint" required /><p className="hint" id="apply-cv-hint">PDF only, up to 5 MB. Include the experience you want us to know about.</p></div>
        <div className="fld wide"><label htmlFor="apply-note">Anything you’d like to add? <span className="opt">(optional)</span></label><textarea id="apply-note" name="coverNote" rows={4} maxLength={4000} /></div>
      </div>
      <div className="trap" aria-hidden="true"><label htmlFor="apply-company">Leave empty</label><input id="apply-company" name="companyWebsite" autoComplete="off" tabIndex={-1} /></div>
      <label className="cr-consent"><input name="privacyConsent" type="checkbox" required /><span>I agree that Partt may use my details and CV to review this application and contact me about this role, as described in the <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>.</span></label>
      <div className="form-end"><button type="submit" className="btn" disabled={state === 'sending'}>{state === 'sending' ? 'Submitting…' : 'Send application'} <i aria-hidden="true">→</i></button></div>
      <p className="cr-application-note">Your application is shared with Partt’s hiring team. Questions or updates? <a href="mailto:info@parttagency.com">info@parttagency.com</a></p>
    </fieldset>
    <div className={`form-status${state === 'error' ? ' is-failed' : ''}`} role="status" aria-live="polite" tabIndex={-1} ref={statusRef}>{message && <p>{message}</p>}</div>
  </form>;
}
