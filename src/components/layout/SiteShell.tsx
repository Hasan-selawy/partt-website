import type { ReactNode } from 'react';
import { MotionProvider } from './MotionProvider';
import { Nav } from './Nav';
import { SvgDefs } from '@/components/ui/SvgDefs';

/** Everything that wraps every page: skip link, shared vector defs, motion setting and the nav. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SvgDefs />
      <Nav />
      {children}
    </MotionProvider>
  );
}
