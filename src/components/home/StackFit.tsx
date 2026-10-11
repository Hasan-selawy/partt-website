'use client';

import { useEffect } from 'react';

/**
 * Gives every services card its own height as --h, so a card taller than the screen pins by its bottom edge
 * instead of hiding its end under the next card (see .svc in styles/home.css). Runs with motion on or off.
 */
export function StackFit() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('#services .svc'));
    const ro = new ResizeObserver((entries) => {
      entries.forEach((e) => (e.target as HTMLElement).style.setProperty('--h', `${(e.target as HTMLElement).offsetHeight}px`));
    });
    cards.forEach((card) => ro.observe(card));
    return () => ro.disconnect();
  }, []);
  return null;
}
