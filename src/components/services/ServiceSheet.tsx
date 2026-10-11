import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Service } from '@/content/services';
import { MarkPiece } from '@/components/ui/MarkPiece';

/**
 * One service on its coloured sheet.
 * `stack` is the pinned homepage card; `index` sets how far below the earlier cards it stops; `page` is the full, static version on the Services page.
 */
export function ServiceSheet({ service, mode, index = 0 }: { service: Service; mode: 'stack' | 'page'; index?: number }) {
  const titleId = `${mode}-${service.slug}`;

  if (mode === 'stack') {
    return (
      <section className={`svc t-${service.theme}`} data-nav={service.theme} aria-labelledby={titleId} style={{ '--k': index } as CSSProperties}>
        <div className="pcw" aria-hidden="true">
          <MarkPiece index={service.piece} />
        </div>
        <div className="in">
          <div className="top">
            <div className="no disp" aria-hidden="true">
              {service.number}
            </div>
            <h2 className="disp" id={titleId}>
              <span className="n1">{service.lines[0]}</span> <span className="n2">{service.lines[1]}</span>
            </h2>
          </div>
          <div className="bot">
            <div className="sum">
              <p>{service.summary}</p>
              <Link className="tlink" href={`/services#${service.slug}`}>
                More on this service <i aria-hidden="true">→</i>
              </Link>
            </div>
            <ul>
              {service.items.map((item, i) => (
                <li key={item} style={{ '--i': i } as CSSProperties}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`svp t-${service.theme}`} id={service.slug} data-nav={service.theme} aria-labelledby={titleId}>
      <div className="svp-piece" aria-hidden="true">
        <MarkPiece index={service.piece} />
      </div>
      <div className="svp-head">
        <span className="no disp" aria-hidden="true">
          {service.number}
        </span>
        <h2 className="disp" id={titleId}>
          {service.lines[0]}
          <br />
          {service.lines[1]}
        </h2>
      </div>
      <div className="svp-body">
        <p className="svp-sum">{service.summary}</p>
        <ul>
          {service.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
