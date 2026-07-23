// Merges the two submodules' per-lane stats into the outer monorepo's single,
// publishable metrics surface:
//   - aevum-stats.json  — machine-readable, the downstream consumer's one pull point
//   - METRICS.md        — a curated, human-readable "by the numbers" view
//
// Both are GENERATED — do not hand-edit; edit this script (or the per-lane
// generators) instead. The per-lane stats files are deterministic (no volatile
// date/SHA); the publish date + submodule SHAs are stamped HERE only, at the
// merge — the single moment the numbers lock against each lane's pinned commit.
//
// Usage (from tooling/):
//   npm run stats            # write ../aevum-stats.json + ../METRICS.md
//   node merge-stats.mjs --stdout   # print the JSON, write nothing
//   node merge-stats.mjs --check    # exit 1 if the committed outputs are stale
//   AS_OF=2026-07-07 npm run stats  # pin the publish date (else today, UTC)

import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANE_DIR } from './lanes.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

const PATHS = {
  backend: path.join(LANE_DIR.backend, 'docs', 'stats.backend.json'),
  frontend: path.join(LANE_DIR.frontend, 'docs', 'stats.frontend.json'),
  json: path.join(ROOT, 'aevum-stats.json'),
  md: path.join(ROOT, 'METRICS.md'),
};

const NOTE = 'Canonical Aevum metrics — generated, do not hand-edit.';

// --- helpers -------------------------------------------------------------

