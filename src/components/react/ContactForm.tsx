import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SITE } from '@/content/site';
import { spring, springTight } from '@/lib/motion';
import Icon from './Icon';

type Fields = { name: string; email: string; project: string };
type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ENDPOINT = '/api/contact';

export default function ContactForm() {
  const [form, setForm] = useState<Fields>({ name: '', email: '', project: '' });
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [honey, setHoney] = useState('');
  const still = useReducedMotion();

  const errors = {
    name: !form.name.trim() ? 'Tell me what to call you.' : '',
    email: !EMAIL_RE.test(form.email) ? 'That address does not look right.' : '',
    project: form.project.trim().length < 10
      ? 'A sentence or two about the project, please.'
      : '',
  };
  const valid = !errors.name && !errors.email && !errors.project;

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid || status === 'sending') return;

    setStatus('sending');
    setError('');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company: honey }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong on the way out.',
      );
    }
  }

  function reset() {
    setForm({ name: '', email: '', project: '' });
    setTouched(false);
    setStatus('idle');
    setError('');
  }

  return (
    <motion.div
      className="contact-right"
      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={still ? { duration: 0 } : { duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="form-head">
        Estimate your project? <em>Let me know here.</em>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            className="form-sent"
            initial={still ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={still ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={still ? { duration: 0 } : spring}
          >
            <motion.div
              className="sent-mark"
              initial={still ? false : { scale: 0.4, rotate: -25 }}
              animate={still ? {} : { scale: 1, rotate: 0 }}
              transition={springTight}
            >
              <Icon name="check" size={26} stroke={2.4} />
            </motion.div>
            <h3>Message sent.</h3>
            <p>
              Thanks, {form.name.split(' ')[0]} — it landed in my inbox. I usually reply
              within a day; if it is urgent, {SITE.phone} is faster.
            </p>
            <button type="button" className="link-arrow" onClick={reset}>
              Send another <Icon name="arrow" size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="form"
            onSubmit={submit}
            noValidate
            initial={false}
            exit={still ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={still ? { duration: 0 } : spring}
          >
            {/* Bots fill this in; people never see it. */}
            <div className="hp" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={honey}
                onChange={(e) => setHoney(e.target.value)}
              />
            </div>

            <div className={'field' + (touched && errors.name ? ' err' : '')}>
              <label className="sr-only" htmlFor="cf-name">Your name</label>
              <input
                id="cf-name"
                name="name"
                value={form.name}
                onChange={set('name')}
                placeholder="What's your name?"
                autoComplete="name"
                aria-invalid={touched && !!errors.name}
                aria-describedby={touched && errors.name ? 'err-name' : undefined}
              />
            </div>
            {touched && errors.name && <span className="field-err" id="err-name">{errors.name}</span>}

            <div className={'field' + (touched && errors.email ? ' err' : '')}>
              <label className="sr-only" htmlFor="cf-email">Your email address</label>
              <input
                id="cf-email"
                name="email"
                type="email"
                inputMode="email"
                value={form.email}
                onChange={set('email')}
                placeholder="Your fancy email"
                autoComplete="email"
                aria-invalid={touched && !!errors.email}
                aria-describedby={touched && errors.email ? 'err-email' : undefined}
              />
            </div>
            {touched && errors.email && <span className="field-err" id="err-email">{errors.email}</span>}

            <div className={'field' + (touched && errors.project ? ' err' : '')}>
              <label className="sr-only" htmlFor="cf-project">About your project</label>
              <textarea
                id="cf-project"
                name="project"
                rows={3}
                value={form.project}
                onChange={set('project')}
                placeholder="Tell me about your project"
                aria-invalid={touched && !!errors.project}
                aria-describedby={touched && errors.project ? 'err-project' : undefined}
              />
            </div>
            {touched && errors.project && <span className="field-err" id="err-project">{errors.project}</span>}

            <motion.button
              type="submit"
              className={'submit' + (valid ? ' ready' : '')}
              disabled={status === 'sending'}
              whileTap={still ? undefined : { scale: 0.97 }}
              transition={springTight}
            >
              {status === 'sending' ? 'Sending…' : 'Send it over'}
              <Icon name="arrow" size={18} />
            </motion.button>

            {status === 'error' && (
              <p className="form-error" role="alert">
                {error} You can also email me directly at{' '}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
              </p>
            )}

            <p className="form-note">
              Your details go straight to my inbox and nowhere else — no list, no CRM,
              no follow-up sequence.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
