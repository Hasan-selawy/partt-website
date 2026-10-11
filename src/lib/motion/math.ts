export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** ease in-out cubic */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** ease out cubic */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** ease out with a small overshoot */
export const easeOutBack = (t: number) => {
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/** Distance from the top of the document, ignoring transforms set by the scroll scenes. */
export const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
