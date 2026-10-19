import { hero } from '@/content/home';
import { MARK_PIECES } from '@/content/mark';
import { primaryCta } from '@/content/site';
import { Button } from '@/components/ui/Button';

/** Scene 1. The headline, the four drifting mark pieces, and the navy flood the page zooms into. */
export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="stick" data-nav="paper">
        <h1 className="hl disp">
          <span className="ln l1">
            <span className="in">{hero.lineOne}</span>
          </span>{' '}
          <span className="ln l2">
            <span className="in">
              <em>{hero.lineTwoAccent}</em>
              {hero.lineTwoRest}
            </span>
          </span>
        </h1>
        <div className="lede">
          <p>{hero.lede}</p>
          <Button href={primaryCta.href} magnetic>
            {primaryCta.label}
          </Button>
        </div>
        <svg className="pieces" aria-hidden="true" focusable="false">
          <g className="pg">
            {MARK_PIECES.map((p) => (
              <g className="pc" key={p.id}>
                <use href={`#${p.id}`} fill={p.color === 'red' ? 'var(--red)' : 'var(--ink)'} />
              </g>
            ))}
          </g>
        </svg>
        <p className="eq disp" aria-hidden="true">
          Partner in every <b>Part</b>
        </p>
        <div className="flood" />
      </div>
    </section>
  );
}
