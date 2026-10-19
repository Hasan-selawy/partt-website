/**
 * The homepage scroll film.
 *
 * One function wires every scene on the homepage to the shared animation loop and returns a cleanup
 * function. Pinning is done by CSS (`position: sticky`); this file only turns scroll progress into
 * transforms. Scenes, in order:
 *
 *   1. hero        the four mark pieces drift, lock together, and the page zooms through the mark
 *   2. services    four contained cards slide over each other
 *
 * The statement, the logo rows (a CSS loop) and Selected Work need nothing from here.
 */

import { MARK_FOCAL, MARK_PIECES } from '@/content/mark';
import { clamp, docTop, easeInOut, easeOut, easeOutBack, lerp } from './math';
import { SMALL_QUERY, subscribe, type Frame } from './ticker';

const C = MARK_PIECES.map((p) => p.center);
const F = MARK_FOCAL;

/**
 * Where each mark piece drifts before the mark assembles: x, y as viewport fractions, size as a fraction
 * of the short side, angle. Tuned on a 1440 x 900 screen (desktop) and a 390 x 844 phone (small);
 * `placePieces` below adapts them to every other screen so no piece lands on the headline.
 */
const SCATTER = {
  desktop: [
    [0.2, 0.565, 0.5, 24],
    [0.5, 0.87, 0.3, -28],
    [0.84, 0.85, 0.62, 38],
    [0.79, 0.25, 0.6, -18],
  ],
  small: [
    [0.14, 0.52, 0.4, 24],
    [0.3, 0.68, 0.26, -28],
    [0.82, 0.66, 0.46, 38],
    [0.66, 0.44, 0.62, -18],
  ],
};

/** How far a drifting piece reaches from its centre, as a fraction of its size (measured, with a little slack). */
const REACH = { left: 0.31, right: 0.34, up: 0.34, down: 0.33 };
const PHONE = { headlineBottom: 0.301, ratio: 844 / 390, lowest: 0.944 };

type HeroBox = {
  W: number; H: number;
  /** side padding of the page */
  pad: number;
  /** headline top and bottom, and its font size, in px */
  top: number; bottom: number; fs: number;
  /** right end of the text in line one, left end of the text in line two */
  lineOneRight: number; lineTwoLeft: number;
  /** top of the introduction under the headline */
  ledeTop: number;
};

/** Piece positions for this screen, in px: [centre x, centre y, size, angle]. */
function placePieces(stacked: boolean, b: HeroBox): number[][] {
  if (stacked) {
    // the pieces live between the headline and the introduction: shrink the group to fit on short screens
    const S = Math.min(b.W, b.H);
    const f = clamp((b.ledeTop - b.bottom) / (PHONE.lowest * S), 0.45, 1);
    return SCATTER.small.map((p) => [p[0] * b.W, b.bottom + (p[1] - PHONE.headlineBottom) * PHONE.ratio * S * f, p[2] * S * f, p[3]]);
  }
  // when the headline is limited by width rather than height, the pieces scale with it
  const S = Math.min(b.H, b.W * 0.667);
  const out = SCATTER.desktop.map((p) => [p[0] * b.W, p[1] * b.H, p[2] * S, p[3]]);

  // piece 0 sits in the indent before line two: under line one, above the introduction, left of the text
  const left = out[0];
  if (left[1] - REACH.up * left[2] < b.bottom) {
    const ceiling = b.top + 0.86 * b.fs;
    const floor = b.ledeTop - 0.02 * b.H;
    const room = b.lineTwoLeft - b.pad * 0.4;
    const fit = Math.min((floor - ceiling) / (REACH.up + REACH.down), room / (REACH.left + REACH.right));
    left[2] = clamp(fit, 0.14 * S, left[2]);
    left[1] = Math.max(ceiling + REACH.up * left[2], Math.min(left[1], floor - REACH.down * left[2]));
    left[0] = Math.min(left[0], b.lineTwoLeft - REACH.right * left[2]);
  }
  // pieces 1 and 2 sit under the headline: on short screens they slide down, off the bottom edge if need be
  out[1][1] = Math.max(out[1][1], b.bottom + 0.01 * S + 0.3 * out[1][2]);
  out[2][1] = Math.max(out[2][1], b.bottom - 0.035 * S + 0.31 * out[2][2]);
  // piece 3 sits right of line one and above line two
  const top = out[3];
  top[1] = Math.min(top[1], b.top + 0.97 * b.fs - REACH.down * top[2] + 0.024 * top[2]);
  top[0] = Math.max(top[0], b.lineOneRight + 0.02 * b.W + REACH.left * top[2]);
  return out;
}

