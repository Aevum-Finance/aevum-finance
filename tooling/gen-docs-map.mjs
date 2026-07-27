// The DOCS PATH CONTRACT (T-docs-site). One generated file — docs/internal/docs-map.json
// — that is the single, authoritative enumeration of every PUBLISHED doc (product + both
// lanes' engineering) with its canonical location and URL.
//
// WHY it exists: the mirror (sync-docs.mjs) is a DUMB, deterministic, byte-and-path-faithful
// copy — it knows nothing about routes or which docs are published. Every consumer (this
// site's routing + link resolver + search index, and downstream: the personal site,
// marketing) would otherwise re-derive "what is published and where does it live" from the
// mirror's internal layout — the same fragile logic smeared across files and repos. This
// contract makes that mapping EXPLICIT and single-sourced: change a path or the publish set
// once here, and every consumer follows; `--check` turns silent drift into a failed build.
//
// Each entry carries only SHARED FACTS — where the bytes live (`source`, relative to docs/),
// the canonical published URL (`route`), the title, and curation order. How a given consumer
// re-hosts or styles a doc is ITS concern and never enters the contract.
//
// The PUBLISHED engineering set is retain-by-difference: the curated "how it works" mechanics
// docs the lanes author under public/engineering/ (mirrored to internal/<lane>/public/
// engineering/**) PLUS the retained cross-cutting T1 (architecture, performance). The shallow
// per-module retellings under <lane>/public/*.md are NOT published — they just re-tell T0.
//
// Reads only committed files (the mirror + product docs) — NO lane access — so unlike
// sync-docs it runs in the fork-safe `check` gate. Deterministic; folded by docs.yml after
// the mirror, alongside the other derived docs.
//
//   node gen-docs-map.mjs           # write docs/internal/docs-map.json
//   node gen-docs-map.mjs --check   # exit 1 if the committed contract is stale

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { parseToml } from './toml-lite.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DOCS = path.join(ROOT, 'docs');
const INTERNAL = path.join(DOCS, 'internal');
const PUBLIC = path.join(DOCS, 'public');
const OUT = path.join(INTERNAL, 'docs-map.json');

const LANES = ['backend', 'frontend'];

// --- helpers -------------------------------------------------------------

// docs/-relative POSIX path — the stable `source` key every consumer resolves against.
const srcOf = (abs) => path.relative(DOCS, abs).split(path.sep).join('/');

function firstHeading(md, fallback) {
  const m = md.match(/^#\s+(.+?)\s*$/m); // the mirror stamp is an HTML comment, so /m still finds the H1
  return m ? m[1].replace(/[#*`]/g, '').trim() : fallback;
}

// Reading order within a lane: overview first, deep dives in the middle, the retained
// cross-cutting references last. Single-sourced here; the site sorts on the `order` field.
function rank(doc) {
  if (doc === 'readme') return 0;
  if (doc === 'architecture') return 8;
  if (doc === 'performance') return 9;
  return 4;
}

function listMd(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md')) out.push(p);
    }
  };
  if (existsSync(dir)) walk(dir);
  return out;
}

// --- build ---------------------------------------------------------------

function buildEngineering() {
  const docs = [];
  for (const lane of LANES) {
    const seen = new Set();
    const push = (abs) => {
      const doc = path.basename(abs, '.md').toLowerCase();
      if (seen.has(doc)) return;
      seen.add(doc);
      const id = `${lane}/${doc}`;
      const md = readFileSync(abs, 'utf8');
      docs.push({
        lane,
        id,
        source: srcOf(abs),
        route: `/engineering/${id}`,
        title: firstHeading(md, doc),
        order: rank(doc),
      });
    };
    // curated "how it works" set
    for (const abs of listMd(path.join(INTERNAL, lane, 'public', 'engineering'))) push(abs);
    // retained cross-cutting T1
    for (const doc of ['architecture', 'performance']) {
      const abs = path.join(INTERNAL, lane, `${doc}.md`);
      if (existsSync(abs)) push(abs);
    }
  }
  // Deterministic: lane order, then curation order, then id.
  const laneRank = (l) => LANES.indexOf(l);
  return docs.sort(
    (a, b) => laneRank(a.lane) - laneRank(b.lane) || a.order - b.order || a.id.localeCompare(b.id)
  );
}

function buildProduct() {
  const topics = parseToml(readFileSync(path.join(ROOT, 'tooling', 'product-features.toml'), 'utf8')).topics ?? {};
  const out = [];
  let order = 0;
  for (const [key, meta] of Object.entries(topics)) {
    const abs = path.join(PUBLIC, `${key}.md`);
    if (!existsSync(abs)) continue;
    out.push({
      key,
      source: srcOf(abs),
      route: `/${key}`,
      title: meta.title ?? firstHeading(readFileSync(abs, 'utf8'), key),
      order: order++,
    });
  }
  return out;
}

function build() {
  return {
    generatedBy: 'tooling/gen-docs-map.mjs',
    product: buildProduct(),
    engineering: buildEngineering(),
  };
}

const serialize = (map) => JSON.stringify(map, null, 2) + '\n';

// --- entry ---------------------------------------------------------------

function main() {
  const check = process.argv.includes('--check');
  const next = serialize(build());
  if (check) {
    const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (cur !== next) {
      console.error('Stale docs contract: docs/internal/docs-map.json — run `npm run docs:map`.');
      process.exit(1);
    }
    console.log('docs contract in sync.');
    return;
  }
  writeFileSync(OUT, next);
  const m = build();
  console.log(`Wrote docs-map.json — ${m.product.length} product + ${m.engineering.length} engineering docs.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

export { build };
