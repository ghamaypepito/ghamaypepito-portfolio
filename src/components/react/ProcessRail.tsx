import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SITE } from '@/content/site';
import { springSoft } from '@/lib/motion';

/**
 * The four-step delivery process. One step is expanded at a time; the amber
 * rail segment travels between them rather than fading in place, so the list
 * reads as a single progressing thing.
 */
export default function ProcessRail() {
  const [active, setActive] = useState(0);
  const still = useReducedMotion();
  const steps = SITE.webapp.process;

  return (
    <ol className="rail" aria-label="How a project runs">
      {steps.map((s, i) => {
        const isActive = i === active;
        return (
          <li
            key={s.step}
            className={'rail-item reveal-child' + (isActive ? ' is-active' : '')}
          >
            <button
              type="button"
              className="rail-btn"
              aria-expanded={isActive}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="rail-marker" aria-hidden="true">
                {isActive && (
                  <motion.span
                    className="rail-glow"
                    layoutId="rail-glow"
                    transition={still ? { duration: 0 } : springSoft}
                  />
                )}
                <span className="rail-num">{String(i + 1).padStart(2, '0')}</span>
              </span>

              <span className="rail-body">
                <span className="rail-step">{s.step}</span>
                <span className="rail-title">{s.title}</span>
                <motion.span
                  className="rail-blurb"
                  initial={false}
                  animate={{
                    height: isActive ? 'auto' : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={still ? { duration: 0 } : { duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
                >
                  <span>{s.blurb}</span>
                </motion.span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
