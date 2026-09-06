/**
 * Custom cursor: a ring that trails the pointer with a little lag, plus a dot
 * that tracks it exactly. Over anything marked `data-cursor`, the ring swells
 * into a labelled amber disc.
 *
 * Runs only for fine pointers with motion enabled — it is decoration, and it
 * must never be the only thing telling someone an element is interactive.
 */
export function initCursor(): void {
  const fine = window.matchMedia('(pointer: fine)').matches;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || still) return;

  const ring = document.querySelector<HTMLElement>('.cursor');
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const label = ring?.querySelector<HTMLElement>('.cursor-label');
  if (!ring || !dot || !label) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let raf = 0;

  const loop = () => {
    // Critically-damped follow: fast enough to feel attached, slow enough
    // to read as a separate object.
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  };

  const onMove = (e: PointerEvent) => {
    targetX = e.clientX;
    targetY = e.clientY;
    ring.classList.remove('is-hidden');

    const hit = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
    if (hit) {
      ring.classList.add('is-link');
      label.textContent = hit.dataset.cursor || 'View';
    } else {
      ring.classList.remove('is-link');
    }
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', () => ring.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => ring.classList.remove('is-hidden'));

  // Pause the RAF loop whenever the tab is hidden.
  const start = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : start(),
  );
  start();
}