const SHA_LEN = 8;
function shortSha(lane) {
  // The lane clone's current HEAD == the commit the outer pointer bump will pin.
  // Slice a FIXED-length prefix rather than `git --short`: git's auto length
  // abbreviates to the shortest unambiguous prefix, which varies with each
  // clone's object set — so a fresh clone can abbreviate the SAME commit to a
  // different length and falsely trip the --check drift gate. 8 chars matches
  // the canonical short handles used elsewhere (e.g. 95f83843).
  try {
    return execFileSync('git', ['-C', LANE_DIR[lane], 'rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).trim().slice(0, SHA_LEN);
  } catch {
    return null;
  }
}

function today() {
  // Plain Node run (not a sandboxed workflow) — Date is available.
  return new Date().toISOString().slice(0, 10);
}

// 12595 -> "12,595" (deterministic; avoids locale variance).
function group(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// gzip bytes -> "97.2 kB" (kB decimal, matching the FE framework's reading).
function kb(bytes) {
  return `${(bytes / 1000).toFixed(1)} kB`;
}

function round(n) {
  return Math.round(n);
}

// --- build ---------------------------------------------------------------

async function build({ asOf } = {}) {
  const backend = JSON.parse(await readFile(PATHS.backend, 'utf8'));
  const frontend = JSON.parse(await readFile(PATHS.frontend, 'utf8'));

  const source_refs = { backend: shortSha('backend'), frontend: shortSha('frontend') };
  const stamp = asOf || process.env.AS_OF || today();

  const merged = {
    note: NOTE,
    as_of: stamp,
    source_refs,
    // Lane blocks embedded verbatim — mechanical, deterministic, honest.
    backend,
    frontend,
    contract: {
      note: 'Stable paths a downstream consumer pulls at build time.',
      metrics:
        'aevum-stats.json (this file); per-lane detail in docs/internal/backend/stats.backend.json + docs/internal/frontend/stats.frontend.json',
      performance: ['docs/internal/backend/performance.md', 'docs/internal/frontend/performance.md'],
      screenshots: 'USER_GUIDE/images/screenshots/',
      authors: 'AUTHORS.md',
    },
  };

  const md = renderMd(merged);
  return { merged, md, json: `${JSON.stringify(merged, null, 2)}\n` };
}

// --- METRICS.md (curated headline view) ----------------------------------

function renderMd(m) {
  const be = m.backend;
  const fe = m.frontend;

  // Backend API latency — split the create write-path from the read GETs.
  const eps = be.benchmark?.api_latency?.endpoints ?? {};
  const reads = Object.entries(eps).filter(([k]) => k.startsWith('GET'));
  const createEp = Object.entries(eps).find(([k]) => k.includes('create'));
  const readP50s = reads.map(([, v]) => v.p50_ms);
  const readLo = readP50s.length ? round(Math.min(...readP50s)) : null;
  const readHi = readP50s.length ? round(Math.max(...readP50s)) : null;
  const createP50 = createEp ? round(createEp[1].p50_ms) : null;

  // Frontend Lighthouse — performance-score spread across the audited routes.
  const pages = fe.benchmark?.lighthouse?.pages ?? {};
  const perfScores = Object.values(pages).map((p) => p.performance);
  const lhLo = perfScores.length ? Math.min(...perfScores) : null;
  const lhHi = perfScores.length ? Math.max(...perfScores) : null;

  const bundle = fe.benchmark?.bundle ?? {};

  const lines = [
    '<!-- AUTO-GENERATED from aevum-stats.json by tooling/merge-stats.mjs — do not hand-edit. -->',
    '',
    '# Aevum — by the numbers',
    '',
    `_Generated ${m.as_of} · backend @ ${m.source_refs.backend} · frontend @ ${m.source_refs.frontend}._`,
    '',
    'Engineering metrics for Aevum, merged from each submodule’s per-lane stats. Full',
    'machine-readable detail in [`aevum-stats.json`](aevum-stats.json); per-lane sources in',
    '[`docs/internal/backend/stats.backend.json`](docs/internal/backend/stats.backend.json) and',
    '[`docs/internal/frontend/stats.frontend.json`](docs/internal/frontend/stats.frontend.json).',
    '',
    '## Scale',
    '',
    '| | Backend | Frontend |',
    '| --- | ---: | ---: |',
    `| Feature modules | ${be.counts.feature_modules} | ${fe.counts.feature_modules} |`,
    `| Tests | ${group(be.counts.tests)} | ${group(fe.counts.tests)} |`,
    `| Code lines (ex. blanks/comments) | ${group(be.sloc.total)} | ${group(fe.sloc.total)} |`,
    '',
    '## Backend — API & domain engine',
    '',
    `- **${be.counts.feature_modules} feature modules** · ${be.counts.db_models} data models · ` +
      `${be.counts.api_endpoints} REST endpoints (${be.counts.routers} routers) · ` +
      `${be.counts.scheduled_workers} scheduled workers`,
    `- **${group(be.counts.tests)} tests** (pytest) · complexity avg ${be.complexity.avg_cyclomatic} · ` +
      `maintainability grade A on ${be.complexity.maintainability_grade_a_pct}% of modules`,
    `- **${group(be.sloc.total)} SLOC** (${group(be.sloc.backend_app)} app / ${group(be.sloc.backend_tests)} tests)`,
    ...(createP50 != null && readLo != null
      ? [
          `- **API latency** (local/staging, concurrency ${be.benchmark.api_latency.environment.concurrency}): ` +
            `reads p50 ~${readLo}–${readHi} ms; create-transaction (full tax recalc) p50 ~${createP50} ms`,
        ]
      : []),
    '',
    '## Frontend — React SPA',
    '',
    `- **${fe.counts.feature_modules} feature modules** · ${group(fe.complexity.functions)} functions · ` +
      `**${group(fe.counts.tests)} tests** (vitest, ${fe.counts.test_files} files)`,
    `- **${group(fe.sloc.total)} SLOC** (${group(fe.sloc.frontend_src)} src / ${group(fe.sloc.frontend_tests)} tests)`,
    ...(bundle.entry_gzip_bytes
      ? [
          `- **Entry bundle ${kb(bundle.entry_gzip_bytes)}** gzip · ${kb(bundle.css_gzip_bytes)} CSS · ` +
            `${bundle.chunk_count} chunks`,
        ]
      : []),
    ...(lhLo != null
      ? [
          `- **Lighthouse** (mobile, slow-4G): performance ${lhLo}–${lhHi} across ` +
            `${perfScores.length} routes`,
        ]
      : []),
    '',
    '## Notes',
    '',
    'Tier-2 numbers (API latency, bundle sizes, Lighthouse) are **indicative, not contractual** —',
    'measured in a local/staging environment and preserved between static regenerations. See each',
    'lane’s `performance.md` ([backend](docs/internal/backend/performance.md) ·',
    '[frontend](docs/internal/frontend/performance.md)) for methodology and the full hot-path tables.',
    '',
  ];
  return lines.join('\n');
}

// --- entry ---------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--check')) {
    // Validate committed outputs are fresh. Ignore the volatile as_of stamp by
    // reusing the committed file's date, so only substantive drift fails.
    let committedAsOf;
    try {
      committedAsOf = JSON.parse(await readFile(PATHS.json, 'utf8')).as_of;
    } catch {
      console.error('aevum-stats.json missing — run `npm run stats`.');
      process.exit(1);
    }
    const { json, md } = await build({ asOf: committedAsOf });
    const drift = [];
    if ((await readFile(PATHS.json, 'utf8')) !== json) drift.push('aevum-stats.json');
    try {
      if ((await readFile(PATHS.md, 'utf8')) !== md) drift.push('METRICS.md');
    } catch {
      drift.push('METRICS.md (missing)');
    }
    if (drift.length) {
      console.error(`Stale generated metrics: ${drift.join(', ')} — run \`npm run stats\`.`);
      process.exit(1);
    }
    console.log('aevum-stats.json + METRICS.md in sync.');
    return;
  }

  const { json, md } = await build();
  if (args.includes('--stdout')) {
    process.stdout.write(json);
    return;
  }
  await writeFile(PATHS.json, json, 'utf8');
  await writeFile(PATHS.md, md, 'utf8');
  console.log('Wrote aevum-stats.json + METRICS.md.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
