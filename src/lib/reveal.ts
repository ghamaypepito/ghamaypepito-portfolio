/**
 * Progressive enhancement layer that runs once on the static page.
 *
 * Handles three things that do not warrant a React island:
 *   1. scroll reveals for every `[data-reveal]` element,
 *   2. the amber fill on the experience timeline,
 *   3. the reading-progress bar.
 *
 * All three are no-ops under `prefers-reduced-motion`.
 */

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const show = (el: HTMLElement, stagger: boolean) => {
    if (el.classList.contains('is-in')) return;
    // Elements sharing a `data-reveal-group` rise as a staggered run — but
    // only when they arrive normally. Anything caught by the safety sweep
    // below has already been scrolled past and should just appear.
    const group = el.dataset.revealGroup;
    if (stagger && group) {
      const peers = [
        ...document.querySelectorAll<HTMLElement>(`[data-reveal-group="${group}"]`),
      ];
      const i = peers.indexOf(el);
      el.style.setProperty('--reveal-delay', `${Math.min(i * 60, 360)}ms`);
    }
    el.classList.add('is-in');
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        show(el, true);
        io.unobserve(el);
      }
    },
    // A zero threshold means a single visible pixel is enough. Requiring a
    // percentage of the element loses tall elements on a fast scroll.
    { threshold: 0, rootMargin: '0px 0px -6% 0px' },
  );

  targets.forEach((el) => io.observe(el));

  /**
   * Safety net. IntersectionObserver samples frames, so a hard flick-scroll —
   * or a slow machine — can carry an element past the viewport without a
   * callback ever firing, stranding it invisible.
   *
   * The threshold matters. The observer fires as an element's top crosses the
   * bottom of the viewport, so sweeping anything already a third of the way up
   * the screen only ever catches elements the observer genuinely missed. Sweep
   * on first contact instead and it wins every race, and the staggered
   * entrance never runs at all.
   */
  const SWEEP_LINE = 0.35;
  let queued = false;
  const sweep = () => {
    queued = false;
    let remaining = 0;
    for (const el of targets) {
      if (el.classList.contains('is-in')) continue;
      remaining += 1;
      if (el.getBoundingClientRect().top < window.innerHeight * SWEEP_LINE) {
        show(el, false);
        io.unobserve(el);
      }
    }
    if (remaining === 0) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sweep);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // Catch anything already on screen at load, including after a hash jump.
  requestAnimationFrame(sweep);
}

function initTimelineProgress(): void {
  const list = document.querySelector<HTMLElement>('.timeline');
  if (!list || reduceMotion()) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = list.getBoundingClientRect();
    const start = window.innerHeight * 0.75;
    const travelled = start - rect.top;
    const pct = Math.max(0, Math.min(1, travelled / rect.height));
    list.style.setProperty('--progress', `${pct * 100}%`);
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function initProgressBar(): void {
  const bar = document.querySelector<HTMLElement>('.progress');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${pct})`;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

export function initEnhancements(): void {
  initReveals();
  initTimelineProgress();
  initProgressBar();
}
