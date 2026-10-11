import { Fragment, type ReactNode } from 'react';
import { services } from '@/content/services';
import { ServiceSheet } from '@/components/services/ServiceSheet';
import { StackFit } from './StackFit';

/**
 * Scene 5. Four cards, contained in the page, that slide up over each other, then whatever is passed as children (the closing
 * sheet) slides over the last one. The empty markers and gaps give the scroll film its measuring points.
 */
export function ServicesStack({ children }: { children: ReactNode }) {
  return (
    <div className="stack" id="services">
      {services.map((service, i) => (
        <Fragment key={service.slug}>
          <i className="mk" aria-hidden="true" />
          <ServiceSheet service={service} mode="stack" index={i} />
          <div className="gap" aria-hidden="true" />
        </Fragment>
      ))}
      <i className="mk" aria-hidden="true" />
      {children}
      <StackFit />
    </div>
  );
}
