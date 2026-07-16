// Regenerates the brand block (name / tagline / description) in the monorepo
// README.md from the single source, backend/app/constants/branding.json. The
// block is delimited by <!-- BRAND:start --> / <!-- BRAND:end --> markers; the
// rest of the README is hand-authored and left untouched.
//
// Usage:  npm run sync-readme   (from tooling/)

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadBranding, splitDescription } from './branding.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const README = path.resolve(HERE, '../README.md');

const START = '<!-- BRAND:start -->';
const END = '<!-- BRAND:end -->';

function brandBlock(brand) {
  const { lead, rest } = splitDescription(brand.description);
  const body = rest ? `**${lead}** ${rest}` : `**${lead}**`;
  return [
    START,
    '<!-- Generated from backend/app/constants/branding.json — `npm run sync-readme` in tooling. -->',
    `# ${brand.name}`,
    '',
    `> **${brand.tagline}**`,
    '',
    body,
    END,
  ].join('\n');
}

async function main() {
  const brand = await loadBranding();
  const readme = await readFile(README, 'utf8');

  const startIdx = readme.indexOf(START);
  const endIdx = readme.indexOf(END);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `README.md is missing the ${START} / ${END} markers — add them around the brand block first.`
    );
  }
  const next =
    readme.slice(0, startIdx) +
    brandBlock(brand) +
    readme.slice(endIdx + END.length);

  if (next === readme) {
    console.log('README brand block already in sync.');
    return;
  }
  await writeFile(README, next, 'utf8');
  console.log('Synced README brand block from branding.json.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
