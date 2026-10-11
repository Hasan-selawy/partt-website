import { WORDMARK_VIEWBOX } from '@/content/mark';

/** The partt wordmark. "par" takes --n1 (or the text colour) and "tt" takes --n2 (or brand red). */
export function Wordmark({ className, label = 'partt' }: { className?: string; label?: string | null }) {
  return (
    <svg className={className} viewBox={WORDMARK_VIEWBOX} role={label ? 'img' : undefined} aria-label={label ?? undefined} aria-hidden={label ? undefined : true}>
      <use href="#wm" />
    </svg>
  );
}
