/*
 * Build-time Content-Security-Policy for docs.aevumfinance.com — ported from
 * aevum-web's bench/vite-csp-headers.mjs (T-docs-site D7). A strict `script-src`
 * needs the sha256 of every INLINE <script> in the built HTML (here: the no-FOUC
 * theme/a11y bootstrap in Base.astro, identical on every page). The hash is DERIVED
 * from this build's dist/ and APPENDED to dist/_headers, where it cannot drift — CF
 * Pages rebuilds on every deploy, so it auto-rotates.
 *
 * FAIL-OPEN: the four static headers live in public/_headers; only the CSP is
 * appended. If this ever finds zero inline scripts (a sign the HTML changed shape),
 * it throws rather than emit a hash-less script-src that would silently block the
 * bootstrap on every page.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const INLINE_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;

function walkHtml(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// sha256 tokens for every INLINE <script> (no src=) across all pages, deduped.
const hashes = new Set();
for (const file of walkHtml(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(INLINE_SCRIPT)) {
    if (/\ssrc[=\s]/.test(m[1])) continue; // external module scripts → script-src 'self'
    hashes.add(`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
  }
}

if (hashes.size === 0) {
  throw new Error(
    '[emit-csp] found no inline scripts in dist/ — refusing to emit a hash-less ' +
      'script-src that would block the no-FOUC bootstrap. Did the HTML shape change?'
  );
}

const policy = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(' ')}`,
  // 'unsafe-inline' for styles: the pre-rendered mermaid SVGs carry inline <style>
  // blocks. Mirrors aevum-web; browsers ignore it for scripts once a hash is present.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const headersPath = path.join(DIST, '_headers');
let text = readFileSync(headersPath, 'utf8');
// Insert the CSP as the first header under the global `/*` block.
text = text.replace(/^\/\*\n/m, `/*\n  Content-Security-Policy: ${policy}\n`);
writeFileSync(headersPath, text);

console.log(`[emit-csp] CSP appended with ${hashes.size} inline-script hash(es).`);
