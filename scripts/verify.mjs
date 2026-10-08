/**
 * Visual and behavioural smoke test for the whole site.
 *
 *   node scripts/verify.mjs [baseUrl]
 *
 * Generic checks run against every route: console cleanliness, scroll reveals,
 * reduced motion, no-JavaScript readability and mobile overflow. Page-specific
 * checks follow. Screenshots land in _gen/verify/.
 *
 * Expected counts are derived from src/content, never hardcoded, so adding a
 * project or a service cannot fail a check that is really about "they all
 * rendered".
 */
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';

const BASE = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
const OUT = '_gen/verify';

/* --- expectations, read from the content files ---------------------------- */
const siteSrc = await readFile(new URL('../src/content/site.ts', import.meta.url), 'utf8');
const servicesSrc = await readFile(new URL('../src/content/services.ts', import.meta.url), 'utf8');

const projectsFrom = siteSrc.indexOf('projects: [');
const EXPECTED_PROJECTS = (
  siteSrc.slice(projectsFrom).match(/\{ name: '[^']*', url: '[^']*'/g) || []
).length;
const EXPECTED_FEATURED = (siteSrc.match(/featured: true/g) || []).length;
const SERVICE_SLUGS = [...servicesSrc.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((m) => m[1]);
const BOOKING_URL = siteSrc.match(/bookingUrl:\s*\n?\s*'([^']+)'/)?.[1];

if (!EXPECTED_PROJECTS || !SERVICE_SLUGS.length || !BOOKING_URL) {
  throw new Error('Could not read expectations from src/content');
}

const ROUTES = ['/', '/services', '/work', ...SERVICE_SLUGS.map((s) => `/services/${s}`)];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };
const checks = {};

/* --- 1. every route: loads, no console errors, reveals fire --------------- */
const routeReport = [];
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${route}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${route}: pageerror ${e.message}`));

  const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await page.waitForTimeout(1000);

  const r = await page.evaluate(() => {
    const ignorable = (el) =>
      el.closest('[aria-hidden="true"]') ||
      el.classList.contains('proj-go') ||
      el.classList.contains('hp');
    return {
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      reveals: document.querySelectorAll('[data-reveal]').length,
      revealsShown: document.querySelectorAll('[data-reveal].is-in').length,
      stranded: [...document.querySelectorAll('main *')].filter(
        (el) =>
          getComputedStyle(el).opacity === '0' &&
          el.getBoundingClientRect().height > 20 &&
          !ignorable(el),
      ).length,
      unsafeLinks: [...document.querySelectorAll('a[target="_blank"]')].filter(
        (a) => !(a.getAttribute('rel') || '').includes('noopener'),
      ).length,
      canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
      jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
    };
  });

  routeReport.push({ route, status: res?.status(), ...r, errors: errors.length });
  expect(`${route} returns 200`, res?.status() === 200);
  expect(`${route} has exactly one h1`, r.h1 === 1);
  expect(`${route} reveals all fired (${r.revealsShown}/${r.reveals})`, r.revealsShown === r.reveals);
  expect(`${route} has nothing stranded invisible`, r.stranded === 0);
  expect(`${route} external links carry rel=noopener`, r.unsafeLinks === 0);
  expect(`${route} emits structured data`, r.jsonLd > 0);
  expect(`${route} console is clean`, errors.length === 0);
  if (errors.length) console.error(errors.slice(0, 3).join('\n'));

  await page.screenshot({
    path: `${OUT}${route === '/' ? '/home' : route.replace(/\//g, '-')}.png`,
    fullPage: false,
  });
  await page.close();
}
checks.routes = routeReport.map((r) => `${r.route} [${r.status}]`);

