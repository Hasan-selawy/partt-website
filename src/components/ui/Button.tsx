'use client';

import Link from 'next/link';
import type { PointerEvent, ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  /** `inv` is the light button for dark grounds */
  variant?: 'solid' | 'inv';
  /** leans toward the cursor on devices with a mouse */
  magnetic?: boolean;
  className?: string;
};

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

/** The site's one button style: a pill with an arrow. */
export function Button({ href, children, variant = 'solid', magnetic = false, className = '' }: Props) {
  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!canHover() || document.documentElement.classList.contains('rm')) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
  };
  const leave = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = '';
  };
  return (
    <Link
      href={href}
      className={`btn${variant === 'inv' ? ' inv' : ''}${className ? ` ${className}` : ''}`}
      onPointerMove={magnetic ? move : undefined}
      onPointerLeave={magnetic ? leave : undefined}
    >
      {children} <i aria-hidden="true">→</i>
    </Link>
  );
}
