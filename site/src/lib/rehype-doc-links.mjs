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
import { existsSync } from 'node:fs';
import path from 'node:path';
import { docBySource } from './docs-map.mjs';

export function rehypeDocLinks({ repoRoot }) {
  const DOCS = path.join(repoRoot, 'docs');
  const PUBLIC = path.join(repoRoot, 'docs/public');

  // Published? Ask the docs-map contract — the single authority on what is published and
  // where it routes (product AND engineering, both tiers). A target inside docs/ that the
  // contract doesn't list is unpublished; anything outside docs/ is not ours to route.
  const routeFor = (absTarget) => {
    const rel = path.relative(DOCS, absTarget);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
    return docBySource(rel.split(path.sep).join('/'))?.route ?? null;
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
      // A .md link to a real doc we chose NOT to publish (e.g. a module retelling the
      // engineering section drops) degrades too — it exists, it's just not routed.
      if (isKnownUnpublished(rel) || (/\.md$/.test(rel) && existsSync(absTarget))) {
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
