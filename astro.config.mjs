// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export const SITE_URL = 'https://ghamaypepito.com';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // Cloudflare Pages serves directory routes with a trailing slash and 308s
  // anything without one. Matching that here keeps internal links, canonicals
  // and the sitemap in agreement, so no internal click costs a redirect.
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
  image: {
    // Screenshots are pre-optimised by scripts/optimize-shots.mjs, so the
    // build-time service only handles the handful of editorial images.
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
