// Minimal TOML reader for the docs substrate's FLAT manifests only:
//   # comments
//   [table.sub]            -> nested objects
//   key = "string"
//   key = ["a", "b"]       -> array of strings
//
// It is NOT a general TOML parser. Anything outside this shape (numbers, bare
// values, multiline, inline tables) THROWS — so a manifest that drifts from the
// expected schema fails loudly here instead of being silently mishandled. This is
// deliberate: these manifests are hand-authored editorial registries, and a typo
// should stop the build, not produce a half-parsed graph.

function parseValue(raw, lineNo) {
  const v = raw.trim();
  if (v.startsWith('[')) {
    const end = v.lastIndexOf(']');
    if (end === -1) throw new Error(`toml-lite: unterminated array on line ${lineNo}: ${raw}`);
    const inner = v.slice(1, end);
    if (inner.trim() === '') return [];
    const items = [...inner.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
    // Guard: every non-empty comma-separated slot must have been a quoted string.
    const slots = inner.split(',').filter((s) => s.trim() !== '').length;
    if (slots !== items.length) {
      throw new Error(`toml-lite: array must be quoted strings on line ${lineNo}: ${raw}`);
    }
    return items;
  }
  const str = v.match(/^"([^"]*)"/);
  if (!str) throw new Error(`toml-lite: expected a quoted string on line ${lineNo}: ${raw}`);
  return str[1];
}

export function parseToml(text) {
  const root = {};
  let cur = root;
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' || line.startsWith('#')) continue;

    const header = line.match(/^\[([^\]]+)\]$/);
    if (header) {
      cur = root;
      for (const part of header[1].split('.')) {
        const key = part.trim();
        cur[key] ??= {};
        cur = cur[key];
      }
      continue;
    }

    // Keys are either bare (tier, title) or quoted ("core/", with slashes/dots).
    const kv = line.match(/^(?:"([^"]+)"|([A-Za-z0-9_]+))\s*=\s*(.+)$/);
    if (!kv) throw new Error(`toml-lite: unparseable line ${i + 1}: ${lines[i]}`);
    cur[kv[1] ?? kv[2]] = parseValue(kv[3], i + 1);
  }
  return root;
}
