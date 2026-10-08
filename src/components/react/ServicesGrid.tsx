import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SERVICES } from '@/content/services';
import { springSoft } from '@/lib/motion';
import Icon from './Icon';

/**
 * The seven service cards on the homepage, each linking to its own page. The
 * amber fill is one element that slides between cards on hover, so the
 * highlight reads as a single object moving rather than seven backgrounds
 * crossfading.
 */
export default function ServicesGrid() {
  const [open, setOpen] = useState(0);
  const still = useReducedMotion();

  return (
    <div className="svc-grid" onMouseLeave={() => setOpen(0)}>
      {SERVICES.map((sv, i) => (
        <a
          key={sv.slug}
          href={`/services/${sv.slug}`}
          className={'svc-card reveal-child' + (open === i ? ' is-open' : '')}
          onMouseEnter={() => setOpen(i)}
          onFocus={() => setOpen(i)}
          data-cursor="Open"
          aria-label={`${sv.nav} — ${sv.tagline}`}
        >
          {open === i && (
            <motion.span
              className="svc-fill"
              layoutId="svc-fill"
              transition={still ? { duration: 0 } : springSoft}
              aria-hidden="true"
            />
          )}

          <div className="svc-img">
            <img
              src={`/services/${sv.img}.webp`}
              alt=""
              width={760}
              height={567}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="svc-icon"><Icon name={sv.icon} size={26} /></div>
          <h3 className="svc-title">
            {sv.title.map((line) => <span key={line}>{line}</span>)}
          </h3>
          <div className="svc-count">{sv.count}</div>
          <p className="svc-blurb">{sv.tagline}</p>
          <span className="svc-more">
            Explore <Icon name="arrow" size={15} />
          </span>
          {sv.isNew && <span className="svc-tile-new svc-card-new">New</span>}
          <span className="svc-num" aria-hidden="true">0{i + 1}</span>
        </a>
      ))}
    </div>
  );
}
