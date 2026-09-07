/**
 * Checks every outbound link on the built site, plus every in-page anchor.
 *
 *   node scripts/check-links.mjs [dist/index.html]
 *
 * Reports status per URL. Redirects are shown with their destination, since a
 * portfolio linking to a redirect chain is worth knowing about even when it
 * technically resolves.
 */
import { readFile } from 'node:fs/promises';

const FILE = process.argv[2] || 'dist/index.html';
const html = await readFile(FILE, 'utf8');

const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
const external = [...new Set(hrefs.filter((h) => /^https?:\/\//.test(h)))];
const anchors = [...new Set(hrefs.filter((h) => h.startsWith('#')))];
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));

console.log(`${external.length} external links, ${anchors.length} in-page anchors\n`);

// --- in-page anchors -------------------------------------------------------
const brokenAnchors = anchors.filter((a) => a !== '#top' && !ids.has(a.slice(1)));
console.log('In-page anchors:');
for (const a of anchors) {
  const ok = a === '#top' || ids.has(a.slice(1));
  console.log(`  ${ok ? 'ok  ' : 'MISS'} ${a}`);
}

// --- external --------------------------------------------------------------
async function check(url) {
  const attempt = async (method) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: ctrl.signal,
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      });
      return { status: res.status, final: res.url };
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    // Some hosts reject HEAD outright; fall back to GET before believing it.
    let r = await attempt('HEAD');
    if (r.status >= 400) r = await attempt('GET');
    return r;
  } catch (err) {
    return { status: 0, error: err instanceof Error ? err.message.split('\n')[0] : String(err) };
  }
}

const results = [];
const queue = [...external];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const url = queue.shift();
      if (!url) break;
      results.push({ url, ...(await check(url)) });
    }
  }),
);

results.sort((a, b) => a.url.localeCompare(b.url));

const ok = [];
const redirected = [];
const broken = [];
for (const r of results) {
  const sameHost = r.final && new URL(r.url).host.replace(/^www\./, '') ===
    new URL(r.final).host.replace(/^www\./, '');
  if (r.status >= 200 && r.status < 400) (sameHost ? ok : redirected).push(r);
  else broken.push(r);
}

console.log('\nExternal links:');
for (const r of results) {
  const mark = r.status >= 200 && r.status < 400 ? 'ok  ' : 'FAIL';
  const note = r.status ? r.status : r.error;
  console.log(`  ${mark} ${String(note).padEnd(28)} ${r.url}`);
}

if (redirected.length) {
  console.log('\nRedirects to a different host:');
  for (const r of redirected) console.log(`  ${r.url}\n      -> ${r.final}`);
}

console.log(
  `\n${ok.length + redirected.length}/${results.length} external links resolve` +
    `${redirected.length ? ` (${redirected.length} cross-host redirect)` : ''}.`,
);
if (broken.length) {
  console.log(`\n${broken.length} broken:`);
  for (const r of broken) console.log(`  ${r.url} — ${r.status || r.error}`);
}
if (brokenAnchors.length) console.log(`\nBroken anchors: ${brokenAnchors.join(', ')}`);
process.exitCode = broken.length || brokenAnchors.length ? 1 : 0;
