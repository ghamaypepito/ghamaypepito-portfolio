/**
 * Renders the 1200x630 Open Graph card to public/og.png.
 *
 * Satori lays the card out with flexbox and embeds the fonts as outlines, so
 * the SVG it returns is self-contained and sharp can rasterise it directly.
 *
 *   npm run og
 */
import satori from 'satori';
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const BG = '#1b1f2b';
const PANEL = '#222838';
const ACCENT = '#f2b33d';
const TEXT = '#f4f5f8';
const MUTED = '#8a93a8';

const sora = await readFile(join(ROOT, 'public/fonts/sora-variable.woff2'));
const manrope = await readFile(join(ROOT, 'public/fonts/manrope-variable.woff2'));

// Satori needs static font tables; woff2 variable fonts are not supported, so
// fetch the static instances it can parse.
async function staticFont(family, weight) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
    { headers: { 'user-agent': 'Mozilla/5.0' } },
  ).then((r) => r.text());
  const url = css.match(/https:\/\/fonts\.gstatic\.com[^)]+\.ttf/)?.[0]
    ?? css.match(/https:\/\/fonts\.gstatic\.com[^)]+\.woff2/)?.[0];
  if (!url) throw new Error(`Could not resolve a font file for ${family} ${weight}`);
  return Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
}

const el = (type, props, ...children) => ({
  type,
  props: { ...props, children: children.length > 1 ? children : children[0] },
});

const card = el(
  'div',
  {
    style: {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: BG,
      padding: 72,
      fontFamily: 'Manrope',
      position: 'relative',
    },
  },
  // Amber wash in the top-right, echoing the hero.
  el('div', {
    style: {
      position: 'absolute',
      top: -260,
      right: -180,
      width: 700,
      height: 700,
      borderRadius: 9999,
      background: 'radial-gradient(circle, rgba(242,179,61,0.20), rgba(27,31,43,0))',
    },
  }),
  el(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: 18 } },
    el(
      'div',
      {
        style: {
          width: 60,
          height: 60,
          borderRadius: 16,
          background: PANEL,
          border: `1px solid rgba(255,255,255,0.08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          fontFamily: 'Sora',
          fontWeight: 800,
          color: ACCENT,
        },
      },
      'G',
    ),
    el(
      'div',
      {
        style: {
          fontFamily: 'Sora',
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: MUTED,
        },
      },
      'Cebu City, Philippines',
    ),
  ),
  el(
    'div',
    { style: { display: 'flex', flexDirection: 'column' } },
    el(
      'div',
      {
        style: {
          fontFamily: 'Sora',
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -3.5,
          color: TEXT,
          lineHeight: 1.02,
          display: 'flex',
        },
      },
      'Ghamay Pepito',
      el('span', { style: { color: ACCENT } }, '.'),
    ),
    el('div', {
      style: { width: 92, height: 8, borderRadius: 4, background: ACCENT, marginTop: 26 },
    }),
    el(
      'div',
      {
        style: {
          fontFamily: 'Sora',
          fontSize: 32,
          fontWeight: 600,
          color: '#7a8296',
          marginTop: 30,
          lineHeight: 1.3,
          display: 'flex',
        },
      },
      'Website Designer, Developer & Digital Marketing Manager',
    ),
  ),
  el(
    'div',
    { style: { display: 'flex', gap: 44, alignItems: 'center' } },
    ...[
      ['12+', 'Years'],
      ['38', 'Projects'],
      ['40+', 'Brands'],
    ].map(([value, label]) =>
      el(
        'div',
        { style: { display: 'flex', alignItems: 'baseline', gap: 10 } },
        el(
          'div',
          { style: { fontFamily: 'Sora', fontSize: 42, fontWeight: 800, color: ACCENT } },
          value,
        ),
        el(
          'div',
          {
            style: {
              fontFamily: 'Sora',
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: MUTED,
            },
          },
          label,
        ),
      ),
    ),
  ),
);

const svg = await satori(card, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Sora', data: await staticFont('Sora', 800), weight: 800, style: 'normal' },
    { name: 'Sora', data: await staticFont('Sora', 600), weight: 600, style: 'normal' },
    { name: 'Manrope', data: await staticFont('Manrope', 500), weight: 500, style: 'normal' },
  ],
});

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(join(ROOT, 'public/og.png'), png);
console.log(`public/og.png — ${(png.length / 1024).toFixed(1)} kB`);

// Silence the unused-import lint for the self-hosted variable fonts, which are
// kept here only to document that the card uses the same typefaces as the site.
void sora; void manrope;
