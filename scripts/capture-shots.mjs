/**
 * Captures a screenshot of every live project listed in src/content/site.ts.
 *
 * Output:
 *   public/shots/<slug>.webp   — tall capture, shown inside the browser frame
 *   src/content/shots.json     — manifest of what actually succeeded
 *
 * Sites that fail (dead domain, timeout, TLS error) are simply left out of the
 * manifest; the grid falls back to an initials tile for those. Run it again
 * any time — it is idempotent, and `--only=<slug>` retries a single site.
 *
 *   npm run shots
 *   npm run shots -- --only=mac-ph --force
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, writeFile, readFile, access, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'shots');
const MANIFEST = join(ROOT, 'src', 'content', 'shots.json');

/* Capture geometry. The frame in the UI is roughly 4:3, and the hover tour
   scrolls through the rest — so we want appreciably more height than width. */
const VIEWPORT = { width: 1440, height: 900 };
const CLIP_HEIGHT = 2200;
/* Cards render ~285px wide at the 1240px max layout, so 620px covers a 2x
   display with room to spare. Going wider only buys bytes. */
const OUT_WIDTH = 620;
const NAV_TIMEOUT = 30_000;
const SETTLE_MS = 2800;
const CONCURRENCY = 4;

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1];
const force = args.includes('--force');

function slugFor(url) {
  return url.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

/** Reads the project list straight out of the typed content file. */
async function loadProjects() {
  const src = await readFile(join(ROOT, 'src', 'content', 'site.ts'), 'utf8');
  const projects = [];
  const re = /\{\s*name:\s*'([^']+)',\s*url:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) projects.push({ name: m[1], url: m[2] });
  return projects;
}

/** Common consent overlays, dismissed so they do not dominate the shot. */
const CONSENT_SELECTORS = [
  '#onetrust-accept-btn-handler',
  '.cc-allow', '.cc-dismiss',
  '[aria-label*="ccept" i]',
  'button:has-text("Accept all")',
  'button:has-text("Accept All")',
  'button:has-text("Accept")',
  'button:has-text("I agree")',
  'button:has-text("Got it")',
  '#cookie-notice .cn-set-cookie',
  '.cmplz-accept',
  '.moove-gdpr-infobar-allow-all',
];

/**
 * A page that loads with HTTP 200 can still be worthless as proof of work:
 * host error pages, parked domains and "coming soon" splashes all render
 * fine. Reject them rather than shipping them in a portfolio grid.
 */
const PLACEHOLDER_MARKERS = [
  'coming soon',
  'is being built',
  'under construction',
  'account suspended',
  'there has been a server misconfiguration',
  'default web site page',
  'this domain is for sale',
  'buy this domain',
  'index of /',
  'future home of',
  'website expired',
  'apache2 ubuntu default page',
];

async function looksLikePlaceholder(page) {
  const text = (await page.evaluate(() => document.body?.innerText || '')).toLowerCase();
  // A real site normally has far more copy than a splash page.
  const marker = PLACEHOLDER_MARKERS.find((m) => text.includes(m));
  if (marker && text.length < 4000) return `placeholder page ("${marker}")`;
  if (text.trim().length < 120) return 'page had almost no content';
  return null;
}

async function dismissOverlays(page) {
  for (const sel of CONSENT_SELECTORS) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 250 })) {
        await el.click({ timeout: 800, force: true });
        await page.waitForTimeout(250);
        break;
      }
    } catch {
      /* selector absent or not clickable — try the next one */
    }
  }
}

async function capture(browser, project) {
  const slug = slugFor(project.url);
  const dest = join(OUT_DIR, `${slug}.webp`);

  if (!force) {
    try {
      await access(dest);
      const meta = await sharp(dest).metadata();
      return { slug, ok: true, cached: true, w: meta.width, h: meta.height };
    } catch {
      /* not captured yet — carry on */
    }
  }

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    // Reduce motion so carousels and hero videos sit still for the shot.
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(NAV_TIMEOUT);

  const candidates = [`https://${project.url}`, `https://www.${project.url}`, `http://${project.url}`];
  let lastError = 'no attempt';

  try {
    for (const url of candidates) {
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
        if (res && res.status() >= 400) {
          lastError = `HTTP ${res.status()}`;
          continue;
        }

        await page.waitForTimeout(SETTLE_MS);
        await dismissOverlays(page);

        // Nudge the page so lazy images below the fold decode, then return.
        await page.evaluate(async () => {
          const step = window.innerHeight;
          for (let y = 0; y < step * 3; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 220));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(700);

        const height = await page.evaluate(() =>
          Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        );

        const placeholder = await looksLikePlaceholder(page);
        if (placeholder) {
          lastError = placeholder;
          continue;
        }

        // `clip` alone is bounded by the viewport, so `fullPage` is what lets
        // us keep the tall region the hover tour scrolls through.
        const png = await page.screenshot({
          type: 'png',
          fullPage: true,
          clip: { x: 0, y: 0, width: VIEWPORT.width, height: Math.min(height, CLIP_HEIGHT) },
        });

        const out = await sharp(png)
          .resize({ width: OUT_WIDTH, withoutEnlargement: true })
          .webp({ quality: 70, effort: 6 })
          .toBuffer({ resolveWithObject: true });

        await writeFile(dest, out.data);
        return { slug, ok: true, w: out.info.width, h: out.info.height, url };
      } catch (err) {
        lastError = err instanceof Error ? err.message.split('\n')[0] : String(err);
      }
    }
    return { slug, ok: false, error: lastError, url: project.url };
  } finally {
    await context.close();
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let projects = await loadProjects();
  if (only) {
    const wanted = new Set(only.split(','));
    projects = projects.filter((p) => wanted.has(slugFor(p.url)));
  }
  if (!projects.length) {
    console.error(only ? `No project matches --only=${only}` : 'No projects found.');
    process.exit(1);
  }

  console.log(`Capturing ${projects.length} site(s) with ${CONCURRENCY} workers…\n`);
  const browser = await chromium.launch();
  const results = [];
  const queue = [...projects];

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const project = queue.shift();
        if (!project) break;
        const r = await capture(browser, project);
        results.push(r);
        const mark = r.ok ? (r.cached ? '·' : '✓') : '✗';
        const note = r.ok ? `${r.w}×${r.h}` : r.error;
        console.log(`${mark} ${project.name.padEnd(24)} ${project.url.padEnd(28)} ${note}`);
      }
    }),
  );

  await browser.close();

  // Merge into any existing manifest so a partial re-run never drops entries.
  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch {
    /* first run */
  }
  for (const r of results) {
    if (r.ok) {
      manifest[r.slug] = { w: r.w, h: r.h };
    } else {
      // Retract anything a previous run left behind, so a site that has since
      // gone down stops being presented as live work.
      delete manifest[r.slug];
      await rm(join(OUT_DIR, `${r.slug}.webp`), { force: true });
    }
  }
  const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST, `${JSON.stringify(ordered, null, 2)}\n`);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} captured.`);
  if (failed.length) {
    console.log('\nNot captured (grid falls back to an initials tile):');
    for (const f of failed) console.log(`  ${f.url} — ${f.error}`);
  }
  console.log(`\nManifest: ${MANIFEST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
