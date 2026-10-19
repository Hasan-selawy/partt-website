'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mainNav, primaryCta } from '@/content/site';
import { Wordmark } from '@/components/ui/Wordmark';
import { subscribe } from '@/lib/motion/ticker';

/**
 * Colours the nav takes over each ground: [text and "par", the "tt" accent, text on the button].
 * Any section can declare its ground with `data-nav="ink"` and so on; plain sections count as paper.
 */
const THEMES: Record<string, [string, string, string]> = {
  paper: ['var(--ink)', 'var(--red)', 'var(--paper)'],
  ink: ['var(--paper)', 'var(--red)', 'var(--ink)'],
  deep: ['var(--paper)', 'var(--red)', 'var(--deep)'],
  red: ['var(--paper)', 'var(--deep)', 'var(--red)'],
  orange: ['var(--deep)', 'var(--paper)', 'var(--orange)'],
};

/** Within this distance of the top of a page the nav sits open on the page itself, with no bar behind it. */
const NAV_FREE = 80;

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function Nav() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // close the menu whenever the page changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // follow the colour of whatever sits under the nav, step aside while scrolling down, come back on the way up
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let unsubscribe: (() => void) | null = null;
    let until = 0;
    let theme = '';
    let ground = '';
    let lastY = window.scrollY;

    const groundOf = (node: HTMLElement | null) => {
      for (let el = node; el; el = el.parentElement) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'transparent' && !/,\s*0\)$/.test(bg)) return bg;
      }
      return '';
    };

    const apply = () => {
      let next = 'paper';
      let host: HTMLElement | null = null;
      for (const node of document.elementsFromPoint(window.innerWidth / 2, nav.offsetHeight / 2)) {
        if (nav.contains(node)) continue;
        host = (node as HTMLElement).closest<HTMLElement>('[data-nav]');
        if (host) {
          next = host.dataset.nav || 'paper';
          break;
        }
      }
      if (next !== theme) {
        theme = next;
        const [n1, n2, n3] = THEMES[theme] ?? THEMES.paper;
        nav.style.setProperty('--n1', n1);
        nav.style.setProperty('--n2', n2);
        nav.style.setProperty('--n3', n3);
      }
      // the bar behind the nav takes the real colour of the ground, which some scenes animate
      const bg = groundOf(host) || 'var(--paper)';
      if (bg !== ground) {
        ground = bg;
        nav.style.setProperty('--n0', bg);
      }
    };
    // keep checking for a moment after the last scroll, because pinned scenes ease to a stop. The check runs in the
    // shared loop's read step, before the scroll scenes write, so it never makes the browser recalculate styles mid-frame
    const check = {
      read: () => {
        apply();
        if (performance.now() > until) stop();
      },
    };
    const stop = () => {
      unsubscribe?.();
      unsubscribe = null;
    };
    const kick = () => {
      until = performance.now() + 1200;
      if (!unsubscribe) unsubscribe = subscribe(check);
    };
    const onScroll = () => {
      const y = window.scrollY;
      const top = y < NAV_FREE;
      if (top || open) nav.classList.remove('away');
      else if (y > lastY + 6) nav.classList.add('away');
      else if (y < lastY - 6) nav.classList.remove('away');
      nav.classList.toggle('solid', !top && !open);
      if (Math.abs(y - lastY) > 6) lastY = y;
      kick();
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      stop();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', kick);
    };
  }, [pathname, open]);

  // menu: lock the page behind it, close on Escape, move focus in and back out
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className="nav" ref={navRef}>
        <Link className="brand" href="/" aria-label="partt home">
          <Wordmark label={null} />
        </Link>
        <nav className="links" aria-label="Main">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nx">
          <Link className="cta" href={primaryCta.href}>
            {primaryCta.label}
          </Link>
          <button ref={buttonRef} className="mn" type="button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <div id="site-menu" ref={menuRef} className={`menu${open ? ' open' : ''}`} data-nav="ink" inert={!open}>
        <nav aria-label="Menu">
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined} onClick={() => setOpen(false)}>
            Home
          </Link>
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
