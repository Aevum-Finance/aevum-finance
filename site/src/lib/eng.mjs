// Nav structure + titles for the T1 engineering mirror (docs/internal/**). Entry ids
// look like `backend/architecture`, `backend/public/auth`, `frontend/README`, …

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

const LANES = [
  ['backend', 'Backend'],
  ['frontend', 'Frontend'],
];

// README → architecture → performance → then the per-module public/* pages.
function rank(id) {
  if (id.endsWith('/README')) return 0;
  if (id.endsWith('/architecture')) return 1;
  if (id.endsWith('/performance')) return 2;
  return 3;
}

export function buildEngGroups(entries, activeId) {
  const groups = [];
  for (const [key, label] of LANES) {
    const laneEntries = entries
      .filter((e) => e.id === key || e.id.startsWith(key + '/'))
      .sort((a, b) => rank(a.id) - rank(b.id) || engTitle(a).localeCompare(engTitle(b)));
    if (!laneEntries.length) continue;
    groups.push({
      heading: label,
      items: laneEntries.map((e) => ({
        href: `/engineering/${e.id}`,
        label: engTitle(e),
        active: e.id === activeId,
      })),
    });
  }
  return groups;
}