/* --- 2. homepage: services link out, three featured, workflow ------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(1500);

  checks.homeServiceCards = await page.locator('a.svc-card').count();
  checks.homeServiceLinks = await page.evaluate(
    () => [...document.querySelectorAll('a.svc-card')].filter((a) => a.pathname.startsWith('/services/')).length,
  );
  checks.homeFeatured = await page.locator('#work .proj').count();
  checks.homeWorkflowSteps = await page.locator('.wf-step').count();
  checks.homeSeeAll = await page.locator('a[href="/work"]').count();
  checks.homeBookingLinks = await page.evaluate(
    (url) => [...document.querySelectorAll('a')].filter((a) => a.href === url).length,
    BOOKING_URL,
  );
  await page.close();

  expect(`homepage shows all ${SERVICE_SLUGS.length} service cards`, checks.homeServiceCards === SERVICE_SLUGS.length);
  expect('every homepage service card links to its page', checks.homeServiceLinks === SERVICE_SLUGS.length);
  expect(`homepage features exactly ${EXPECTED_FEATURED} projects`, checks.homeFeatured === EXPECTED_FEATURED);
  expect('homepage shows the five-step workflow', checks.homeWorkflowSteps === 5);
  expect('homepage links through to /work', checks.homeSeeAll >= 1);
  expect('homepage booking CTA is wired', checks.homeBookingLinks >= 1);
}

/* --- 3. /services: one tile per service ----------------------------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`${BASE}/services`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  checks.serviceTiles = await page.locator('.svc-tile-link').count();
  checks.serviceTilesLinked = await page.evaluate(
    (slugs) => slugs.filter((s) => document.querySelector(`a[href="/services/${s}"]`)).length,
    SERVICE_SLUGS,
  );
  checks.newBadges = await page.locator('.svc-tile-new').count();
  await page.close();

  expect(`/services lists all ${SERVICE_SLUGS.length} services`, checks.serviceTiles === SERVICE_SLUGS.length);
  expect('/services links to every service page', checks.serviceTilesLinked === SERVICE_SLUGS.length);
  expect('/services badges the newer offerings', checks.newBadges >= 1);
}

/* --- 4. each service page has its required furniture ---------------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const thin = [];
  for (const slug of SERVICE_SLUGS) {
    await page.goto(`${BASE}/services/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => ({
      outcomes: document.querySelectorAll('.svc-outcome-grid .ai-card').length,
      deliverables: document.querySelectorAll('.svc-deliverables li').length,
      faqs: document.querySelectorAll('.faq-item').length,
      workflow: document.querySelectorAll('.wf-step').length,
      crumbs: document.querySelectorAll('.crumbs').length,
      switch: document.querySelectorAll('.svc-switch-link').length,
    }));
    if (r.outcomes < 3 || r.deliverables < 4 || r.faqs < 2 || r.workflow !== 5 || r.switch !== 2) {
      thin.push(`${slug} ${JSON.stringify(r)}`);
    }
  }
  checks.thinServicePages = thin;
  await page.close();
  expect(`every service page is complete (${JSON.stringify(thin)})`, thin.length === 0);
}

/* --- 5. /work: the full grid, filtering, and every card links out --------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`${BASE}/work`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.waitForTimeout(1500);

  for (let i = 0; i < 4; i++) {
    const more = page.locator('.btn-more');
    if (await more.count()) { await more.click(); await page.waitForTimeout(700); } else break;
  }
  checks.workCards = await page.locator('.proj').count();
  checks.workCardsLinked = await page.locator('a.proj').count();
  checks.workRealShots = await page.locator('.bw-view img').count();

  const ecom = page.getByRole('tab', { name: /^E-Commerce/ });
  if (await ecom.count()) {
    await ecom.click();
    await page.waitForTimeout(900);
    checks.workAfterFilter = await page.locator('.proj').count();
  }
  await page.close();

  expect(`/work renders all ${EXPECTED_PROJECTS} projects`, checks.workCards === EXPECTED_PROJECTS);
  expect('/work: every card links out', checks.workCardsLinked === checks.workCards);
  expect('/work: most cards show a real screenshot', checks.workRealShots >= EXPECTED_PROJECTS - 8);
  expect('/work: the category filter narrows the grid',
    checks.workAfterFilter > 0 && checks.workAfterFilter < EXPECTED_PROJECTS);
}

/* --- 6. reduced motion and no-JavaScript, on the two richest pages -------- */
for (const route of ['/', '/services/ai-agents']) {
  const still = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const sp = await still.newPage();
  await sp.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  await sp.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80));
    }
  });
  await sp.waitForTimeout(1000);
  const strandedStill = await sp.evaluate(() =>
    [...document.querySelectorAll('main *')].filter(
      (el) => getComputedStyle(el).opacity === '0' &&
        el.getBoundingClientRect().height > 20 &&
        !el.closest('[aria-hidden="true"]') &&
        !el.classList.contains('proj-go') && !el.classList.contains('hp'),
    ).length);
  await still.close();
  expect(`${route} reduced motion strands nothing`, strandedStill === 0);

  const noJs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const np = await noJs.newPage();
  await np.goto(`${BASE}${route}`, { waitUntil: 'load' });
  const hiddenNoJs = await np.$$eval('main *', (els) =>
    els.filter((el) => {
      const s = getComputedStyle(el);
      if (s.opacity !== '0') return false;
      if (el.getBoundingClientRect().height <= 20) return false;
      if (el.closest('[aria-hidden="true"]')) return false;
      return !el.classList.contains('proj-go') && !el.classList.contains('hp');
    }).length);
  const headings = await np.locator('main h2').count();
  await noJs.close();
  expect(`${route} is readable without JavaScript`, hiddenNoJs === 0);
  expect(`${route} renders headings without JavaScript`, headings >= 1);
}

/* --- 7. mobile: no horizontal overflow anywhere --------------------------- */
{
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mp = await mobile.newPage();
  const overflowing = [];
  for (const route of ROUTES) {
    await mp.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    await mp.waitForTimeout(700);
    const over = await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (over) overflowing.push(route);
  }
  await mp.screenshot({ path: `${OUT}/mobile-home.png` });
  await mobile.close();
  checks.mobileOverflow = overflowing;
  expect(`no route scrolls sideways on mobile (${JSON.stringify(overflowing)})`, overflowing.length === 0);
}

await browser.close();

console.log(JSON.stringify(
  { ...checks, expected: { projects: EXPECTED_PROJECTS, featured: EXPECTED_FEATURED, services: SERVICE_SLUGS.length } },
  null, 2,
));

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nAll checks passed across ${ROUTES.length} routes.`);
