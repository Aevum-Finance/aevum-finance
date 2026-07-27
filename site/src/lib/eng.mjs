// Nav structure + titles for the ENGINEERING section. After T-docs-site's engineering
// rework the section is the curated "how it works" set — the mechanics docs mirrored to
// docs/internal/engineering/<lane>/**, plus the retained-by-difference cross-cutting T1
// (architecture, performance). The shallow per-module retellings (docs/internal/<lane>/
// public/*.md) are NOT surfaced — they just re-tell T0 (the user manual).

export function firstHeading(body, fallback) {
  const m = (body ?? '').match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[#*`]/g, '').trim() : fallback;
}

function prettify(id) {
  const last = id.split('/').pop() ?? id;
  return last.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function engTitle(entry) {
  return firstHeading(entry.body, prettify(entry.id));
}

// Mirror entry id → engineering-section route slug. The engineering docs live under
// `engineering/<lane>/…`; strip that infix so the route is /engineering/<lane>/<doc>
// rather than /engineering/engineering/<lane>/<doc>. Cross-cutting T1 ids (backend/
// architecture) already have the right shape.
export function engSlug(id) {
  return (id.startsWith('engineering/') ? id.slice('engineering/'.length) : id).toLowerCase();
}

const LANES = [
  ['backend', 'Backend'],
  ['frontend', 'Frontend'],
];

// Reading order within a lane: the overview first, then the deep dives, with the
// retained architecture/performance references last.
function rank(slug) {
  const base = slug.split('/').pop();
  if (base === 'readme') return 0;
  if (base === 'architecture') return 8;
  if (base === 'performance') return 9;
  return 4;
}

export function buildEngGroups(entries, activeId) {
  const groups = [];
  for (const [key, label] of LANES) {
    const lane = entries
      .map((e) => ({ e, slug: engSlug(e.id) }))
      .filter(({ slug }) => slug.startsWith(key + '/'))
      .sort((a, b) => rank(a.slug) - rank(b.slug) || engTitle(a.e).localeCompare(engTitle(b.e)));
    if (!lane.length) continue;
    groups.push({
      heading: label,
      items: lane.map(({ e, slug }) => ({
        href: `/engineering/${slug}`,
        label: engTitle(e),
        active: e.id === activeId,
      })),
    });
  }
  return groups;
}

// The per-lane overview entry (its README), for the section landing.
export function laneOverviews(entries) {
  return LANES.map(([key, label]) => {
    const entry = entries.find((e) => engSlug(e.id) === `${key}/readme`);
    return entry ? { key, label, entry, slug: engSlug(entry.id) } : null;
  }).filter(Boolean);
}
