/*
 * D4 — the link classification gate. Runs in Astro's markdown pipeline over the
 * mirrored docs. Every relative `.md` link is resolved against its source file and
 * classified:
 *
 *   1. Target is a PUBLISHED doc  → rewrite `.md` → its route (keep the #anchor).
 *   2. Target is KNOWN-UNPUBLISHED (a lane's private `internal/` tier, a repo-root
 *      README, a code path, a bare directory) → DEGRADE to plain text: keep the
 *      label, drop the anchor. The sentence still reads; no door onto a private repo.
 *   3. External `http(s)` / mailto / pure #anchor → keep.
 *   4. Anything else → THROW, failing the build.
 *
 * Rule 4 is the point: this replaces check-links' blanket `docs/internal` skip, so a
 * new lane doc cannot silently ship a dead link — or an unclassified one — onto the
 * public web. Fail-closed.
 */
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

function walkMd(dir, root, out) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkMd(p, root, out);
    else if (e.name.endsWith('.md')) out.push(path.relative(root, p).replace(/\.md$/, ''));
  }
  return out;
}

export function rehypeDocLinks({ repoRoot }) {
  const PUBLIC = path.join(repoRoot, 'docs/public');
  const INTERNAL = path.join(repoRoot, 'docs/internal');

  const productKeys = new Set(
    readdirSync(PUBLIC)
      .filter((f) => f.endsWith('.md') && f !== 'README.md')
      .map((f) => f.replace(/\.md$/, ''))
  );
  const engIds = new Set(walkMd(INTERNAL, INTERNAL, []).filter((id) => id !== 'MIRROR'));

  const routeFor = (absTarget) => {
    if (absTarget.startsWith(PUBLIC + path.sep)) {
      const key = path.relative(PUBLIC, absTarget).replace(/\.md$/, '');
      return productKeys.has(key) ? `/${key}` : null;
    }
    if (absTarget.startsWith(INTERNAL + path.sep)) {
      // Astro's glob loader lowercases entry ids (README -> readme); match that so the
      // route points at the page Astro actually built (CF Pages is case-sensitive).
      const id = path.relative(INTERNAL, absTarget).replace(/\.md$/, '');
      return engIds.has(id) ? `/engineering/${id.toLowerCase()}` : null;
    }
    return null;
  };

  // A relative link is "known-unpublished" (degrade, not fail) when it points at a
  // lane's private tier, a repo-root README, code, or a bare directory.
  const isKnownUnpublished = (rawPath) => {
    if (/(^|\/)internal(\/|$)/.test(rawPath)) return true; // lane private tier
    if (/(^|\/)README(\.md)?$/i.test(rawPath) && !rawPath.includes('docs/')) return true;
    if (/\.(py|ts|tsx|js|mjs|jsx|json|toml|yml|yaml|css|sh)$/.test(rawPath)) return true;
    if (/(^|\/)(app|src|tests?|tooling|scripts)\//.test(rawPath)) return true;
    if (!/\.md(#|$)/.test(rawPath)) return true; // directory / extensionless link
    return false;
  };

  return (tree, file) => {
    const srcPath = file?.path || file?.history?.[0];
    const srcDir = srcPath ? path.dirname(srcPath) : PUBLIC;

    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string') classify(node, href);
      }
      if (Array.isArray(node.children)) for (const child of node.children) visit(child);
    };

    const classify = (node, href) => {
      if (/^(https?:|mailto:|tel:)/i.test(href) || href.startsWith('#') || href.startsWith('/')) {
        return; // external, pure anchor, or already-absolute route
      }
      const [rel, anchor] = href.split('#');
      if (!rel) return;

      const absTarget = path.resolve(srcDir, rel);
      const route = /\.md$/.test(rel) ? routeFor(absTarget) : null;

      if (route) {
        node.properties.href = anchor ? `${route}#${anchor}` : route;
        return;
      }
      if (isKnownUnpublished(rel)) {
        // Degrade in place: the <a> becomes a <span>, keeping its label, dropping the
        // door. No array mutation, so the tree stays well-formed.
        node.tagName = 'span';
        node.properties = { class: 'text-slate-500 dark:text-slate-400' };
        return;
      }
      throw new Error(
        `[docs-site D4] Unresolvable link "${href}" in ${path.relative(repoRoot, srcPath || '?')}. ` +
          `It is neither a published doc, an external URL, nor a known-unpublished target ` +
          `(private tier / repo README / code / directory). Fix the link, or extend the ` +
          `known-unpublished rules if it is legitimately unpublished.`
      );
    };

    visit(tree);
  };
}
