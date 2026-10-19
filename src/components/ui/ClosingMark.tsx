'use client';

import { useEffect, useRef } from 'react';
import { MARK_PIECES } from '@/content/mark';
import { clamp, easeOut } from '@/lib/motion/math';
import { subscribe } from '@/lib/motion/ticker';
import { useMotion } from '@/components/layout/MotionProvider';

const START_ANGLES = [140, -110, 120, -150];

/** The four pieces fly in and lock together as this mark scrolls into view. Used beside headings. */
export function ClosingMark({ className, light = true }: { className?: string; light?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !enabled) return;
    const group = svg.querySelector<SVGGElement>('.cmg');
    const parts = Array.from(svg.querySelectorAll<SVGGElement>('.cmg > g'));
    if (!group) return;
    let rect: DOMRect | null = null;
    let drawn = NaN;
    return subscribe({
      // read before any scene writes, so measuring never forces the browser to recalculate styles mid-frame
      read: () => {
        rect = svg.getBoundingClientRect();
      },
      frame: ({ H }) => {
        // redraw only when the mark has moved, so a still page repaints nothing
        if (!rect || rect.top === drawn) return;
        if (rect.top > H * 1.4 || rect.bottom < -H * 0.4) return;
        drawn = rect.top;
        // 0 while the mark is still below the screen, 1 once it has risen a third of the way up
        const q = easeOut(clamp((H * 1.05 - rect.top) / (H * 0.75)));
        parts.forEach((g, i) => {
          const c = MARK_PIECES[i].center;
          const d = (1 - q) * 1.5;
          g.setAttribute('transform', `translate(${(c[0] * d).toFixed(4)} ${(c[1] * d).toFixed(4)}) rotate(${((1 - q) * START_ANGLES[i]).toFixed(2)} ${c[0]} ${c[1]})`);
        });
        group.setAttribute('transform', `rotate(${((1 - q) * -90 + (H - rect.top) * 0.02).toFixed(2)})`);
      },
    });
  }, [enabled]);

  return (
    <svg ref={ref} className={className} viewBox="-.55 -.55 1.1 1.1" aria-hidden="true" focusable="false">
      <g className="cmg">
        {MARK_PIECES.map((p) => (
          <g key={p.id}>
            <use href={`#${p.id}`} fill={p.color === 'red' ? 'var(--red)' : light ? 'var(--paper)' : 'var(--ink)'} />
          </g>
        ))}
      </g>
    </svg>
  );
}
