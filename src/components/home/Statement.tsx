import { Fragment } from 'react';
import Link from 'next/link';
import { ClosingMark } from '@/components/ui/ClosingMark';
import { statement } from '@/content/home';

/** Words starting with "part" take the accent, so the name's idea runs through the copy. */
function Accented({ text }: { text: string }) {
  return text.split(/\s+/).map((word, i) => (
    <Fragment key={i}>
      {/^part/i.test(word) ? <span className="hot">{word}</span> : word}{' '}
    </Fragment>
  ));
}

/**
 * Scene 2. Who partt is, as a static editorial spread: the main statement large, the supporting sentence
 * compact and set apart, and the mark whose four pieces lock together as the section comes into view.
 */
export function Statement() {
  return (
    <section className="say" id="say" aria-labelledby="say-title">
      <h2 className="say-main" id="say-title">
        <Accented text={statement.main} />
      </h2>
      <ClosingMark className="say-mark" />
      <div className="say-sub">
        <p className="say-lead">
          <Accented text={statement.lead} />
        </p>
        <div className="say-rest">
          <p>{statement.rest}</p>
          <Link className="tlink" href="/about">
            About partt <i aria-hidden="true">→</i>
          </Link>
        </div>
      </div>
    </section>
  );
}
