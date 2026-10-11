import type { ReactNode } from 'react';
import { site } from '@/content/site';

/**
 * Marks a spot that is waiting for real content from partt. Nothing is invented to fill it.
 * Hidden everywhere once `showPlaceholders` in content/site.ts is set to false.
 */
export function Placeholder({ title, children }: { title: string; children?: ReactNode }) {
  if (!site.showPlaceholders) return null;
  return (
    <div className="needs" role="note">
      <p className="needs-k">Content needed</p>
      <p className="needs-t">{title}</p>
      {children ? <p className="needs-d">{children}</p> : null}
    </div>
  );
}
