// The T0 product-topic roster — the SAME editorial order the manual reads
// (tooling/product-features.toml), so the site index, the nav, the search index and
// the PDF cannot disagree about what the topics are or how they're ordered.
//
// Read directly from the in-repo TOML (no lane checkout, no buildRoster's module
// resolution) so the site build stays self-contained — which matters because CF
// Pages builds aevum-hub ALONE, without the sibling code lanes.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseToml } from '../../../tooling/toml-lite.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TOML = path.resolve(HERE, '../../../tooling/product-features.toml');

/**
 * Ordered product topics: [{ key, title, blurb }, …] in declaration order.
 * `key` is the docs/public/<key>.md slug and the site route `/<key>`.
 */
export function productTopics() {
  const topics = parseToml(readFileSync(TOML, 'utf8')).topics ?? {};
  return Object.entries(topics).map(([key, t]) => ({
    key,
    title: t.title,
    blurb: t.blurb ?? '',
  }));
}

/** Route order rank for a topic key (README/unknown sort last). */
export function topicRank(key) {
  const i = productTopics().findIndex((t) => t.key === key);
  return i === -1 ? 999 : i;
}
