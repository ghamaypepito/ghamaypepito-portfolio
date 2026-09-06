import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SECTIONS, scrollToSection, type SectionId } from '@/lib/scroll';
import { spring, springSoft } from '@/lib/motion';
import { BRAND_MARK } from '@/lib/icons';
import CommandPalette from './CommandPalette';

/**
 * The pill nav that arrives once the hero is behind you. The highlight behind
 * the active link is a single shared element that travels between targets,
 * rather than a background that fades in and out per link.
 */
export default function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<SectionId>('work');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const still = useReducedMotion();

  // Show the nav once the hero has mostly scrolled away.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll spy. The tall rootMargin means a section counts as "active" only
  // once it occupies the middle band of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // Cmd/Ctrl-K anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            className="floatnav"
            aria-label="Section navigation"
            initial={still ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.94, x: '-50%' }}
            animate={still ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={still ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.96, x: '-50%' }}
            transition={springSoft}
            style={{ x: '-50%' }}
          >
            <a
              href="#top"
              className="fn-brand"
              onClick={(e) => go(e, 'top')}
              aria-label="Back to top"
              style={{ color: 'var(--accent)' }}
            >
              <svg width="22" height="22" viewBox="0 0 34 34" fill="none" aria-hidden="true"
                   dangerouslySetInnerHTML={{ __html: BRAND_MARK }} />
            </a>

            {SECTIONS.map((link) => (
              <span className="fn-linkwrap" key={link.id}>
                {active === link.id && (
                  <motion.span
                    className="fn-pill"
                    layoutId="fn-pill"
                    transition={still ? { duration: 0 } : spring}
                  />
                )}
                <a
                  href={`#${link.id}`}
                  className={'fn-link' + (active === link.id ? ' is-active' : '')}
                  aria-current={active === link.id ? 'true' : undefined}
                  onClick={(e) => go(e, link.id)}
                >
                  {link.label}
                </a>
              </span>
            ))}

            <button
              type="button"
              className="fn-kbd"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command menu (Command K)"
              title="Command menu — ⌘K"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3Z" />
              </svg>
            </button>

            <a href="#contact" className="fn-cta" onClick={(e) => go(e, 'contact')}>
              Hire me
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
