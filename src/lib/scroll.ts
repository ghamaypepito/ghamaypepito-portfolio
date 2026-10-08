/** Smooth-scrolls to a section id, honouring the reduced-motion preference. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  // Move focus so keyboard and screen-reader users land where the page did.
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
