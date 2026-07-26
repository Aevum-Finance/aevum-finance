/*
 * /data contract test (T-docs-site test plan). Asserts each published feed exists at
 * its promised path and carries its promised top-level keys — so a renamed key
 * upstream fails HERE, in this repo's build, not in a downstream's. Run after a build
 * (reads dist/data). Exit 1 on any breach.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'data');

// feed path (under /data) -> required top-level keys (or a predicate for arrays)
const CONTRACT = {
  'aevum-stats.json': ['as_of', 'backend', 'frontend'],
  'backend/stats.json': ['lane', 'counts'],
  'backend/modules.json': ['modules'],
  'backend/tree.json': [],
  'backend/benchmarks.json': ['lane', 'benchmark'],
  'frontend/stats.json': ['lane', 'counts'],
  'frontend/modules.json': ['modules'],
  'frontend/tree.json': [],
  'frontend/benchmarks.json': ['lane', 'benchmark'],
  'docs-index.json': (v) => Array.isArray(v) && v.length > 0 && 'url' in v[0] && 'headings' in v[0],
  'screenshots.json': (v) => Array.isArray(v) && (v.length === 0 || 'scene' in v[0]),
};

const problems = [];
for (const [rel, req] of Object.entries(CONTRACT)) {
  const file = path.join(DATA, rel);
  if (!existsSync(file)) {
    problems.push(`missing feed: /data/${rel}`);
    continue;
  }
  let json;
  try {
    json = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    problems.push(`invalid JSON: /data/${rel}`);
    continue;
  }
  if (typeof req === 'function') {
    if (!req(json)) problems.push(`/data/${rel} failed its shape predicate`);
  } else {
    for (const k of req) {
      if (!(k in json)) problems.push(`/data/${rel} missing key "${k}"`);
    }
  }
}

if (problems.length) {
  console.error('[check-data] CONTRACT BROKEN:\n  - ' + problems.join('\n  - '));
  process.exit(1);
}
console.log(`[check-data] ok — ${Object.keys(CONTRACT).length} /data feeds honor their contract.`);
