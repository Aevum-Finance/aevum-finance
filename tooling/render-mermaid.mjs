/*
 * Pre-render every ```mermaid diagram in the docs to a COMMITTED inline SVG
 * (docs/public/.mermaid/<hash>.svg), keyed by the trimmed source's sha256.
 *
 * WHY committed, not rendered at site-build time: mermaid needs a browser, and the
 * docs site is built by CF Pages WITHOUT one (and under a strict CSP that blocks the
 * mermaid CDN script anyway — T-docs-site D5/D7). So the browser step runs HERE, where
 * puppeteer already lives (beside build-manual.mjs, in CI), and the site just swaps the
 * fence for the committed SVG (remark-mermaid.mjs). Same source of truth as the PDF.
 *
 *   node render-mermaid.mjs           # (re)render changed diagrams
 *   node render-mermaid.mjs --check   # exit 1 if any fence lacks a committed SVG
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync , rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// puppeteer is imported lazily (only when rendering) so `--check` — the coverage
// gate — runs anywhere, including a puppeteer-free CF build.

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.resolve(HERE, '../docs');
const PUBLIC = path.join(DOCS, 'public');
// SVGs are content-addressed (hash of the source), so one store serves every doc.
const OUT = path.join(PUBLIC, '.mermaid');
const FENCE = /```mermaid\s*\n([\s\S]*?)```/g;

export function mermaidHash(src) {
  return createHash('sha256').update(src.trim()).digest('hex').slice(0, 16);
}

// Scan BOTH the product docs (docs/public) and the mirrored engineering docs
// (docs/internal/**), since both carry diagrams the site renders.
function collectDiagrams() {
  const map = new Map(); // hash -> source
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === '.mermaid') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md')) {
        for (const m of readFileSync(p, 'utf8').matchAll(FENCE)) {
          const src = m[1].trim();
          map.set(mermaidHash(src), src);
        }
      }
    }
  };
  walk(PUBLIC);
  walk(path.join(DOCS, 'internal'));
  return map;
}

const check = process.argv.includes('--check');
const diagrams = collectDiagrams();

// Each diagram is rendered in BOTH themes so the site can show the one that matches
// (neutral on light, dark on dark) instead of forcing every diagram onto a white card.
const VARIANTS = [
  ['', 'neutral'],
  ['.dark', 'dark'],
];

if (check) {
  const missing = [];
  for (const h of diagrams.keys())
    for (const [suffix] of VARIANTS)
      if (!existsSync(path.join(OUT, `${h}${suffix}.svg`))) missing.push(`${h}${suffix}`);
  if (missing.length) {
    console.error(`[render-mermaid] MISSING ${missing.length} SVG(s): ${missing.join(', ')}`);
    console.error('Run `node tooling/render-mermaid.mjs` and commit docs/public/.mermaid/.');
    process.exit(1);
  }
  console.log(`[render-mermaid] ok — ${diagrams.size} diagram(s) all have committed SVGs.`);
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
const puppeteer = (await import('puppeteer')).default;
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
try {
  const page = await browser.newPage();
  // Same mermaid + theme as build-manual.mjs, so the page and the PDF match.
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">
     <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
     </head><body></body></html>`,
    { waitUntil: 'networkidle0' }
  );
  let n = 0;
  for (const [hash, src] of diagrams) {
    for (const [suffix, theme] of VARIANTS) {
      await page.evaluate(
        (t) =>
          window.mermaid.initialize({
            startOnLoad: false,
            theme: t,
            // Transparent background so the theme-aware figure (cream / slate) shows
            // through in either mode instead of a baked-in white card. A consistent
            // system font (available in headless Chrome) makes measure == render, which
            // is what stops labels from clipping at the bottom of their box. Larger text
            // + roomier spacing keeps a top-to-bottom flow legible in a docs column.
            themeVariables: {
              fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif',
              fontSize: '15px',
              background: 'transparent',
            },
            flowchart: {
              // Keep mermaid's intrinsic max-width (don't force 100%) so a diagram
              // renders at its NATURAL size — a small TD chart stays small instead of
              // being magnified to fill the column. SVG <text> labels (htmlLabels off)
              // are centred by mermaid's own math and export cleanly, which is what
              // stops the bottom-clipping that foreignObject/HTML labels had.
              useMaxWidth: true,
              htmlLabels: false,
              padding: 10,
              nodeSpacing: 40,
              rankSpacing: 44,
            },
          }),
        theme
      );
      // Deterministic id (from the content hash, not random) so re-rendering an
      // unchanged diagram produces a byte-identical SVG — no churn, and the SVG store
      // is reproducible/diffable like every other generated artifact in this repo.
      const svg = await page.evaluate(
        async (code, id) => (await window.mermaid.render(id, code)).svg,
        src,
        `mm${hash}${suffix.replace('.', '_')}`
      );
      // Neutralise the baked-in `background-color` (mermaid emits it in the SVG's own
      // #id style, whose specificity beats an external `svg{}` rule) so the theme-aware
      // figure ground shows through in both light and dark. Mermaid's intrinsic
      // max-width is LEFT INTACT — it's what keeps each diagram at its natural size.
      //
      // Then give EDGE LABELS an opaque, figure-matching ground (canvas-subtle per
      // theme). Mermaid ships them as a 50%-opacity white rect, so an arrow line shows
      // straight through the text and it reads as "behind" the arrow. Document order
      // already stacks labels above edges — an opaque ground puts every label on top.
      const ground = theme === 'dark' ? '#0f172a' : '#f1ebdd';
      const cleaned = svg
        .replace(/background-color:\s*[^;}"']+/gi, 'background-color:transparent')
        .replace(/(\.edgeLabel(?:\s+rect)?\s*\{[^}]*?)background-color:transparent/g, `$1background-color:${ground}`)
        .replace(/(\.edgeLabel\s+rect\s*\{[^}]*?)opacity:[0-9.]+/g, '$1opacity:1')
        // The rect's PAINT is `fill` (background-color isn't valid on an SVG rect). The
        // dark theme fills it with a grey, not white, so match any value → figure ground.
        .replace(/(\.edgeLabel\s+rect\s*\{[^}]*?)fill:\s*[^;}]+/gi, `$1fill:${ground}`);
      writeFileSync(path.join(OUT, `${hash}${suffix}.svg`), cleaned + '\n');
      n++;
    }
  }
  console.log(`[render-mermaid] rendered ${n} SVG(s) (${diagrams.size} diagrams × 2 themes).`);

  // Invalidate Astro's content-layer cache. It keys on the .md source, which does NOT
  // change when only a diagram's SVG does — so without this a local rebuild silently
  // re-embeds the PREVIOUS SVG. The store lives in node_modules/.astro (outside .astro),
  // which is why `rm -rf .astro` alone doesn't cover it. CI builds are clean, so this
  // only matters for a local re-render, but it makes the pipeline honest.
  for (const dir of ['.astro', 'node_modules/.astro', 'node_modules/.vite']) {
    rmSync(path.join(HERE, '..', 'site', dir), { recursive: true, force: true });
  }
} finally {
  await browser.close();
}
