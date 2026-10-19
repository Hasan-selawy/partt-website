/**
 * One animation loop for the whole site.
 *
 * Scenes subscribe with a `measure` function (read layout, runs on load and on real size changes), an optional
 * `read` function (read layout every frame, before any scene writes, so the browser never has to recalculate
 * styles mid-frame) and a `frame` function (write transforms, runs every animation frame). The loop starts with
 * the first subscriber and stops with the last, so navigating away from a page leaves nothing running.
 *
 * `sy` is the scroll position eased toward the real one, which is what gives pinned scenes their weight under a
 * mouse wheel. A finger already scrolls smoothly, so on touch `sy` follows the page exactly: anything eased on
 * top of that trails the finger and keeps drifting after it stops.
 */

import { lerp } from './math';

export type Frame = {
  /** real scroll position */
  y: number;
  /** eased scroll position: animate with this one */
  sy: number;
  /** eased scroll speed in px per frame */
  vel: number;
  /** ms since the previous frame, capped */
  dt: number;
  /** seconds since the loop started */
  t: number;
  /** viewport width and height. Height is the small-viewport height, so it does not change when a phone's address bar hides. */
  W: number;
  H: number;
};

export type Scene = {
  measure?: (f: Frame) => void;
  read?: (f: Frame) => void;
  frame?: (f: Frame) => void;
};

/** Small layout, matching the CSS breakpoint. */
export const SMALL_QUERY = '(max-width:820px)';

const scenes = new Set<Scene>();
const f: Frame = { y: 0, sy: 0, vel: 0, dt: 16.7, t: 0, W: 0, H: 0 };

let raf = 0;
let resizeRaf = 0;
let last = 0;
let start = 0;
let lastY = 0;
let probe: HTMLDivElement | null = null;
let listening = false;
/** whether the last scroll came from a wheel (eased) or a finger (followed exactly) */
let eased = true;
const onTouch = () => {
  eased = false;
};
const onWheel = () => {
  eased = true;
};

const viewportHeight = () => {
  if (!probe) {
    probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
    document.body.appendChild(probe);
  }
  return probe.offsetHeight || window.innerHeight;
};

const readViewport = () => {
  f.W = document.documentElement.clientWidth;
  f.H = viewportHeight();
};

const measureAll = () => {
  readViewport();
  scenes.forEach((s) => s.measure?.(f));
};

/** Re-read layout. Call after content that changes page height has loaded. */
export const remeasure = () => {
  if (scenes.size) measureAll();
};

const onResize = () => {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    // a phone hiding its address bar changes neither of these, so the page does not jump mid-scroll
    if (document.documentElement.clientWidth !== f.W || viewportHeight() !== f.H) measureAll();
  });
};

const tick = (now: number) => {
  const dt = Math.min(50, now - last || 16.7);
  last = now;
  const y = window.scrollY;
  f.dt = dt;
  f.t = (now - start) / 1000;
  f.y = y;
  f.sy = eased ? f.sy + (y - f.sy) * (1 - Math.pow(0.86, dt / 16.7)) : y;
  if (Math.abs(y - f.sy) < 0.05) f.sy = y;
  f.vel = lerp(f.vel, ((y - lastY) / dt) * 16.7, 0.18);
  lastY = y;
  scenes.forEach((s) => s.read?.(f));
  scenes.forEach((s) => s.frame?.(f));
  // a scene may unsubscribe itself during the frame; once none are left the loop stops here
  raf = scenes.size ? requestAnimationFrame(tick) : 0;
};

export function subscribe(scene: Scene): () => void {
  if (!scenes.size) {
    readViewport();
    start = last = performance.now();
    f.y = f.sy = lastY = window.scrollY;
    f.vel = 0;
    raf = requestAnimationFrame(tick);
    if (!listening) {
      eased = !window.matchMedia('(pointer: coarse)').matches;
      window.addEventListener('touchstart', onTouch, { passive: true });
      window.addEventListener('wheel', onWheel, { passive: true });
      window.addEventListener('resize', onResize);
      window.addEventListener('orientationchange', onResize);
      window.addEventListener('load', remeasure);
      document.fonts?.ready.then(remeasure).catch(() => {});
      listening = true;
    }
  }
  scenes.add(scene);
  scene.measure?.(f);

  return () => {
    scenes.delete(scene);
    if (!scenes.size) {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('load', remeasure);
      listening = false;
    }
  };
}
