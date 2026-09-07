import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SITE } from '@/content/site';
import { spring } from '@/lib/motion';
import Icon from './Icon';

const INTERVAL = 6500;

/**
 * Quote carousel. Auto-advances, pauses on hover or focus, and can be driven
 * with the arrow keys or a swipe. The dots double as progress bars so the
 * timing is visible rather than surprising.
 */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const still = useReducedMotion();
  const items = SITE.testimonials;
  const item = items[index]!;

  const goTo = useCallback((i: number) => {
    setIndex(((i % items.length) + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused || still) return;
    const id = window.setInterval(() => goTo(index + 1), INTERVAL);
    return () => window.clearInterval(id);
  }, [index, paused, still, goTo]);

  const initials = item.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="quotes-right"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Client feedback"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
      }}
    >
      <span className="quote-mark"><Icon name="quote" size={42} /></span>

      <div aria-live="polite" aria-atomic="true">
        {/* `initial={false}` keeps the first quote out of the entrance
            animation, so it is server-rendered visible rather than at
            opacity 0 waiting for hydration. Later changes still animate. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            drag={still ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) goTo(index + 1);
              else if (info.offset.x > 60) goTo(index - 1);
            }}
            initial={still ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(5px)' }}
            animate={still ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={still ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(5px)' }}
            transition={still ? { duration: 0 } : spring}
          >
            <blockquote className="quote-text">{item.quote}</blockquote>
            <div className="quote-author">
              <span className="qa-avatar" aria-hidden="true">{initials}</span>
              <div>
                <div className="qa-name">{item.name}</div>
                <div className="qa-title">{item.title}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="quote-dots">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            className={'qdot' + (i === index ? ' is-active' : '')}
            onClick={() => goTo(i)}
            aria-label={`Show feedback ${i + 1} of ${items.length}`}
            aria-current={i === index ? 'true' : undefined}
          >
            {i === index && (
              <motion.span
                className="qdot-fill"
                key={`fill-${index}-${paused}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={
                  still || paused
                    ? { duration: 0 }
                    : { duration: INTERVAL / 1000, ease: 'linear' }
                }
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
