import { MARK_PIECES, WORDMARK_PATHS, WORDMARK_VIEWBOX } from '@/content/mark';

/** The mark pieces and wordmark, defined once per page and reused everywhere with <use>. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {MARK_PIECES.map((p) => (
          <path key={p.id} id={p.id} d={p.d} />
        ))}
        <symbol id="wm" viewBox={WORDMARK_VIEWBOX}>
          {WORDMARK_PATHS.map((w, i) => (
            <path key={i} className={w.part === 'par' ? 'wp' : 'wt'} d={w.d} />
          ))}
        </symbol>
      </defs>
    </svg>
  );
}
