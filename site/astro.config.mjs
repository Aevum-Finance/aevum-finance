// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The subdomain is the contract (T-docs-site D2); the host is swappable. Absolute
// URLs in the sitemap + the /data feeds resolve against this.
const SITE = 'https://docs.aevumfinance.com';

export default defineConfig({
  site: SITE,
  // Tailwind v4 via the SAME vite plugin aevum-web uses, so the ported token layer
  // in src/styles/global.css yields pixel-consistent surfaces (T-docs-site D10).
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      // T1 (engineering) gets a lower crawl priority than the product docs.
      serialize(item) {
        if (item.url.includes('/engineering/')) item.priority = 0.4;
        return item;
      },
    }),
  ],
  markdown: {
    // Shiki runs at BUILD time → highlighted code is static HTML, no client script,
    // so it needs no CSP script-src exception (D7). Dual themes track light/dark.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  build: {
    // Keep styles in external files (hashable under style-src) rather than inlined,
    // matching aevum-web's posture.
    inlineStylesheets: 'never',
  },
});
