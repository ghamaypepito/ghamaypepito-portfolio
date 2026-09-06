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

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        // Elements sharing a `data-reveal-group` rise as a staggered run.
        const group = el.dataset.revealGroup;
        if (group) {
          const peers = [
            ...document.querySelectorAll<HTMLElement>(
              `[data-reveal-group="${group}"]`,
            ),
          ];
          const i = peers.indexOf(el);
          el.style.setProperty('--reveal-delay', `${Math.min(i * 60, 360)}ms`);
        }
        el.classList.add('is-in');
        io.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((el) => io.observe(el));
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
