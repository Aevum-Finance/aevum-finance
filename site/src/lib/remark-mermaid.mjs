/*
 * D5 — swap each ```mermaid fence for its COMMITTED pre-rendered SVG
 * (docs/public/.mermaid/<hash>.svg, produced by tooling/render-mermaid.mjs). Inline
 * SVG only: no runtime mermaid script, so nothing to relax in the CSP (D7). A fence
 * with no committed SVG FAILS the build — a coverage gate, so a new/edited diagram
 * can't ship un-rendered.
 *
 * Runs on the markdown MDAST (before shiki), so the fence never becomes a code block.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function remarkMermaid({ repoRoot }) {
  const DIR = path.join(repoRoot, 'docs/public/.mermaid');
  const hash = (s) => createHash('sha256').update(s.trim()).digest('hex').slice(0, 16);

  return (tree, file) => {
    const visit = (node) => {
      if (!Array.isArray(node.children)) return;
      for (let i = 0; i < node.children.length; i++) {
        const c = node.children[i];
        if (c.type === 'code' && c.lang === 'mermaid') {
          const svgPath = path.join(DIR, `${hash(c.value)}.svg`);
          if (!existsSync(svgPath)) {
            throw new Error(
              `[docs-site D5] No pre-rendered SVG for a mermaid diagram in ` +
                `${file?.path ? path.relative(repoRoot, file.path) : '?'}. ` +
                `Run \`node tooling/render-mermaid.mjs\` and commit docs/public/.mermaid/.`
            );
          }
          node.children[i] = {
            type: 'html',
            value: `<figure class="mermaid-figure">${readFileSync(svgPath, 'utf8')}</figure>`,
          };
        } else {
          visit(c);
        }
      }
    };
    visit(tree);
  };
}
