/**
 * Shared motion constants for the React islands.
 *
 * The rules these encode:
 *   - animate transform/opacity/filter only, never layout properties;
 *   - reach for a spring before a duration, so gestures stay interruptible;
 *   - keep interaction feedback under 200ms and entrances under 600ms;
 *   - let `prefers-reduced-motion` remove motion, not functionality.
 *
 * One trap worth naming: never branch the animation *targets* on
 * `useReducedMotion()`. That hook returns false on the first render and the
 * real value after mount, so an element that starts at `opacity: 0` and whose
 * target becomes `{}` is stranded invisible. Keep initial/animate constant and
 * branch only the `transition` — reduced motion should mean "arrive instantly",
 * never "never arrive".
 */
import type { Transition } from 'motion/react';

/** Default spring: settles fast, overshoots just enough to feel physical. */
export const spring: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
  mass: 0.9,
};

/** Softer spring for larger travelling elements (nav pill, card fills). */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
  mass: 1,
};

/** Snappy spring for press feedback. */
export const springTight: Transition = {
  type: 'spring',
  stiffness: 620,
  damping: 30,
  mass: 0.6,
};

/** Tween for opacity-only crossfades, where a spring would look mushy. */
export const fade: Transition = { duration: 0.24, ease: [0.25, 1, 0.5, 1] };

/** Entrance used by grid items: rise, sharpen, arrive. */
export const enter = {
  initial: { opacity: 0, y: 18, filter: 'blur(6px)', scale: 0.98 },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)', scale: 0.97 },
};

/** Stagger helper — caps total delay so long lists never feel slow. */
export function stagger(index: number, step = 0.045, max = 0.36): number {
  return Math.min(index * step, max);
}

/** Motion props stripped down to nothing when the user opts out. */
export function reduced<T extends object>(on: boolean, props: T): T | object {
  return on ? {} : props;
}
