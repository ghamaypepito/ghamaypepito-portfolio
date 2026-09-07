/**
 * Cloudflare Pages Function backing the contact form.
 *
 * POST /api/contact  { name, email, project, company }
 *
 * Defence in depth, cheapest check first:
 *   1. honeypot  — `company` must be empty; bots fill it, people never see it
 *   2. rate limit — per-IP, backed by KV when bound (see wrangler.toml)
 *   3. validation — length and shape, server-side, never trusting the client
 *   4. delivery   — Resend, with the sender's address as reply-to
 *
 * Required secret:  RESEND_API_KEY
 * Optional vars:    CONTACT_TO, CONTACT_FROM
 * Optional binding: RATE_LIMIT (KV namespace) — without it the limiter is a
 *                   no-op and the other three layers still apply.
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  RATE_LIMIT?: KVNamespace;
}

type Payload = {
  name?: unknown;
  email?: unknown;
  project?: unknown;
  company?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 200, project: 4000 };
const WINDOW_SECONDS = 3600;
const MAX_PER_WINDOW = 5;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/** Strips CR/LF so a submitted value can never inject a mail header. */
function singleLine(v: string): string {
  return v.replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function overRateLimit(env: Env, ip: string): Promise<boolean> {
  if (!env.RATE_LIMIT) return false;
  const key = `contact:${ip}`;
  try {
    const current = Number((await env.RATE_LIMIT.get(key)) ?? '0');
    if (current >= MAX_PER_WINDOW) return true;
    await env.RATE_LIMIT.put(key, String(current + 1), {
      expirationTtl: WINDOW_SECONDS,
    });
    return false;
  } catch {
    // A KV hiccup must not take the form down.
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400);
  }

  // 1. Honeypot. Answer 200 so a bot cannot tell it was caught.
  if (asString(body.company)) return json({ ok: true });

  // 2. Rate limit.
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (await overRateLimit(env, ip)) {
    return json({ error: 'Too many messages from this address. Try again later.' }, 429);
  }

  // 3. Validate.
  const name = singleLine(asString(body.name));
  const email = singleLine(asString(body.email)).toLowerCase();
  const project = asString(body.project);

  if (!name || name.length > LIMITS.name) {
    return json({ error: 'Please provide a name.' }, 400);
  }
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) {
    return json({ error: 'Please provide a valid email address.' }, 400);
  }
  if (project.length < 10 || project.length > LIMITS.project) {
    return json({ error: 'Please describe the project in a sentence or two.' }, 400);
  }

  // 4. Deliver.
  if (!env.RESEND_API_KEY) {
    // Deployed without the key: say so plainly rather than silently dropping
    // an enquiry on the floor.
    return json(
      { error: 'The contact form is not connected to an inbox yet.' },
      503,
    );
  }

  const to = env.CONTACT_TO ?? 'ghamaypepito@gmail.com';
  const from = env.CONTACT_FROM ?? 'Portfolio <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio enquiry — ${name}`,
      html: [
        '<h2 style="font-family:system-ui,sans-serif">New enquiry from the portfolio</h2>',
        `<p style="font-family:system-ui,sans-serif"><strong>Name:</strong> ${escapeHtml(name)}<br>`,
        `<strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
        '<hr>',
        `<p style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(project)}</p>`,
      ].join(''),
      text: `New enquiry from the portfolio\n\nName: ${name}\nEmail: ${email}\n\n${project}\n`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('Resend rejected the message', res.status, detail);
    return json({ error: 'The message could not be delivered just now.' }, 502);
  }

  return json({ ok: true });
};

/** Anything other than POST gets a clear answer rather than a 404. */
export const onRequest: PagesFunction<Env> = async (ctx) => {
  if (ctx.request.method === 'POST') return onRequestPost(ctx);
  return json({ error: 'Method not allowed.' }, 405);
};
