// Fills the GENERATED marked regions in the outer repo's assembled docs
// (ARCHITECTURE.md) from the substrate, so the deterministic parts stay fresh
// without hand-editing while the authored prose around them is never touched.
//
// Two regions in ARCHITECTURE.md:
//   <!-- BEGIN GENERATED:feature-index --> — the product-topic table (feature-index)
//   <!-- BEGIN GENERATED:module-tree -->    — the combined backend ∥ frontend top-level
//                                             tree, from each lane's mirrored tree
//                                             annotations (BE toml, FE json)
//
//   node inject-outer.mjs           # refresh the regions
//   node inject-outer.mjs --check   # exit 1 if any region is stale

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build as buildRoster, renderTable } from './feature-index.mjs';
import { parseToml } from './toml-lite.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const MIRROR = path.join(ROOT, 'docs', 'internal');
const ARCH = path.join(ROOT, 'ARCHITECTURE.md');

const TREE = {
  backend: path.join(MIRROR, 'backend', 'tree.annotations.toml'),
  frontend: path.join(MIRROR, 'frontend', 'tree.annotations.json'),
};

// --- tree rendering ------------------------------------------------------

// Each lane's annotations normalize to { root, entries: [{name, note}] } in
// declaration order. The FE view honours show:false (kept out of the top-level
// map but still coverage-checked upstream in its own lane).
function loadTree(kind) {
  if (kind === 'backend') {
    const t = parseToml(readFileSync(TREE.backend, 'utf8'));
    return { root: t.root, entries: Object.entries(t.entries).map(([name, note]) => ({ name, note })) };
  }
  const j = JSON.parse(readFileSync(TREE.frontend, 'utf8'));
  const entries = Object.entries(j.entries)
    .filter(([, v]) => v.show !== false)
    .map(([name, v]) => ({ name, note: v.note }));
  return { root: j.root, entries };
}

function renderTree() {
  const lanes = [
    { title: 'Backend', ...loadTree('backend') },
    { title: 'Frontend', ...loadTree('frontend') },
  ];
  const blocks = lanes.map((lane) => {
    const lines = [`**${lane.title} — \`${lane.root}/\`**`, ''];
    for (const e of lane.entries) lines.push(`- \`${e.name}\` — ${e.note}`);
    return lines.join('\n');
  });
  return `${blocks.join('\n\n')}\n`;
}

// --- region injection ----------------------------------------------------

const REGIONS = {
  'feature-index': () => renderTable(buildRoster()),
  'module-tree': () => renderTree(),
};

function inject(content, key, body) {
  const begin = `<!-- BEGIN GENERATED:${key} -->`;
  const end = `<!-- END GENERATED:${key} -->`;
  const b = content.indexOf(begin);
  const e = content.indexOf(end);
  if (b === -1 || e === -1) {
    throw new Error(`ARCHITECTURE.md is missing the ${key} region markers.`);
  }
  const block = `${begin}\n\n${body.replace(/\n*$/, '')}\n\n${end}`;
  return content.slice(0, b) + block + content.slice(e + end.length);
}

function run({ check }) {
  const current = readFileSync(ARCH, 'utf8');
  let next = current;
  for (const [key, render] of Object.entries(REGIONS)) {
    next = inject(next, key, render());
  }
  if (check) {
    if (next !== current) {
      console.error('ARCHITECTURE.md generated regions are stale — run `npm run outer`.');
      process.exit(1);
    }
    console.log('ARCHITECTURE.md generated regions in sync.');
    return;
  }
  if (next !== current) {
    writeFileSync(ARCH, next, 'utf8');
    console.log('Refreshed ARCHITECTURE.md generated regions.');
  } else {
    console.log('ARCHITECTURE.md generated regions already fresh.');
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run({ check: process.argv.slice(2).includes('--check') });
}

export { renderTree };
