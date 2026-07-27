/*
 * Pre-build step (T-docs-site D6/D8): stages everything the self-contained CF Pages
 * build needs out of the in-repo docs — brand marks, doc images, the committed
 * manual PDF, the /data feed contract, and the search index. Runs BEFORE `astro
 * build` (see package.json). No lane checkout, no network.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';

import { parseToml } from '../../tooling/toml-lite.mjs';
import { engineeringDocs } from '../src/lib/docs-map.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..');
const REPO = path.resolve(HERE, '../..');
const OUT = path.join(SITE, 'public');
const DATA = path.join(OUT, 'data');

const R = (...p) => path.join(REPO, ...p);
const P = (...p) => path.join(OUT, ...p);

function writeJson(file, obj) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
}
function copy(src, dest) {
  if (!existsSync(src)) {
    console.warn(`[gen-data] skip (missing): ${path.relative(REPO, src)}`);
    return false;
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  return true;
}
function tomlToJson(src, dest) {
  if (!existsSync(src)) return false;
  writeJson(dest, parseToml(readFileSync(src, 'utf8')));
  return true;
}

// ── 1. Static assets the site + rendered markdown reference ──────────────────
// Doc images (screenshots + brand banners) — markdown embeds them as `images/…`,
// rewritten to root-absolute `/images/…` by the rehype plugin.
rmSync(P('images'), { recursive: true, force: true });
copy(R('docs/public/images'), P('images'));

// Brand marks for the site chrome (self-origin — no CSP img-src addition).
const BRAND = R('docs/public/images/brand');
copy(path.join(BRAND, 'lockup.svg'), P('brand/lockup.svg'));
copy(path.join(BRAND, 'lockup-dark.svg'), P('brand/lockup-dark.svg')); // cream wordmark for dark
copy(path.join(BRAND, 'logo.svg'), P('brand/logo.svg'));
copy(path.join(BRAND, 'logo.svg'), P('brand/favicon.svg'));

// The committed manual PDF (built in CI where puppeteer lives; D5).
copy(R('USER_GUIDE/user_manual.pdf'), P('manual/user_manual.pdf'));

// ── 2. The /data feed contract (D6) ──────────────────────────────────────────
rmSync(DATA, { recursive: true, force: true });
mkdirSync(DATA, { recursive: true });

copy(R('aevum-stats.json'), path.join(DATA, 'aevum-stats.json'));
const stats = JSON.parse(readFileSync(R('aevum-stats.json'), 'utf8'));

// The docs PATH CONTRACT (docs-map.json) — republished verbatim so downstream consumers
// (personal site, marketing) resolve doc → canonical URL against the same single authority
// the site itself routes from, instead of re-deriving paths from the mirror layout.
copy(R('docs/internal/docs-map.json'), path.join(DATA, 'docs-map.json'));

// backend: stats.backend.json is JSON; modules/tree are TOML → normalise to JSON.
copy(R('docs/internal/backend/stats.backend.json'), path.join(DATA, 'backend/stats.json'));
tomlToJson(R('docs/internal/backend/modules.manifest.toml'), path.join(DATA, 'backend/modules.json'));
tomlToJson(R('docs/internal/backend/tree.annotations.toml'), path.join(DATA, 'backend/tree.json'));

// frontend: already JSON.
copy(R('docs/internal/frontend/stats.frontend.json'), path.join(DATA, 'frontend/stats.json'));
copy(R('docs/internal/frontend/modules.manifest.json'), path.join(DATA, 'frontend/modules.json'));
copy(R('docs/internal/frontend/tree.annotations.json'), path.join(DATA, 'frontend/tree.json'));

// benchmarks — PUBLISHED (T-docs-site Resolved-B). Carved from the stats feed so a
// downstream can fetch just the perf line.
for (const lane of ['backend', 'frontend']) {
  if (stats[lane]?.benchmark) {
    writeJson(path.join(DATA, lane, 'benchmarks.json'), {
      lane,
      as_of: stats.as_of ?? null,
      benchmark: stats[lane].benchmark,
    });
  }
}

// ── 3. screenshots.json (D6a) — a drift-safe manifest, not the bytes ─────────
const shotsDir = R('docs/public/images/screenshots');
if (existsSync(shotsDir)) {
  const files = readdirSync(shotsDir).filter((f) => f.endsWith('.png'));
  const scenes = new Map();
  for (const f of files) {
    const isDark = /-dark\.png$/.test(f);
    const scene = f.replace(/(-dark)?\.png$/, '');
    if (!scenes.has(scene)) scenes.set(scene, { scene, light: null, dark: null });
    scenes.get(scene)[isDark ? 'dark' : 'light'] = `/images/screenshots/${f}`;
  }
  const caption = (s) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  writeJson(
    path.join(DATA, 'screenshots.json'),
    [...scenes.values()]
      .filter((s) => s.light)
      .sort((a, b) => a.scene.localeCompare(b.scene))
      .map((s) => ({ scene: s.scene, caption: caption(s.scene), light: s.light, dark: s.dark }))
  );
}

// ── 4. docs-index.json (D8) — one index, three consumers ─────────────────────
function firstHeading(md, fallback) {
  const m = md.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[#*`]/g, '').trim() : fallback;
}
function summarise(md) {
  const body = md.replace(/^#\s+.+$/m, ''); // drop the H1
  for (const block of body.split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || t.startsWith('#') || t.startsWith('```') || t.startsWith('|') || t.startsWith('<')) continue;
    return t
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 180);
  }
  return '';
}
function headingsOf(md) {
  const slugger = new GithubSlugger();
  const out = [];
  for (const line of md.split('\n')) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (m) {
      const text = m[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
      out.push({ text, anchor: slugger.slug(text) });
    }
  }
  return out;
}
const index = [];
// Product (T0) in roster order.
const topics = parseToml(readFileSync(R('tooling/product-features.toml'), 'utf8')).topics ?? {};
for (const [key, meta] of Object.entries(topics)) {
  const file = R('docs/public', `${key}.md`);
  if (!existsSync(file)) continue;
  const md = readFileSync(file, 'utf8');
  index.push({
    slug: key,
    url: `/${key}`,
    title: meta.title ?? firstHeading(md, key),
    section: 'Product',
    summary: meta.blurb ?? summarise(md),
    headings: headingsOf(md),
  });
}
// Engineering — straight from the docs-map contract (the published set + routes +
// titles), so the index can never disagree with what the site actually routes. Each
// entry's prose is read from its contract `source` for the headings/summary.
for (const d of engineeringDocs) {
  const md = readFileSync(R('docs', d.source), 'utf8');
  index.push({
    slug: d.id,
    url: d.route,
    title: d.title,
    section: 'Engineering',
    summary: summarise(md),
    headings: headingsOf(md),
  });
}
writeJson(path.join(DATA, 'docs-index.json'), index);

console.log(
  `[gen-data] staged images + brand + PDF; /data feeds + ${index.length}-entry docs-index.`
);
