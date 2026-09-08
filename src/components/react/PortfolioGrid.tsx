import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { SITE, CATEGORIES, countFor, slugFor, type Project } from '@/content/site';
import shots from '@/content/shots.json';
import { enter, spring, springSoft, stagger } from '@/lib/motion';
import Icon from './Icon';

const PAGE = 12;

type Shot = { w: number; h: number };
const SHOTS = shots as Record<string, Shot>;

function initialsOf(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function ProjectCard({ p }: { p: Project }) {
  const slug = slugFor(p.url);
  const shot = SHOTS[slug];
  const viewRef = useRef<HTMLDivElement>(null);

  /**
   * Each screenshot is a tall full-page capture shown inside a short frame.
   * The hover tour should scroll it by however much actually overflows, so a
   * short site does not slide past its own footer.
   */
  useEffect(() => {
    const view = viewRef.current;
    const img = view?.querySelector('img');
    if (!view || !img) return;
    const measure = () => {
      const overflow = img.offsetHeight - view.clientHeight;
      if (overflow <= 8) return;
      const pct = (overflow / img.offsetHeight) * 100;
      view.style.setProperty('--tour', `-${Math.min(pct, 82).toFixed(1)}%`);
    };
    if (img.complete) measure();
    else img.addEventListener('load', measure, { once: true });
    const ro = new ResizeObserver(measure);
    ro.observe(view);
    return () => ro.disconnect();
  }, [slug]);

  return (
    <a
      className="proj"
      href={`https://${p.url}`}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="Visit ↗"
      aria-label={`${p.name} — ${p.tag}. Opens ${p.url} in a new tab.`}
    >
      <div className="proj-thumb">
        <div className="bw">
          <div className="bw-bar" aria-hidden="true">
            <i /><i /><i />
            <span className="bw-url">{p.url}</span>
          </div>
          {shot ? (
            <div className="bw-view" ref={viewRef}>
              <img
                src={`/shots/${slug}.webp`}
                alt={`Screenshot of the ${p.name} website`}
                width={shot.w}
                height={shot.h}
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div className="bw-fallback" aria-hidden="true">{initialsOf(p.name)}</div>
          )}
        </div>
        <span className="proj-go" aria-hidden="true"><Icon name="arrowUpRight" size={18} /></span>
      </div>

      <div className="proj-meta">
        <div className="proj-name">{p.name}</div>
        <div className="proj-tag">{p.tag}</div>
      </div>
      <div className="proj-foot">
        <span className="proj-cat">{p.cat}</span>
        <span className="proj-ext" aria-hidden="true">Visit site <i>↗</i></span>
      </div>
    </a>
  );
}

/**
 * Filterable grid of every live project. Cards keep their identity across
 * filter changes, so switching category animates each card to its new slot
 * instead of tearing the grid down and rebuilding it.
 */
export default function PortfolioGrid() {
  const [filter, setFilter] = useState<string>('All');
  const [limit, setLimit] = useState(PAGE);
  const still = useReducedMotion();

  const list = useMemo(
    () => (filter === 'All' ? [...SITE.projects] : SITE.projects.filter((p) => p.cat === filter)),
    [filter],
  );
  const shown = list.slice(0, limit);

  useEffect(() => setLimit(PAGE), [filter]);

  return (
    <>
      <div className="filters" role="tablist" aria-label="Filter projects by category">
        <LayoutGroup id="filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={filter === c}
              className={'filter' + (filter === c ? ' is-active' : '')}
              onClick={() => setFilter(c)}
            >
              {filter === c && (
                <motion.span
                  className="filter-bg"
                  layoutId="filter-bg"
                  transition={still ? { duration: 0 } : springSoft}
                  aria-hidden="true"
                />
              )}
              <span className="filter-label">{c}</span>
              <span className="filter-count">{countFor(c)}</span>
            </button>
          ))}
        </LayoutGroup>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Showing {shown.length} of {list.length} {filter === 'All' ? 'projects' : `${filter} projects`}.
      </p>

      <motion.div className="proj-grid" layout={!still} transition={still ? { duration: 0 } : spring}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => (
            <motion.div
              key={p.url}
              layout={!still}
              initial={enter.initial}
              animate={enter.animate}
              exit={enter.exit}
              transition={
                still
                  ? { duration: 0 }
                  : { ...spring, delay: stagger(i, 0.028, 0.22) }
              }
              className="proj-cell"
            >
              <ProjectCard p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {limit < list.length && (
        <div className="port-more">
          <button type="button" className="btn-more" onClick={() => setLimit((l) => l + PAGE)}>
            <Icon name="plus" size={16} /> Show more ({list.length - limit})
          </button>
        </div>
      )}
    </>
  );
}
