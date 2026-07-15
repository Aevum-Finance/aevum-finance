// Vendors the brand source into this (outer, public) repo.
//
// The authoring source of truth is backend/app/constants/branding.json — the
// backend consumes it at runtime (emails, PDF cover) and owns the brand strings.
// But once the submodules go private, a public clone can't read across the
// submodule boundary, so `sync-readme` / `manual` must read a LOCAL copy. This
// script copies the source → tooling/branding.json (a byte-identical vendored
// mirror). Running it is a maintainer-side act (needs submodule access); the
// output is committed and public.
//
// An eventual re-homing (brand voice authored in this outer repo, submodules
// mirroring it) is a documentation-architecture decision, not settled here.
//
// Usage (from tooling/):
//   npm run sync-branding          # refresh tooling/branding.json from the backend
//   node sync-branding.mjs --check # exit 1 if the vendored copy is stale
//
// Logo (future): branding.json carries `logo_path` (brand/logo.svg). When that
// asset lands in the backend it is vendored here the same way.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANE_DIR } from './lanes.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.join(LANE_DIR.backend, 'app', 'constants', 'branding.json');
const VENDORED = path.join(HERE, 'branding.json');

async function main() {
  const check = process.argv.slice(2).includes('--check');
  const source = await readFile(SOURCE, 'utf8');

  let current = null;
  try {
    current = await readFile(VENDORED, 'utf8');
  } catch {
    /* missing → treated as drift below */
  }

  if (check) {
    if (current === source) {
      console.log('tooling/branding.json in sync with the backend source.');
      return;
    }
    console.error('tooling/branding.json is stale — run `npm run sync-branding`.');
    process.exit(1);
  }

  if (current === source) {
    console.log('tooling/branding.json already in sync.');
    return;
  }
  await writeFile(VENDORED, source, 'utf8');
  console.log('Vendored branding.json from the backend source.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
