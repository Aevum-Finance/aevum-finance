// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rehypeDocLinks } from './src/lib/rehype-doc-links.mjs';
import { remarkMermaid } from './src/lib/remark-mermaid.mjs';

// The subdomain is the contract (T-docs-site D2); the host is swappable. Absolute
// URLs in the sitemap + the /data feeds resolve against this.
const SITE = 'https://docs.aevumfinance.com';
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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
    // D5 — swap mermaid fences for committed SVGs (before shiki sees them).
    remarkPlugins: [[remarkMermaid, { repoRoot: REPO_ROOT }]],
    // D4 link classification gate — fail-closed on any unresolvable link.
    rehypePlugins: [[rehypeDocLinks, { repoRoot: REPO_ROOT }]],
  },
  build: {
    // Keep styles in external files (hashable under style-src) rather than inlined,
    // matching aevum-web's posture.
    inlineStylesheets: 'never',
  },
});
