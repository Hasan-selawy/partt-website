'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { initHome } from '@/lib/motion/homeChoreography';
import { useMotion } from '@/components/layout/MotionProvider';

/**
 * Wraps the homepage sections and starts the scroll film once they are on the page.
 * The sections themselves stay plain markup: all the motion lives in lib/motion/homeChoreography.ts,
 * and it is torn down when the visitor leaves the page.
 */
export function HomeExperience({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    if (!enabled || !ref.current) return;
    return initHome(ref.current);
  }, [enabled]);

  return (
    <div ref={ref} className="hx">
      {children}
    </div>
  );
}
