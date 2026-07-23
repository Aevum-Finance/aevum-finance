// The product-topic index — the SoT for how the T0 doc merge is structured.
//
// Reads three registries and resolves them into one coverage-asserted topic roster:
//   - tooling/product-features.toml         (editorial: topic -> lane modules)
//   - docs/internal/backend/modules.manifest.toml   (mirrored BE module registry)
//   - docs/internal/frontend/modules.manifest.json  (mirrored FE module registry)
//
// It reads the MIRROR (not the lane clones) so the index is a pure function of this
// repo's state after `npm run docs` — no lane checkout needed at index time. The
// lane manifests classify each module user_facing | infra; only user_facing modules
// belong on the product surface (infra would pollute the T0 product narrative).
//
// Coverage assertion (fails the build on drift, like the lane T3 generators):
//   - DANGLING: a topic references a module that doesn't exist, or that exists but
//     is infra (not user_facing) — a typo or a mis-tiered module.
//   - ORPHAN: a user_facing module claimed by NO topic — it would silently vanish
//     from the product docs. (Modules MAY appear in more than one topic: a module's
//     doc can legitimately inform several product topics.)
//
// Outputs (the roster drives P2's per-topic merge; the table injects into P3's
// README/ARCHITECTURE):
//   node feature-index.mjs            # assert + print the human topic map
//   node feature-index.mjs --json     # the roster as JSON (tooling input)
//   node feature-index.mjs --table    # the feature table as markdown (for injection)
//   node feature-index.mjs --check    # assert only; exit 1 on any coverage failure

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { parseToml } from './toml-lite.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const MIRROR = path.join(ROOT, 'docs', 'internal');

const SRC = {
  topics: path.join(HERE, 'product-features.toml'),
  backend: path.join(MIRROR, 'backend', 'modules.manifest.toml'),
  frontend: path.join(MIRROR, 'frontend', 'modules.manifest.json'),
};

class CoverageError extends Error {}

// --- load ----------------------------------------------------------------

// Normalize each lane manifest to { <module>: { tier, title, scope } }.
function loadLane(kind, srcPath) {
  if (kind === 'backend') {
    return parseToml(readFileSync(srcPath, 'utf8')).modules ?? {};
  }
  return JSON.parse(readFileSync(srcPath, 'utf8')).modules ?? {};
}

function loadTopics(srcPath) {
  const topics = parseToml(readFileSync(srcPath, 'utf8')).topics ?? {};
  // Preserve the manifest's declaration order (Object insertion order).
  return Object.entries(topics).map(([key, t]) => ({
    key,
    title: t.title,
    blurb: t.blurb,
    backend: t.backend ?? [],
    frontend: t.frontend ?? [],
  }));
}

// --- resolve + assert ----------------------------------------------------

// `paths` is injectable (defaults to the real SRC) so tests can feed fixtures.
function build(paths = SRC) {
  const lanes = {
    backend: loadLane('backend', paths.backend),
    frontend: loadLane('frontend', paths.frontend),
  };
  const topics = loadTopics(paths.topics);

  const userFacing = (kind) =>
    new Set(Object.entries(lanes[kind]).filter(([, m]) => m.tier === 'user_facing').map(([k]) => k));
  const uf = { backend: userFacing('backend'), frontend: userFacing('frontend') };

  const dangling = [];
  const claimed = { backend: new Set(), frontend: new Set() };

  const resolveSide = (kind, names, topicKey) =>
    names.map((name) => {
      const mod = lanes[kind][name];
      if (!mod) {
        dangling.push(`topic '${topicKey}' -> ${kind} module '${name}' does not exist`);
      } else if (mod.tier !== 'user_facing') {
        dangling.push(`topic '${topicKey}' -> ${kind} module '${name}' is '${mod.tier}', not user_facing`);
      } else {
        claimed[kind].add(name);
      }
      // Mirrored public-page slug: FE honours public_slug (bankAccounts -> bank-accounts),
      // BE uses the module name directly. This is the down-link target in the mirror.
      const slug = mod?.public_slug ?? name;
      return { name, slug, title: mod?.title ?? null, scope: mod?.scope ?? null };
    });

  const roster = topics.map((t) => {
    const backend = resolveSide('backend', t.backend, t.key);
    const frontend = resolveSide('frontend', t.frontend, t.key);
    const coverage = backend.length && frontend.length ? 'both' : backend.length ? 'backend' : 'frontend';
    return { key: t.key, title: t.title, blurb: t.blurb, backend, frontend, coverage };
  });

  const orphans = [];
  for (const kind of ['backend', 'frontend']) {
    for (const name of uf[kind]) {
      if (!claimed[kind].has(name)) orphans.push(`${kind} user_facing module '${name}' is in no topic`);
    }
  }

  const errors = [...dangling, ...orphans];
  if (errors.length) {
    throw new CoverageError(
      `product-features coverage failed:\n  - ${errors.join('\n  - ')}\n` +
        'Fix tooling/product-features.toml (or the lane manifest) so every user_facing module is claimed ' +
        'exactly by an existing user_facing entry.'
    );
  }
  return roster;
}

// --- render --------------------------------------------------------------

function renderHuman(roster) {
  const lines = [`${roster.length} product topics — all user_facing modules covered:`, ''];
  for (const t of roster) {
    const be = t.backend.map((m) => m.name).join(', ') || '—';
    const fe = t.frontend.map((m) => m.name).join(', ') || '—';
    lines.push(`  ${t.key.padEnd(22)} [${t.coverage.padEnd(8)}]  be: ${be.padEnd(28)} fe: ${fe}`);
  }
  return lines.join('\n');
}

function renderTable(roster) {
  const lines = [
    '| Topic | Covers |',
    '| --- | --- |',
    ...roster.map((t) => {
      const mods = [...new Set([...t.backend, ...t.frontend].map((m) => m.title).filter(Boolean))].join(' · ');
      return `| [${t.title}](docs/public/${t.key}.md) | ${mods} |`;
    }),
  ];
  return `${lines.join('\n')}\n`;
}

// --- entry ---------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  let roster;
  try {
    roster = build();
  } catch (err) {
    if (err instanceof CoverageError) {
      console.error(err.message);
      process.exit(1);
    }
    throw err;
  }
  if (args.includes('--check')) {
    console.log(`product-features coverage OK — ${roster.length} topics.`);
    return;
  }
  if (args.includes('--json')) {
    process.stdout.write(`${JSON.stringify(roster, null, 2)}\n`);
    return;
  }
  if (args.includes('--table')) {
    process.stdout.write(renderTable(roster));
    return;
  }
  console.log(renderHuman(roster));
}

// Run only when invoked directly (`node feature-index.mjs …`), not when imported
// by the test suite.
if (import.meta.url === pathToFileURL(process.argv[1]).href) main();

export { build, CoverageError, renderTable };
