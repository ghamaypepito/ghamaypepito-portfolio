import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SITE } from '@/content/site';
import { springSoft, stagger } from '@/lib/motion';

/**
 * The three models behind the AI work. Selecting one lifts it and slides the
 * amber panel across, so the row behaves like one control rather than three
 * cards that happen to sit together.
 *
 * The marks are plain monograms, deliberately not the vendors' logos.
 */
export default function ModelToolkit() {
  const [active, setActive] = useState(0);
  const still = useReducedMotion();
  const models = SITE.ai.models;

  return (
    <div className="models" onMouseLeave={() => setActive(0)}>
      {models.map((m, i) => {
        const isActive = i === active;
        return (
          <motion.button
            key={m.name}
            type="button"
            className={'model' + (isActive ? ' is-active' : '')}
            aria-pressed={isActive}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={
              still
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.25, 1, 0.5, 1], delay: stagger(i, 0.09, 0.3) }
            }
          >
            {isActive && (
              <motion.span
                className="model-fill"
                layoutId="model-fill"
                transition={still ? { duration: 0 } : springSoft}
                aria-hidden="true"
              />
            )}
            <span className="model-mark" aria-hidden="true">{m.mark}</span>
            <span className="model-name">{m.name}</span>
            <span className="model-role">{m.role}</span>
            <span className="model-blurb">{m.blurb}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
