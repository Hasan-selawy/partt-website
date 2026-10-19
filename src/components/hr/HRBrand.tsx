import { MARK_PIECES, WORDMARK_PATHS, WORDMARK_VIEWBOX } from '@/content/mark';
import Link from 'next/link';

export function HRBrand() {
  return <div className="hr-brand"><svg viewBox={WORDMARK_VIEWBOX} role="img" aria-label="partt">{WORDMARK_PATHS.map((part, i) => <path key={i} d={part.d} fill={part.part === 'par' ? 'currentColor' : '#E7292B'} />)}</svg><small>People & possibilities</small></div>;
}
export function HRIcon() { return <svg className="hr-icon" viewBox="-0.56 -0.56 1.12 1.12" role="img" aria-label="partt HR">{MARK_PIECES.map(piece => <path key={piece.id} d={piece.d} fill={piece.color === 'navy' ? 'currentColor' : '#E7292B'} />)}</svg>; }
export function HRLoginNote() {
  return <div className="hr-login-note"><h1>Welcome, team.</h1><p>Sign in to manage openings and applications.</p><p>Password help: ask your Partt administrator.</p></div>;
}
export function HRPasswordHelp() {
  return <div className="hr-login-note"><HRBrand /><h1>Password help</h1><p>Contact your Partt administrator to reset your password. Password reset emails are not enabled.</p><Link href="/hr/login">Back to sign in</Link></div>;
}
