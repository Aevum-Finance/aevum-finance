// Mirrors each code lane's PUBLIC docs into this outer repo, so a public clone
// (and the personal site) can serve the whole Aevum doc surface WITHOUT ever
// touching the — soon private — submodules. This is the N->1 half of the docs
// gradient: many lanes' T1 -> one outer surface, PULLED here (never pushed by the
// lanes), stamped with each file's provenance.
//
//   aevum-api/docs/**  (minus internal/ + archive/)  ->  docs/internal/backend/**
//   aevum-web/docs/**  (minus internal/ + archive/)  ->  docs/internal/frontend/**
//
// What is copied: the T1 markdown (README, architecture, performance, public/*)
// AND the public substrate sidecars (stats.*.json, modules.manifest.{toml,json},
// tree.annotations.{toml,json}, perf/benchmarks.json). The sidecars ride along so
// the mirror is a COMPLETE self-contained public snapshot — the personal site pulls
// them from here, not from a private repo. They are consumed into outer docs by
// typed readers (merge-stats.mjs, the union feature-index), never pasted raw.
//
// What is NOT copied: docs/internal/ (the lanes' private T2/T3 tier) and docs/archive/
// (frozen legacy, linked by no T1 doc) — the tier boundary IS the publish boundary.
//
// Provenance: every markdown file gets an inline AUTO-GENERATED stamp; data sidecars
// (json/toml) can't hold an HTML comment, so their provenance lives in the generated
// docs/internal/MIRROR.md manifest. The stamp pins each file to the commit that LAST
// TOUCHED it (git log -1 -- <file>), not the lane HEAD — so an unrelated lane commit
// never re-stamps a doc, and --check only drifts on real content change. SHAs are a
// fixed 8-char slice of the full hash (git's auto-abbrev length varies per clone and
// would falsely trip --check — same reasoning as merge-stats.mjs::shortSha).
//
// Usage (from tooling/):
//   npm run docs                 # write docs/internal/{backend,frontend}/ + MIRROR.md
//   node sync-docs.mjs --check   # exit 1 if the committed mirror is stale (CI folds on drift)
//
// Env (set when running from a WORKTREE, whose ../aevum-api does not hit the real
// clone): AEVUM_BACKEND_DIR / AEVUM_FRONTEND_DIR -> the on-disk lane clones (lanes.mjs).

import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { LANE_DIR } from './lanes.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const MIRROR_ROOT = path.join(ROOT, 'docs', 'internal');
const MIRROR_MD = path.join(MIRROR_ROOT, 'MIRROR.md');

const LANES = [
  { key: 'backend', repo: 'aevum-api', dir: LANE_DIR.backend },
  { key: 'frontend', repo: 'aevum-web', dir: LANE_DIR.frontend },
];

// Excluded at the docs/ ROOT only: internal/ = the private tier; archive/ = frozen
// legacy no live doc links to. Everything else under docs/ is public and mirrored.
const EXCLUDE_TOP = new Set(['internal', 'archive']);
const SHA_LEN = 8;

// --- helpers -------------------------------------------------------------

/**
 * A shallow lane clone CANNOT answer "which commit last touched this file". With
 * only HEAD in the history, `git log -1 -- <path>` returns HEAD for every path —
 * so every stamp collapses to the lane tip and the per-file provenance silently
 * becomes a lie that still looks like an answer.
 *
 * It is worth failing loudly over. This mirror is the ONLY version record left
 * after the gitlinks were dropped, and the failure has no symptom at the point of
 * generation: the run is green, the files are written, and the SHAs are wrong. It
 * also churns — a shallow CI run and a full local run disagree on every file, so
 * they overwrite each other's stamps on every fold, forever.
 *
 * The cause is never subtle: actions/checkout defaults to fetch-depth 1.
 */
