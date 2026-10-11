import type { CSSProperties } from 'react';
import { processIntro, processSteps } from '@/content/services';
import { Reveal } from '@/components/ui/Reveal';

/** The five-step process. The order is real, so the list is an ordered list. */
export function ProcessSteps() {
  return (
    <section className="proc" aria-labelledby="process-title">
      <Reveal>
        <h2 className="disp" id="process-title">
          {processIntro.title[0]}
          <br />
          {processIntro.title[1]}
        </h2>
        <p className="proc-lede">{processIntro.text}</p>
      </Reveal>
      <div className="proc-track" aria-hidden="true">
        <i />
      </div>
      <ol className="proc-steps">
        {processSteps.map((step, i) => (
          <li key={step.name} style={{ '--d': `${i * 2}s` } as CSSProperties}>
            <b className="disp">{step.name}</b>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