type Sheet = HTMLElement & { _e?: number; _c?: number; _r?: string };

export function initHome(root: HTMLElement): () => void {
  const one = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s) as T;
  const all = <T extends Element = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s));

  const small = window.matchMedia(SMALL_QUERY);

  const el = {
    hero: one('#hero'),
    heroStick: one('#hero .stick'),
    headline: one('.hl'),
    l1: one('.hl .l1'),
    l2: one('.hl .l2'),
    l1Text: one('.hl .l1 .in'),
    l2Text: one('.hl .l2 .in'),
    lede: one('.lede'),
    ledeText: one('.lede p'),
    svg: one<SVGSVGElement>('.pieces'),
    group: one<SVGGElement>('.pieces .pg'),
    pieces: all<SVGGElement>('.pieces .pc'),
    equation: one('.eq'),
    flood: one('.flood'),
    markers: all('.mk'),
    sheets: all<Sheet>('.svc'),
    gap: one('.gap'),
  };

  let isSmall = false;
  let scatter: number[][] = [];
  /** stickH: height of the pinned hero frame. On phones it is the full screen with the browser bar hidden, a little
   *  taller than the H the other scenes use, so the navy flood reaches the bottom edge once the bar slides away */
  const M = { exitLeft: 0, exitRight: 0, heroH: 0, stickH: 0, marks: [] as number[], gap: 0 };
  let heroNav = '';

  /* pointer: the hero pieces lean toward a mouse cursor. A finger only touches down to scroll, so it is ignored */
  let mx = 0, my = 0, pmx = 0, pmy = 0;
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const readyTimer = window.setTimeout(() => el.headline.classList.add('ready'), 1500);

  const measure = ({ W, H: screenH }: Frame) => {
    isSmall = small.matches;
    // the hero is laid out in its own frame (see M.stickH)
    const H = (M.stickH = el.heroStick.offsetHeight || screenH);
    el.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    // where the headline text really is on this screen, ignoring the transforms the scroll puts on it
    const hl = el.headline.getBoundingClientRect();
    const textEdges = (line: HTMLElement) => {
      const range = document.createRange();
      range.selectNodeContents(line);
      const text = range.getBoundingClientRect();
      const box = line.getBoundingClientRect();
      return { left: hl.left + (text.left - box.left), right: hl.left + (text.right - box.left) };
    };
    const bottom = el.headline.offsetTop + el.headline.offsetHeight;
    const lineOneRight = textEdges(el.l1Text).right;
    const lineTwoLeft = textEdges(el.l2Text).left;
    // how far each headline line travels as the mark assembles: always far enough to leave the screen
    M.exitLeft = Math.max(W * 0.8, lineOneRight + W * 0.02);
    M.exitRight = Math.max(W * 0.8, W - lineTwoLeft + W * 0.02);
    // a phone on its side is small but wide: it takes the desktop arrangement
    const stacked = isSmall && W <= H * 1.2;
    // on short, wide screens the introduction sits beside line two instead of under it: keep it out of the letters
    el.ledeText.style.maxWidth = '';
    if (!stacked && el.lede.offsetTop < bottom) el.ledeText.style.maxWidth = `${Math.max(200, lineTwoLeft - hl.left - 0.02 * W)}px`;
    scatter = placePieces(stacked, {
      W, H,
      pad: hl.left,
      top: el.headline.offsetTop,
      bottom,
      fs: parseFloat(getComputedStyle(el.headline).fontSize) || 100,
      lineOneRight,
      lineTwoLeft,
      ledeTop: el.lede.offsetTop,
    });

    M.heroH = el.hero.offsetHeight;
    M.marks = el.markers.map(docTop);
    M.gap = el.gap.offsetHeight;
  };

  const frame = ({ y, sy, t, W, H: screenH }: Frame) => {
    pmx = lerp(pmx, mx, 0.06);
    pmy = lerp(pmy, my, 0.06);

    /* ---- 1. hero, in its own frame ---- */
    const H = M.stickH || screenH;
    const S = Math.min(W, H);
    const S0 = S * (isSmall ? 0.5 : 0.44);
    const span = Math.max(1, M.heroH - H);
    const hp = clamp(sy / span);
    const hpReal = clamp(y / span);
    if (hp < 1 || hpReal < 1) {
      const a = easeInOut(clamp(hp / 0.4));
      const hold = clamp((hp - 0.4) / 0.16);
      const z = clamp((hp - 0.56) / 0.4);
      el.l1.style.transform = `translate3d(${-a * M.exitLeft}px,0,0)`;
      el.l2.style.transform = `translate3d(${a * M.exitRight}px,0,0)`;
      el.lede.style.transform = `translate3d(0,${a * 40}px,0)`;
      el.lede.style.opacity = String(1 - a * 2.4);
      el.lede.style.pointerEvents = a > 0.3 ? 'none' : '';

      const pulse = 1 + 0.07 * Math.sin(Math.PI * clamp((hp - 0.34) / 0.12));
      const size = S0 * pulse;
      el.pieces.forEach((g, i) => {
        const ai = easeInOut(clamp((hp - i * 0.025) / 0.36));
        const s = scatter[i];
        const intro = easeOutBack(clamp((t - 0.35 - i * 0.13) / 0.9));
        const fx = Math.sin(t * 0.5 + i * 1.7) * S * 0.014 + pmx * S * 0.02 * (i + 1);
        const fy = Math.cos(t * 0.42 + i * 2.3) * S * 0.016 + pmy * S * 0.02 * (i + 1);
        const px = lerp(s[0] - W / 2 + fx, size * C[i][0], ai);
        const py = lerp(s[1] - H / 2 + fy, size * C[i][1], ai);
        const rot = lerp(s[3] + Math.sin(t * 0.35 + i) * 5, 0, ai);
        const k = lerp(s[2], size, ai) * Math.max(0.0001, intro);
        g.setAttribute('transform', `translate(${px.toFixed(2)} ${py.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${k.toFixed(3)}) translate(${-C[i][0]} ${-C[i][1]})`);
      });

      const zoomMax = (1.25 * Math.hypot(W, H)) / 2 / (F[2] * S0);
      const Z = Math.pow(zoomMax, Math.pow(z, 1.6));
      const kf = easeInOut(clamp(z / 0.3));
      const turn = 90 * easeInOut(hold) + 35 * z;
      el.group.setAttribute('transform', `translate(${W / 2} ${H / 2}) rotate(${turn.toFixed(2)}) scale(${Z.toFixed(4)}) translate(${(-F[0] * kf * S0).toFixed(2)} ${(-F[1] * kf * S0).toFixed(2)})`);
      el.equation.style.opacity = String(clamp((hp - 0.37) / 0.06) * (1 - clamp((hp - 0.55) / 0.05)));
      el.flood.style.opacity = String(Math.max(clamp((z - 0.8) / 0.16), clamp((hpReal - 0.9) / 0.08)));
    }
    // the nav reads this to pick its colours
    const hn = hpReal > 0.9 ? 'ink' : 'paper';
    if (hn !== heroNav) el.heroStick.dataset.nav = heroNav = hn;

    /* ---- 2. services cards. How far each card has risen, 0 to 1 ---- */
    const e = M.marks.map((m) => clamp((sy - (m - screenH)) / screenH));
    el.sheets.forEach((s, k) => {
      const ek = e[k] ?? 0;
      const ck = e[k + 1] ?? 0;
      if (ek <= 0 && s._e === 0) return;
      const hk = clamp((sy - M.marks[k]) / (M.gap + screenH));
      if (s._e !== ek) {
        s.style.setProperty('--e', easeOut(ek).toFixed(4));
        s._e = ek;
      }
      if (s._c !== ck) {
        s.style.setProperty('--c', ck.toFixed(4));
        s._c = ck;
      }
      const r = ((1 - easeOut(ek)) * -40 + hk * 30).toFixed(1);
      if (s._r !== r) {
        s.style.setProperty('--r', r);
        s._r = r;
      }
    });
  };

  const unsubscribe = subscribe({ measure, frame });

  return () => {
    unsubscribe();
    window.clearTimeout(readyTimer);
    window.removeEventListener('pointermove', onPointer);
    el.ledeText.style.maxWidth = '';
  };
}
