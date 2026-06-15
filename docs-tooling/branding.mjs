import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Single source of truth for brand metadata, shared with the backend and the
// README. docs-tooling → repo root → backend/app/constants/branding.json
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const BRANDING_JSON = path.resolve(
  HERE,
  '../backend/app/constants/branding.json'
);

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
