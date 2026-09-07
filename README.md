# ghamaypepito.com

Portfolio site for **Emeterio "Ghamay" Pepito III** — website designer &
developer, digital marketing manager and SEO specialist, Cebu City.

Built from a [Claude Design](https://claude.ai/design) handoff and rebuilt as a
production static site: Astro 5, five React islands, hand-written CSS, deployed
to Cloudflare Pages.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck site + worker, then build to `dist/` |
| `npm run build:fast` | Build without the typecheck pass |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run typecheck` | `astro check` plus the Worker's own tsconfig |
| `npm run shots` | Re-capture project screenshots (see below) |
| `npm run og` | Regenerate `public/og.png` |
| `npm run deploy` | `wrangler pages deploy dist` |

Verification (also what CI runs):

```bash
npm run build && npm run preview &
node scripts/verify.mjs http://localhost:4321
```

It asserts the grid renders, the filter narrows it, ⌘K opens, every scroll
reveal fires, mobile does not scroll sideways, and the console is clean. It
writes screenshots of each section to `_gen/verify/`.

---

## How it is put together

```
src/
  content/site.ts        Every string on the site, typed. Edit copy here.
  content/shots.json     Generated — which projects have a screenshot.
  layouts/Base.astro     <head>, SEO meta, three JSON-LD graphs.
  components/astro/      Static sections. No JavaScript ships for these.
  components/react/      The five interactive islands.
  lib/                   Motion constants, icons, scroll reveal, cursor.
  styles/                tokens → base → sections → enhancements.
functions/api/contact.ts Cloudflare Pages Function behind the contact form.
scripts/                 Screenshot capture, OG generation, verification.
```

### Why Astro with islands

The page is mostly text and images, so almost all of it is static HTML with no
JavaScript at all. Only five components hydrate, and each waits for a reason to:

| Island | Directive | Why it needs JS |
| --- | --- | --- |
| `FloatingNav` | `client:idle` | Scroll spy, travelling pill, ⌘K |
| `ServicesGrid` | `client:visible` | Hover state that slides between cards |
| `PortfolioGrid` | `client:visible` | Filtering, paging, layout animation |
| `ProcessRail` | `client:visible` | Expanding delivery steps |
| `ModelToolkit` | `client:visible` | Switching between the three models |
| `Testimonials` | `client:visible` | Carousel, drag, autoplay |
| `ContactForm` | `client:visible` | Validation, submission |

Hero, manifesto, experience, skills, contact details, the GoHighLevel band and
the footer are pure Astro — they cost zero bytes of JavaScript.

### Page sections

Hero → Manifesto → Services → Portfolio → **Web Apps** → **AI** →
**GoHighLevel** → Experience → Skills → Testimonials → Contact.

Six of those are in the nav; GoHighLevel is reachable from the ⌘K palette,
because a pill nav stops being scannable past six items.

### Two links that need your input

Both are defined once in `src/content/site.ts` and used everywhere else:

| Field | Currently | Should be |
| --- | --- | --- |
| `webapp.bookingUrl` | `https://ghl.southsidestudio.ph` | The exact GoHighLevel **calendar** URL for discovery calls |
| `ghl.portalUrl` | `https://ghl.southsidestudio.ph` | Correct as-is |

The booking URL is a placeholder pointing at the portal root — it works, but it
drops people on the front door rather than a booking slot. It is marked
`TODO(ghamay)` in the content file.

`ai.models` also carries a one-line description of what each of Claude, ChatGPT
and Grok is used for. That is the only opinionated copy on the page; it is
marked `TODO` for you to sanity-check against how you actually split the work.

### Editing content

Everything lives in [`src/content/site.ts`](src/content/site.ts) and is typed,
so a mistake is a build error rather than a blank space on the page. To add a
project, append to `projects` and run `npm run shots` to capture it.

---

## Project screenshots

`npm run shots` drives Playwright over every URL in `site.ts`, captures a tall
full-page image, converts it to WebP, and writes `src/content/shots.json`.

It is deliberately conservative about what counts as a live site. A domain that
404s, times out, fails DNS, or serves a "coming soon" or host error page is
**rejected** — the grid then shows an initials tile instead. A portfolio should
not present a broken site as finished work.

```bash
npm run shots                                   # capture anything missing
npm run shots -- --force                        # recapture everything
npm run shots -- --only=proshadeph-com --force  # retry one site
```

**29 of 38 currently capture.** Not captured:

| Domain | Reason |
| --- | --- |
| `nathalieelkouby.com` | DNS does not resolve |
| `surewayconsultancy.com` | DNS does not resolve |
| `drcdc.com` | DNS does not resolve |
| `bni-manilacbd.org` | DNS does not resolve |
| `blendconsultancy.com` | HTTP 500 |
| `ycloud.ph` | HTTP 404 |
| `captainpanel.com` | Connection times out |
| `liveloudworship.com` | Host error page (cPanel misconfiguration) |
| `cebutravels.ph` | "Coming soon" placeholder |

Worth reviewing — several of these are listed as live work but no longer are.
Re-run `npm run shots` after any is restored and it will be picked up.

---

## Motion

Animation follows a small set of rules, encoded in
[`src/lib/motion.ts`](src/lib/motion.ts) and the `--ease-*` tokens:

- animate `transform`, `opacity` and `filter` only — never layout properties;
- prefer a spring over a duration, so gestures stay interruptible;
- interaction feedback under 200ms, entrances under 600ms;
- a small blur on entrance is what makes it read as considered;
- `prefers-reduced-motion` removes motion, never functionality.

Every island calls `useReducedMotion()` and collapses to instant transitions;
the CSS layer has a matching `@media (prefers-reduced-motion: reduce)` block.

**Entrances live in CSS, not in the islands.** Islands hydrate on
`client:visible`, so an entrance animation inside a component renders its
hidden state into the SSR HTML — and the content then depends on hydration to
become visible. A fast scroll, a slow device or a JS failure leaves it blank.

So: static wrappers carry `data-reveal` / `data-reveal-kids` and
`src/lib/reveal.ts` owns them, with a `.no-js` fallback and a scroll-time
safety sweep that rescues anything the IntersectionObserver missed. Islands
animate only what is genuinely interactive — layout pills, drag, press, exit.
`scripts/verify.mjs` asserts that nothing in `<main>` is invisible with
JavaScript disabled, and nothing is stranded under reduced motion.

---

## Accessibility

- Skip link, visible `:focus-visible` rings, semantic landmarks and headings.
- Filter results announced via `role="status"`; carousel via `aria-live`.
- Carousel is operable with arrow keys; the command palette is fully keyboard-driven.
- The custom cursor is decorative, `aria-hidden`, and never the only signal
  that something is interactive.
- `--muted-2` was lifted from the handoff's `#6c7488` (4.1:1) to `#7a8296`
  so body text clears WCAG AA.

---

## Deployment

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for the full Cloudflare Pages runbook,
including the DNS cutover and the one secret the contact form needs.

## Credits

Design: Claude Design handoff, rebuilt here.
Atmospheric imagery: generated with Higgsfield. Portraits are real photographs.
Type: [Sora](https://fonts.google.com/specimen/Sora) and
[Manrope](https://fonts.google.com/specimen/Manrope), self-hosted.