export function assertFullHistory(lane) {
  let shallow;
  try {
    shallow = execFileSync('git', ['-C', lane.dir, 'rev-parse', '--is-shallow-repository'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    // Not a git clone at all — fileSha() already degrades to an unstamped mirror,
    // which is honest (it claims no provenance rather than the wrong provenance).
    return;
  }
  if (shallow === 'true') {
    throw new Error(
      `sync-docs: the ${lane.key} lane (${lane.repo}) is a SHALLOW clone, so per-file ` +
        'provenance cannot be resolved — every stamp would collapse to the lane tip.\n' +
        '  In CI: set `fetch-depth: 0` on that lane\'s actions/checkout step.\n' +
        '  Locally: `git -C <lane> fetch --unshallow`.'
    );
  }
}

// The commit that last authored <repoRelPath>, as a clone-stable 8-char prefix.
function fileSha(laneDir, repoRelPath) {
  try {
    const full = execFileSync(
      'git',
      ['-C', laneDir, 'log', '-1', '--format=%H', '--', repoRelPath],
      { encoding: 'utf8' }
    ).trim();
    return full ? full.slice(0, SHA_LEN) : null;
  } catch {
    return null;
  }
}

function stamp(repo, sha) {
  const pin = sha ? `@${sha}` : '';
  return `<!-- AUTO-GENERATED — byte-faithful mirror of ${repo}${pin}/docs. Edit at source, not here. -->`;
}

// Recursively list files under <laneDir>/docs, POSIX-relative to docs/, sorted for
// determinism, excluding the top-level internal/ + archive/ subtrees.
async function collect(laneDir) {
  const docsRoot = path.join(laneDir, 'docs');
  const out = [];
  async function walk(absDir, rel) {
    const entries = await readdir(absDir, { withFileTypes: true });
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const e of entries) {
      const abs = path.join(absDir, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (rel === '' && EXCLUDE_TOP.has(e.name)) continue;
        await walk(abs, r);
      } else if (e.isFile()) {
        out.push(r);
      }
    }
  }
  await walk(docsRoot, '');
  return out.sort();
}

// --- build ---------------------------------------------------------------

// Returns { files: [{ destRel, bytes, sha }], perLaneProvenance }. destRel is
// relative to MIRROR_ROOT (e.g. "backend/architecture.md"). bytes is a Buffer so
// non-markdown (json/toml, any future images) round-trips untouched.
async function buildLane(lane) {
  assertFullHistory(lane);
  const rels = await collect(lane.dir);
  const files = [];
  const provenance = [];
  for (const rel of rels) {
    const srcAbs = path.join(lane.dir, 'docs', rel);
    const repoRel = path.posix.join('docs', rel);
    const sha = fileSha(lane.dir, repoRel);
    const raw = await readFile(srcAbs);
    const destRel = path.posix.join(lane.key, rel);
    let bytes;
    if (rel.endsWith('.md')) {
      bytes = Buffer.from(`${stamp(lane.repo, sha)}\n\n${raw.toString('utf8')}`, 'utf8');
    } else {
      bytes = raw; // data sidecar / binary — copied verbatim, provenance via MIRROR.md
    }
    files.push({ destRel, bytes, sha });
    provenance.push({ destRel, repo: lane.repo, sha });
  }
  return { files, provenance };
}

function renderMirrorMd(perLane) {
  const lines = [
    '<!-- AUTO-GENERATED by tooling/sync-docs.mjs — do not hand-edit. -->',
    '',
    '# Mirror provenance',
    '',
    'Every file under this folder is a **byte-faithful copy** of a code lane’s PUBLIC docs',
    '(`docs/**` minus `internal/` + `archive/`), pinned to the commit that last authored it.',
    '**Edit at source, never here** — `tooling/sync-docs.mjs` overwrites this tree on every sync.',
    'Markdown files also carry an inline provenance stamp; data sidecars (json/toml) record it',
    'here instead, since they cannot hold an HTML comment.',
    '',
  ];
  for (const lane of LANES) {
    lines.push(`## aevum-${lane.key}`, '');
    lines.push('| Mirrored file | Source @ |', '| --- | --- |');
    for (const p of perLane[lane.key]) {
      lines.push(`| \`${p.destRel}\` | ${p.repo}@${p.sha ?? '—'} |`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}`.replace(/\n*$/, '\n');
}

async function build() {
  const files = [];
  const perLane = {};
  for (const lane of LANES) {
    const { files: laneFiles, provenance } = await buildLane(lane);
    files.push(...laneFiles);
    perLane[lane.key] = provenance;
  }
  const mirrorMd = renderMirrorMd(perLane);
  return { files, mirrorMd };
}

// --- write / check -------------------------------------------------------

async function writeMirror({ files, mirrorMd }) {
  // Rebuild from scratch so a file DELETED at source disappears from the mirror.
  for (const lane of LANES) {
    await rm(path.join(MIRROR_ROOT, lane.key), { recursive: true, force: true });
  }
  await rm(MIRROR_MD, { force: true });
  for (const f of files) {
    const dest = path.join(MIRROR_ROOT, f.destRel);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, f.bytes);
  }
  await mkdir(MIRROR_ROOT, { recursive: true });
  await writeFile(MIRROR_MD, mirrorMd, 'utf8');
  console.log(`Mirrored ${files.length} file(s) across ${LANES.length} lane(s) + MIRROR.md.`);
}

async function checkMirror({ files, mirrorMd }) {
  const drift = [];
  const expected = new Set(files.map((f) => f.destRel));

  for (const f of files) {
    const dest = path.join(MIRROR_ROOT, f.destRel);
    let cur;
    try {
      cur = await readFile(dest);
    } catch {
      drift.push(`${f.destRel} (missing)`);
      continue;
    }
    if (!cur.equals(f.bytes)) drift.push(f.destRel);
  }

  // Stray files: present in the mirror but no longer in the build set (a source
  // deletion the committed tree still carries).
  for (const lane of LANES) {
    const laneRoot = path.join(MIRROR_ROOT, lane.key);
    const seen = await listExisting(laneRoot, lane.key);
    for (const rel of seen) if (!expected.has(rel)) drift.push(`${rel} (stray)`);
  }

  let curMd;
  try {
    curMd = await readFile(MIRROR_MD, 'utf8');
  } catch {
    drift.push('MIRROR.md (missing)');
  }
  if (curMd !== undefined && curMd !== mirrorMd) drift.push('MIRROR.md');

  if (drift.length) {
    console.error(`Stale docs mirror: ${drift.join(', ')} — run \`npm run docs\`.`);
    process.exit(1);
  }
  console.log('docs/internal mirror in sync.');
}

// destRel-relative existing files under a mirror lane dir (for stray detection).
async function listExisting(absRoot, laneKey) {
  const out = [];
  async function walk(absDir, rel) {
    let entries;
    try {
      entries = await readdir(absDir, { withFileTypes: true });
    } catch {
      return; // lane dir absent yet — no strays
    }
    for (const e of entries) {
      const abs = path.join(absDir, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) await walk(abs, r);
      else if (e.isFile()) out.push(path.posix.join(laneKey, r));
    }
  }
  await walk(absRoot, '');
  return out;
}

// --- entry ---------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const built = await build();
  if (args.includes('--check')) {
    await checkMirror(built);
    return;
  }
  await writeMirror(built);
}

// Direct-execution guard — same as the other generators. Without it, importing a
// helper from this module (the shallow-clone assertion, from the tests) would run
// a full mirror sync as a side effect of the import.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
