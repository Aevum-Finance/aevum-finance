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
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// puppeteer is imported lazily (only when rendering) so `--check` — the coverage
// gate — runs anywhere, including a puppeteer-free CF build.

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(HERE, '../docs/public');
const OUT = path.join(PUBLIC, '.mermaid');
const FENCE = /```mermaid\s*\n([\s\S]*?)```/g;

export function mermaidHash(src) {
  return createHash('sha256').update(src.trim()).digest('hex').slice(0, 16);
}

function collectDiagrams() {
  const map = new Map(); // hash -> source
  for (const name of readdirSync(PUBLIC)) {
    if (!name.endsWith('.md')) continue;
    const md = readFileSync(path.join(PUBLIC, name), 'utf8');
    for (const m of md.matchAll(FENCE)) {
      const src = m[1].trim();
      map.set(mermaidHash(src), src);
    }
  }
  return map;
}

const check = process.argv.includes('--check');
const diagrams = collectDiagrams();

if (check) {
  const missing = [...diagrams.keys()].filter((h) => !existsSync(path.join(OUT, `${h}.svg`)));
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
  await page.evaluate(() => window.mermaid.initialize({ startOnLoad: false, theme: 'neutral' }));

  let n = 0;
  for (const [hash, src] of diagrams) {
    const svg = await page.evaluate(async (code) => {
      const { svg } = await window.mermaid.render('m' + Math.random().toString(36).slice(2), code);
      return svg;
    }, src);
    // Strip the fixed max-width mermaid injects so the diagram scales to the column.
    const cleaned = svg.replace(/style="max-width:[^"]*"/, 'style="max-width:100%"');
    writeFileSync(path.join(OUT, `${hash}.svg`), cleaned + '\n');
    n++;
  }
  console.log(`[render-mermaid] rendered ${n} diagram(s) → docs/public/.mermaid/`);
} finally {
  await browser.close();
}
