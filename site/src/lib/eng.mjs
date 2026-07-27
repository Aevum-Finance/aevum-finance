// Nav + titles for the ENGINEERING section — now a thin reader over the docs-map contract
// (docs/internal/docs-map.json via docs-map.mjs). The published set, routes, titles and
// reading order all come from the contract; this module just shapes them into nav groups and
// landing cards. No path/slug derivation lives here anymore.
import { engineeringDocs, engDocForEntry } from './docs-map.mjs';

// Title of a rendered engineering entry, from the contract (single source of truth).
export function engTitle(entry) {
  return engDocForEntry(entry)?.title ?? entry.id;
}

const LANES = [
  ['backend', 'Backend'],
  ['frontend', 'Frontend'],
];

// Left-rail nav, grouped by lane in the contract's curation order. `activeSource` is the
// docs/-relative source of the current page (or '' on the section index).
export function buildEngGroups(activeSource = '') {
  const groups = [];
  for (const [key, label] of LANES) {
    const items = engineeringDocs
      .filter((d) => d.lane === key)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
      .map((d) => ({ href: d.route, label: d.title, active: d.source === activeSource }));
    if (items.length) groups.push({ heading: label, items });
  }
  return groups;
}

// The per-lane overview doc (its README), for the section landing's "start here" cards.
export function laneOverviews() {
  return LANES.map(([key, label]) => {
    const doc = engineeringDocs.find((d) => d.lane === key && /(^|\/)readme$/i.test(d.id));
    return doc ? { key, label, doc } : null;
  }).filter(Boolean);
}
