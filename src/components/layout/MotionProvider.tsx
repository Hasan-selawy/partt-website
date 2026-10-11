'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { MOTION_STORAGE_KEY } from '@/lib/motion/boot';

type Motion = {
  /** false when the visitor's device asks for reduced motion and they have not opted in */
  enabled: boolean;
  enable: () => void;
};

const MotionContext = createContext<Motion>({ enabled: true, enable: () => {} });

export const useMotion = () => useContext(MotionContext);

const staticMode = () => typeof document !== 'undefined' && document.documentElement.classList.contains('rm');

export function MotionProvider({ children }: { children: ReactNode }) {
  // read synchronously on the client so scroll scenes never start and then stop
  const [enabled, setEnabled] = useState(() => !staticMode());
  const [showBar, setShowBar] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowBar(staticMode());
  }, []);

  // the bar is fixed to the bottom of the screen: pinned sections read its height (--rmbar) so nothing hides behind it
  useEffect(() => {
    const bar = barRef.current;
    if (!showBar || !bar) return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => root.style.setProperty('--rmbar', `${bar.offsetHeight}px`));
    ro.observe(bar);
    return () => {
      ro.disconnect();
      root.style.removeProperty('--rmbar');
    };
  }, [showBar]);

  const enable = useCallback(() => {
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, 'on');
    } catch {
      /* private mode: the choice simply lasts for this visit */
    }
    document.documentElement.classList.remove('rm');
    window.scrollTo(0, 0);
    setShowBar(false);
    setEnabled(true);
  }, []);

  const value = useMemo(() => ({ enabled, enable }), [enabled, enable]);

  return (
    <MotionContext.Provider value={value}>
      {children}
      {showBar && (
        <div ref={barRef} className="rmbar" role="region" aria-label="Motion settings">
          <span>Motion is off because this device is set to reduce motion.</span>
          <button type="button" onClick={enable}>
            Turn motion on
          </button>
        </div>
      )}
    </MotionContext.Provider>
  );
}
