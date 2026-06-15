// Builds USER_GUIDE/user_manual.pdf — a single, marketable PDF that consolidates
// the topic-wise user-guide docs (in the same logical order as USER_GUIDE/
// README.md) with a generated cover, table of contents, page numbers, rendered
// Mermaid diagrams, and embedded screenshots. No intermediate .md is kept — the
// concatenation happens in memory.
//
// Usage:  npm install && npm run manual   (from docs-tooling/)
// Output: USER_GUIDE/user_manual.pdf
//
// Requires the screenshots referenced by the docs to exist under
// USER_GUIDE/images/ — until they're captured, those spots render as broken
// image icons (everything else is complete).

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { marked } from 'marked';
import puppeteer from 'puppeteer';

import { loadBranding } from './branding.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const USER_GUIDE = path.resolve(HERE, '../USER_GUIDE');
const OUT = path.join(USER_GUIDE, 'user_manual.pdf');

// Reading order — mirrors USER_GUIDE/README.md (Start here → Everyday use).
const ORDER = [
  'getting-started',
  'consumption-tax',
  'savings-account',
  'transactions',
  'beneficiaries',
  'categories-and-rules',
  'budgets',
  'recurring',
  'importing-statements',
  'account-and-security',
  'your-data-and-privacy',
];

// Mermaid fences → <div class="mermaid"> blocks (marked passes block HTML
// through verbatim); mermaid.run() renders them in the headless browser.
function inlineMermaid(md) {
  return md.replace(
    /```mermaid\s*\n([\s\S]*?)```/g,
    (_, body) => `<div class="mermaid">\n${body.trim()}\n</div>`
  );
}

function firstHeading(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

function coverHtml(brand) {
  return `<section class="cover">
    <div class="cover-name">${escapeHtml(brand.name)}</div>
    <div class="cover-tagline">${escapeHtml(brand.tagline)}</div>
    <p class="cover-desc">${escapeHtml(brand.description)}</p>
    <div class="cover-label">User Manual</div>
  </section>`;
}

function tocHtml(items) {
  const rows = items
    .map(
      (it, i) =>
        `<li><span class="toc-num">${i + 1}</span><span class="toc-title">${escapeHtml(
          it.title
        )}</span></li>`
    )
    .join('\n');
  return `<section class="toc"><h2>Contents</h2><ol>${rows}</ol></section>`;
}

function escapeHtml(s) {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );
}

async function main() {
  const brand = await loadBranding();

  const docs = [];
  for (const slug of ORDER) {
    const raw = await readFile(path.join(USER_GUIDE, `${slug}.md`), 'utf8');
    docs.push({ slug, title: firstHeading(raw, slug), html: marked.parse(inlineMermaid(raw)) });
  }

  const body = docs
    .map((d) => `<section class="doc">${d.html}</section>`)
    .join('\n<div class="page-break"></div>\n');

  const theme = await readFile(path.join(HERE, 'theme.css'), 'utf8');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<style>${theme}</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
</head><body>
${coverHtml(brand)}
<div class="page-break"></div>
${tocHtml(docs)}
<div class="page-break"></div>
${body}
</body></html>`;

  // Write the HTML into USER_GUIDE so relative image paths (images/…) resolve,
  // then point the browser at it via file:// and capture.
  const tmp = await mkdtemp(path.join(tmpdir(), 'aevum-manual-'));
  const htmlPath = path.join(USER_GUIDE, '.manual.tmp.html');
  await writeFile(htmlPath, html, 'utf8');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    // Render Mermaid to static SVG before printing (avoids an async race).
    await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      window.mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
      // eslint-disable-next-line no-undef
      await window.mermaid.run();
    });
    await page.pdf({
      path: OUT,
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '20mm', left: '16mm', right: '16mm' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;font-size:8px;color:#94a3b8;text-align:center;">${escapeHtml(
        brand.name
      )} — User Manual · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
    });
    console.log(`Wrote ${OUT}`);
  } finally {
    await browser.close();
    await rm(htmlPath, { force: true });
    await rm(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
