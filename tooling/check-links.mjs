// The fail-closed doc-link gate for the outer repo. A broken relative link is the
// one doc problem that is NOT regenerable — a human (or a generator) pointed at
// something that does not exist — so unlike mechanical drift (which CI folds), a
// broken link fails the build.
//
// Checks every relative Markdown link, image src/srcset, and #anchor across the
// AUTHORED doc surface, skipping http(s). Because this repo aggregates the lanes
// rather than tracking them, it links into neither — every relative link it
// publishes must resolve inside this clone, which is exactly what this asserts.
//
// Also skips docs/internal/ — the lane MIRROR. Those files are byte-faithful
// copies whose links point down into their own lane's internal/ tier, which the
// mirror deliberately does not carry (the tier boundary IS the publish boundary).
// They resolve at source, which is where they are edited; rewriting them here
// would break the mirror's faithfulness, and gating them would fail forever on
// links this repo neither owns nor can fix. The gate covers what we author.
//
//   node check-links.mjs            # report + exit 1 on any broken link
//   node check-links.mjs --quiet    # exit code only

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

// The doc surface: root docs + everything under docs/ and USER_GUIDE/.
function docFiles() {
  const out = [];
  for (const f of ['README.md', 'ARCHITECTURE.md', 'CONTRIBUTING.md', 'METRICS.md']) {
    if (existsSync(path.join(ROOT, f))) out.push(f);
  }
  const MIRROR = path.join(ROOT, 'docs', 'internal');
  for (const dir of ['docs', 'USER_GUIDE']) {
    const abs = path.join(ROOT, dir);
    if (!existsSync(abs)) continue;
    const walk = (d) => {
      if (d === MIRROR) return; // derived copy — see the header note
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.md')) out.push(path.relative(ROOT, p));
      }
    };
    walk(abs);
  }
  return out.sort();
}

const SKIP = (link) =>
  /^https?:/.test(link) || link.startsWith('#') || link.startsWith('mailto:');

function anchorsOf(text) {
  return [...text.matchAll(/^#+\s+(.+)$/gm)].map((h) =>
    h[1]
      .toLowerCase()
      .replace(/`/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  );
}

function check() {
  const broken = [];
  let total = 0;
  for (const rel of docFiles()) {
    const abs = path.join(ROOT, rel);
    const txt = readFileSync(abs, 'utf8');
    const dir = path.dirname(abs);

    // Markdown links [..](target#anchor)
    for (const m of txt.matchAll(/\]\(([^)\s]+?)(#[^)]+)?\)/g)) {
      const link = m[1];
      const anchor = m[2];
      if (link && SKIP(link)) continue;
      total++;
      if (link) {
        const target = path.resolve(dir, link);
        if (!existsSync(target)) {
          broken.push(`${rel} -> ${link}`);
          continue;
        }
        if (anchor && statSync(target).isFile() && target.endsWith('.md')) {
          if (!anchorsOf(readFileSync(target, 'utf8')).includes(anchor.slice(1))) {
            broken.push(`${rel} -> ${link}${anchor}`);
          }
        }
      } else if (anchor) {
        if (!anchorsOf(txt).includes(anchor.slice(1))) broken.push(`${rel} -> ${anchor}`);
      }
    }

    // Image src / srcset
    for (const m of txt.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
      const link = m[1];
      if (SKIP(link)) continue;
      total++;
      if (!existsSync(path.resolve(dir, link))) broken.push(`${rel} -> ${link} (image)`);
    }
  }
  return { broken, total };
}

const quiet = process.argv.slice(2).includes('--quiet');
const { broken, total } = check();
if (broken.length) {
  if (!quiet) {
    console.error(`Broken doc links (${broken.length}):`);
    for (const b of broken) console.error(`  - ${b}`);
  }
  process.exit(1);
}
if (!quiet) console.log(`Doc links OK — ${total} checked, 0 broken.`);
