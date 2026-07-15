import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Brand metadata for the README block + PDF cover. Reads the LOCAL vendored
// copy (tooling/branding.json), NOT across the submodule boundary — so it keeps
// working after the submodules go private. The authoring SoT is the backend
// (backend/app/constants/branding.json); `npm run sync-branding` refreshes this
// copy from it. See sync-branding.mjs.
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const BRANDING_JSON = path.resolve(HERE, 'branding.json');

/** @returns {Promise<{name:string, tagline:string, description:string, logo_path?:string}>} */
export async function loadBranding() {
  return JSON.parse(await readFile(BRANDING_JSON, 'utf8'));
}

// Split the description into its bolded lead sentence + the remainder, matching
// the README's hero treatment.
export function splitDescription(description) {
  const idx = description.indexOf('. ');
  if (idx === -1) return { lead: description, rest: '' };
  return {
    lead: description.slice(0, idx + 1),
    rest: description.slice(idx + 2),
  };
}
