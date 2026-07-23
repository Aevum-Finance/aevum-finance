// Input-hash gate for the user manual (T-manual-screenshots-and-ci).
//
// The manual has TWO sources: the prose in docs/public/*.md, and the images the
// prose embeds. Either one drifting makes the built PDF wrong, so the rebuild
// trigger has to watch both.
//
// It watches the INPUTS, never the PDF. The PDF carries a build timestamp (and
// puppeteer embeds a creation date of its own), so its bytes change on every
// single build — comparing them would make the generator either rebuild forever
// or never notice anything. Hashing what goes IN is the only stable signal.
//
//   node manual-inputs.mjs           # print the current hash
//   node manual-inputs.mjs --check   # exit 1 if it differs from the committed one
//   node manual-inputs.mjs --write   # record the current hash (after a build)
//
// Same shape as the demo-world and stats drift gates: a committed record of what
// the artifact was built from, checkable in CI.

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// The PDF is built FROM docs/public (prose + the images it embeds); the record
// lives beside the artifact it describes, in USER_GUIDE/.
const PUBLIC = path.resolve(HERE, '../docs/public');
const USER_GUIDE = path.resolve(HERE, '../USER_GUIDE');
const RECORD = path.join(USER_GUIDE, '.manual-inputs.sha256');

/** Every file the PDF is built from, in a stable order. */
function inputFiles() {
  const files = [];

  for (const name of readdirSync(PUBLIC).sort()) {
    if (name.endsWith('.md')) files.push(path.join(PUBLIC, name));
  }

  // Images are walked rather than listed so a NEW screenshot counts as drift.
  // Both subdirectories matter: screenshots/ is dispatched from aevum-web, and
  // brand/ is pushed by the aevum-brand dispatcher — a banner refresh changes the
  // manual's cover just as surely as a view change does.
  const imagesRoot = path.join(PUBLIC, 'images');
  if (existsSync(imagesRoot)) {
    for (const dir of readdirSync(imagesRoot, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      if (!dir.isDirectory()) continue;
      const sub = path.join(imagesRoot, dir.name);
      for (const name of readdirSync(sub).sort()) {
        files.push(path.join(sub, name));
      }
    }
  }

  return files;
}

export function hashInputs() {
  const h = createHash('sha256');
  for (const file of inputFiles()) {
    // The PATH goes into the hash as well as the bytes, so a rename registers as
    // drift even when the content is identical — the prose links by path, so a
    // rename that nothing else follows produces a broken image in the PDF.
    h.update(path.relative(PUBLIC, file));
    h.update('\0');
    h.update(readFileSync(file));
    h.update('\0');
  }
  return h.digest('hex');
}

function main() {
  const hash = hashInputs();
  const arg = process.argv[2];

  if (arg === '--write') {
    writeFileSync(RECORD, `${hash}\n`);
    console.log(`manual inputs: recorded ${hash.slice(0, 12)}`);
    return;
  }

  if (arg === '--check') {
    if (!existsSync(RECORD)) {
      console.error('manual inputs: no record — run `npm run manual` to build and record one.');
      process.exit(1);
    }
    const recorded = readFileSync(RECORD, 'utf8').trim();
    if (recorded !== hash) {
      console.error(
        `manual inputs: DRIFT — the docs or images changed since user_manual.pdf was built.\n` +
          `  recorded ${recorded.slice(0, 12)}\n` +
          `  current  ${hash.slice(0, 12)}\n` +
          '  run `npm run manual` and commit the result.'
      );
      process.exit(1);
    }
    console.log('manual inputs: PDF is current.');
    return;
  }

  console.log(hash);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
