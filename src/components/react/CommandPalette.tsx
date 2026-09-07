import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SITE } from '@/content/site';
import { SECTIONS, EXTRA_SECTIONS, scrollToSection } from '@/lib/scroll';
import { spring, fade } from '@/lib/motion';
import Icon from './Icon';
import type { IconName } from '@/lib/icons';

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: IconName;
  run: () => void;
};

/**
 * ⌘K menu. Jumps to sections, opens any of the 38 live projects, and exposes
 * the contact routes. Fully keyboard-driven; the mouse is optional.
 */
export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const still = useReducedMotion();

  const commands = useMemo<Command[]>(() => {
    const jump: Command[] = [...SECTIONS, ...EXTRA_SECTIONS].map((s) => ({
      id: `go-${s.id}`,
      label: `Go to ${s.label}`,
      group: 'Navigate',
      icon: 'corner',
      run: () => scrollToSection(s.id),
    }));

    const reach: Command[] = [
      {
        id: 'email',
        label: 'Email Ghamay',
        hint: SITE.email,
        group: 'Get in touch',
        icon: 'mail',
        run: () => { window.location.href = `mailto:${SITE.email}`; },
      },
      {
        id: 'call',
        label: 'Call Ghamay',
        hint: SITE.phone,
        group: 'Get in touch',
        icon: 'phone',
        run: () => { window.location.href = `tel:${SITE.phone.replace(/\s/g, '')}`; },
      },
      {
        id: 'book',
        label: 'Book a discovery call',
        hint: 'Opens the booking page',
        group: 'Get in touch',
        icon: 'calendar' as IconName,
        run: () => window.open(SITE.webapp.bookingUrl, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'ghl-portal',
        label: 'Open the GoHighLevel portal',
        hint: SITE.ghl.portalLabel,
        group: 'Get in touch',
        icon: 'arrowUpRight' as IconName,
        run: () => window.open(SITE.ghl.portalUrl, '_blank', 'noopener,noreferrer'),
      },
      ...SITE.socials.map((s) => ({
        id: `soc-${s.label}`,
        label: s.label,
        hint: s.href.replace(/^https?:\/\/(www\.)?/, ''),
        group: 'Get in touch',
        icon: 'arrowUpRight' as IconName,
        run: () => window.open(s.href, '_blank', 'noopener,noreferrer'),
      })),
    ];

    const work: Command[] = SITE.projects
      .filter((p) => p.status !== 'archived')
      .map((p) => ({
        id: `proj-${p.url}`,
        label: p.name,
        hint: p.cat,
        group: 'Open a project',
        icon: 'arrowUpRight' as IconName,
        run: () => window.open(`https://${p.url}`, '_blank', 'noopener,noreferrer'),
      }));

    return [...jump, ...reach, ...work];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.slice(0, 40);
    return commands
      .filter((c) => `${c.label} ${c.hint ?? ''} ${c.group}`.toLowerCase().includes(q))
      .slice(0, 40);
  }, [commands, query]);

  // Reset whenever the menu opens, and focus the input.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  // Lock body scroll while the overlay is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Keep the highlighted row in view during keyboard traversal.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const choose = (cmd: Command | undefined) => {
    if (!cmd) return;
    onClose();
    // Let the exit animation start before the page moves under it.
    setTimeout(() => cmd.run(), still ? 0 : 90);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    }
    if (e.key === 'Enter') { e.preventDefault(); choose(results[cursor]); }
  };

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="cmdk"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={still ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
            animate={still ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={still ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)' }}
            transition={spring}
            onKeyDown={onKeyDown}
          >
            <div className="cmdk-input">
              <Icon name="search" size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section, or search 38 projects…"
                aria-label="Search commands and projects"
                aria-controls="cmdk-results"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="button" className="fn-kbd" onClick={onClose} aria-label="Close menu">
                <Icon name="close" size={15} />
              </button>
            </div>

            {results.length === 0 ? (
              <p className="cmdk-empty">Nothing matches “{query}”.</p>
            ) : (
              <ul className="cmdk-list" id="cmdk-results" role="listbox" ref={listRef}>
                {results.map((cmd, i) => {
                  const header = cmd.group !== lastGroup ? cmd.group : null;
                  lastGroup = cmd.group;
                  return (
                    <li key={cmd.id}>
                      {header && <div className="cmdk-group">{header}</div>}
                      <button
                        type="button"
                        role="option"
                        aria-selected={i === cursor}
                        className="cmdk-item"
                        onMouseMove={() => setCursor(i)}
                        onClick={() => choose(cmd)}
                      >
                        <span className="ci-mark"><Icon name={cmd.icon} size={16} /></span>
                        <span>{cmd.label}</span>
                        {cmd.hint && <span className="ci-sub">{cmd.hint}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="cmdk-foot">
              <span><kbd>↑↓</kbd>navigate</span>
              <span><kbd>↵</kbd>open</span>
              <span><kbd>esc</kbd>close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
