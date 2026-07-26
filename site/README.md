# docs.aevumfinance.com — the Aevum documentation site

Astro SSG that publishes this repo's docs as a real site (T-docs-site / B23). Part of
the Aevum ecosystem: it ports aevum-web's Tailwind v4 token layer + theme/a11y system,
so it looks and behaves like the app (light/dark/system + reduce-motion, high-contrast,
underline-links, always-show-focus).

## What it publishes

| Route | Source | |
|---|---|---|
| `/` | landing — hero search + topic index (D9) | |
| `/<topic>` | `docs/public/<topic>.md` (T0) | 12 product topics |
| `/engineering/…` | `docs/internal/**` (T1 mirror) | MIRROR.md excluded |
| `/manual` + `/manual/user_manual.pdf` | the T0 topics as one page + the committed PDF | |
| `/data/…` | stats, per-lane sidecars, benchmarks, `docs-index.json`, `screenshots.json` | public contract, CORS `*` |

## Run it locally

```bash
cd site
npm install
npm run dev        # dev server (hot reload) on http://localhost:4321
# or, to test the real production output:
npm run build && npm run preview
```

The build is **self-contained** — it reads the docs, the `/data` sidecars, the committed
manual PDF, and the committed mermaid SVGs, all from this repo. No lane checkout, no
network, no browser. That's why Cloudflare Pages can build it in isolation.

## Build pipeline (`npm run build`)

1. `scripts/gen-data.mjs` — stages images + brand marks + the PDF into `public/`, and
   generates the `/data` feed contract + the `docs-index.json` search index.
2. `astro build` — with two markdown plugins: `remark-mermaid` (swaps ```mermaid fences
   for committed SVGs; missing = build fail) and `rehype-doc-links` (the D4 link
   classification gate: rewrite published links → routes, degrade known-unpublished to
   text, **fail** on anything else).
3. `scripts/emit-csp.mjs` — derives the CSP `script-src` sha256 from the built HTML and
   appends it to `dist/_headers` (ported from aevum-web; fail-open).

Checks: `npm run mermaid:check` (every diagram has a committed SVG — puppeteer-free) and
`npm run check:data` (every `/data` feed honors its contract).

## Mermaid diagrams

Rendered to committed inline SVGs by `../tooling/render-mermaid.mjs` (needs puppeteer, so
it runs where the manual PDF is built — locally or in CI — never at CF build time). After
editing a ```mermaid diagram: `node ../tooling/render-mermaid.mjs` and commit
`docs/public/.mermaid/`.

## Deploy (Cloudflare Pages)

- Project root: this repo. **Build command:** `cd site && npm ci && npm run build`.
  **Output dir:** `site/dist`.
- Custom domain `docs.aevumfinance.com`. HSTS is set once at the CF edge
  (includeSubDomains covers this subdomain), exactly as aevum-web does.
- The repo stays **public**; no secret is in the tree.
