/**
 * Visual + behavioural smoke test against a running dev/preview server.
 * Captures section screenshots and reports console errors, so a regression
 * shows up as an image rather than a guess.
 *
 *   node scripts/verify.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] || 'http://localhost:4321';
const OUT = '_gen/verify';

const SHOTS = [
  ['01-hero', 0],
  ['02-manifesto', '.manifesto'],
  ['03-services', '#services'],
  ['04-portfolio', '#work'],
  ['05-experience', '#about'],
  ['06-quotes', '.quotes'],
  ['07-contact', '#contact'],
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
// Turn off smooth scrolling so each capture lands where it was told to.
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });

for (const [name, target] of SHOTS) {
  if (typeof target === 'number') {
    await page.evaluate((y) => window.scrollTo(0, y), target);
  } else {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    }, target);
  }
  // Let reveals, lazy images and islands settle.
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

// Behavioural checks that a screenshot cannot show.
const checks = {};
await page.evaluate(() => window.scrollTo(0, document.querySelector('#work').offsetTop));
await page.waitForTimeout(1200);

checks.projectCards = await page.locator('.proj').count();
checks.realScreenshots = await page.locator('.bw-view img').count();
checks.fallbackTiles = await page.locator('.bw-fallback').count();

// Filter interaction.
await page.getByRole('tab', { name: /^E-Commerce/ }).click();
await page.waitForTimeout(900);
checks.afterEcommerceFilter = await page.locator('.proj').count();
await page.screenshot({ path: `${OUT}/08-filtered.png` });

await page.getByRole('tab', { name: /^All/ }).click();
await page.waitForTimeout(700);

// Command palette.
await page.keyboard.press('Meta+k');
await page.waitForTimeout(600);
checks.paletteOpen = await page.locator('[role="dialog"]').isVisible().catch(() => false);
if (checks.paletteOpen) {
  await page.keyboard.type('proshade');
  await page.waitForTimeout(500);
  checks.paletteResults = await page.locator('.cmdk-item').count();
  await page.screenshot({ path: `${OUT}/09-palette.png` });
  await page.keyboard.press('Escape');
}

// Reveal coverage — nothing should still be invisible after a full pass.
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 90));
  }
});
await page.waitForTimeout(900);
checks.revealsTotal = await page.locator('[data-reveal]').count();
checks.revealsShown = await page.locator('[data-reveal].is-in').count();

/* Reduced-motion pass. The failure mode this guards against is an element
   that starts hidden for an entrance animation and is never told to arrive,
   leaving content permanently invisible for anyone who opts out of motion. */
const still = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
await still.goto(BASE, { waitUntil: 'networkidle' });
await still.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 80));
  }
});
await still.waitForTimeout(1200);
const stranded = await still.evaluate(() =>
  [...document.querySelectorAll('main *')]
    .filter((el) => {
      const s = getComputedStyle(el);
      return (
        s.opacity === '0' &&
        el.getBoundingClientRect().height > 20 &&
        !el.closest('[aria-hidden="true"]')
      );
    })
    .map((el) => String(el.className || el.tagName).slice(0, 40)),
);
checks.reducedMotionInvisible = stranded.length;
checks.reducedMotionInvisibleSample = stranded.slice(0, 6);
checks.reducedMotionCards = await still.locator('.proj').count();
await still.close();

// Mobile pass.
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await mobile.goto(BASE, { waitUntil: 'networkidle' });
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: `${OUT}/10-mobile-hero.png` });
await mobile.evaluate(() => window.scrollTo(0, document.querySelector('#work').offsetTop));
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: `${OUT}/11-mobile-work.png` });
checks.mobileOverflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 1,
);

await browser.close();

console.log(JSON.stringify(checks, null, 2));
console.log(errors.length ? `\nConsole errors:\n${errors.join('\n')}` : '\nNo console errors.');

/* Assertions. These are what make this a test rather than a screenshot run. */
const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('portfolio grid rendered its first page of cards', checks.projectCards === 12);
expect('most cards show a real screenshot', checks.realScreenshots >= 8);
expect('category filter narrowed the grid', checks.afterEcommerceFilter > 0 && checks.afterEcommerceFilter < 12);
expect('command palette opened on Cmd-K', checks.paletteOpen === true);
expect('command palette searched projects', (checks.paletteResults ?? 0) >= 1);
expect('every scroll reveal became visible', checks.revealsShown === checks.revealsTotal);
expect('mobile layout does not scroll horizontally', checks.mobileOverflow === false);
expect('no console errors', errors.length === 0);
expect(
  `nothing is stranded invisible under prefers-reduced-motion (${JSON.stringify(checks.reducedMotionInvisibleSample)})`,
  checks.reducedMotionInvisible === 0,
);
expect('project cards render under reduced motion', checks.reducedMotionCards === 12);

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\nAll checks passed.');
