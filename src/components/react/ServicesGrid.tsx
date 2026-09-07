import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SITE } from '@/content/site';
import { springSoft } from '@/lib/motion';
import Icon from './Icon';

/**
 * The four service cards. The amber fill is one element that slides from card
 * to card on hover, so the highlight reads as a single object moving rather
 * than four backgrounds crossfading.
 */
export default function ServicesGrid() {
  const [open, setOpen] = useState(0);
  const still = useReducedMotion();

  return (
    <div className="svc-grid" onMouseLeave={() => setOpen(0)}>
      {SITE.services.map((sv, i) => (
        <article
          key={sv.key}
          className={'svc-card reveal-child' + (open === i ? ' is-open' : '')}
          onMouseEnter={() => setOpen(i)}
          onFocus={() => setOpen(i)}
          tabIndex={0}
          aria-label={`${sv.title.join(' ')} — ${sv.blurb}`}
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
          <p className="svc-blurb">{sv.blurb}</p>
          <div className="svc-tools">
            {sv.tools.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          <span className="svc-num" aria-hidden="true">0{i + 1}</span>
        </article>
      ))}
    </div>
  );
}
