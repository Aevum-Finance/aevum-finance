// The T0 assembler. For each product topic (feature-index roster) it owns one
// docs/public/<topic>.md — the merged, user-facing product narrative that fuses the
// backend lane's "mechanism" T1 with the frontend lane's "surface" T1.
//
// The PROSE is authored (a product merge can't be generated). What the assembler
// owns is the mechanical scaffolding, kept in ONE marked region per file:
//
//   <!-- BEGIN GENERATED:provenance --> … <!-- END GENERATED:provenance -->
//
// That region is an HTML COMMENT — invisible to a reader (a product page must never
// show which module or tier its content came from) but a live maintainer link: it
// records, per covered module, the mirrored lane T1 doc this page reconciles, so a
// scope change upstream surfaces here. Prose OUTSIDE the region is never touched.
// Absent topics are scaffolded (tier header + provenance + a stub) so a newly
// declared topic can't be silently forgotten.
//
//   node build-public.mjs           # scaffold missing topics + refresh every region
//   node build-public.mjs --check   # exit 1 if any header/region is stale or a topic file is missing

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from './feature-index.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PUBLIC = path.join(ROOT, 'docs', 'public');

const TIER_HEADER =
  '<!-- Tier: T0 · product · users. Assembled at aevum-hub by merging the backend + frontend\n' +
  '     lane T1 docs into one product narrative. The prose here is authored; the provenance block\n' +
  '     below is generated (tooling/build-public.mjs). Keep this page free of tier labels and\n' +
  '     internal paths — a reader must never be shown which module or bucket its content came from. -->';

const BEGIN = '<!-- BEGIN GENERATED:provenance -->';
const END = '<!-- END GENERATED:provenance -->';

// --- render --------------------------------------------------------------

function laneLine(lane, mods) {
  if (!mods.length) return null;
  const parts = mods.map((m) => `${m.name} (${m.scope}) -> ../internal/${lane}/public/${m.slug}.md`);
  return `     ${lane}:  ${parts.join('\n              ')}`;
}

function provenanceBlock(topic) {
  const lines = [
    BEGIN,
    `<!-- Product topic "${topic.title}". Reconciles these mirrored lane T1 docs`,
    '     (edit at source; reconcile the merge here):',
  ];
  const be = laneLine('backend', topic.backend);
  const fe = laneLine('frontend', topic.frontend);
  if (be) lines.push(be);
  if (fe) lines.push(fe);
  lines[lines.length - 1] += ' -->';
  lines.push(END);
  return lines.join('\n');
}

function scaffold(topic) {
  return [
    TIER_HEADER,
    '',
    provenanceBlock(topic),
    '',
    `# ${topic.title}`,
    '',
    `${topic.blurb}`,
    '',
    '<!-- TODO(P2): author the merged product narrative — reconcile the backend mechanism',
    '     and frontend surface T1 docs linked in the provenance block above. -->',
    '',
  ].join('\n');
}

// Replace the inner of the provenance region; also re-assert the tier header as the
// file's first line-block. Returns the updated content, or null if unchanged.
function apply(topic, current) {
  let next = current;

  // Tier header: ensure the file opens with it (idempotent refresh).
  if (!next.startsWith(TIER_HEADER)) {
    // Strip a pre-existing tier header (first HTML comment) if present, else prepend.
    const firstEnd = next.startsWith('<!--') ? next.indexOf('-->') : -1;
    const body = firstEnd !== -1 ? next.slice(firstEnd + 3).replace(/^\n+/, '') : next;
    next = `${TIER_HEADER}\n\n${body}`;
  }

  const block = provenanceBlock(topic);
  const b = next.indexOf(BEGIN);
  const e = next.indexOf(END);
  if (b !== -1 && e !== -1) {
    next = next.slice(0, b) + block + next.slice(e + END.length);
  } else {
    // No region yet — insert it right after the tier header.
    next = next.replace(`${TIER_HEADER}\n`, `${TIER_HEADER}\n\n${block}\n`);
  }
  return next === current ? null : next;
}

// --- entry ---------------------------------------------------------------

function run({ check }) {
  const roster = build();
  if (!existsSync(PUBLIC)) {
    if (check) {
      console.error('docs/public/ is missing — run `npm run public`.');
      process.exit(1);
    }
    mkdirSync(PUBLIC, { recursive: true });
  }

  const drift = [];
  for (const topic of roster) {
    const file = path.join(PUBLIC, `${topic.key}.md`);
    if (!existsSync(file)) {
      if (check) {
        drift.push(`${topic.key}.md (missing)`);
        continue;
      }
      writeFileSync(file, scaffold(topic), 'utf8');
      console.log(`scaffolded docs/public/${topic.key}.md`);
      continue;
    }
    const current = readFileSync(file, 'utf8');
    const next = apply(topic, current);
    if (next) {
      if (check) drift.push(`${topic.key}.md (stale provenance/header)`);
      else {
        writeFileSync(file, next, 'utf8');
        console.log(`refreshed docs/public/${topic.key}.md`);
      }
    }
  }

  if (check) {
    if (drift.length) {
      console.error(`Stale T0 public docs: ${drift.join(', ')} — run \`npm run public\`.`);
      process.exit(1);
    }
    console.log(`docs/public in sync — ${roster.length} topics.`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run({ check: process.argv.slice(2).includes('--check') });
}

export { apply, provenanceBlock, scaffold, TIER_HEADER };
