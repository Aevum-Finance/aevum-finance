# Docs tooling

One-shot tooling that turns the topic-wise [USER_GUIDE](../USER_GUIDE/) docs into
a single, marketable **`USER_GUIDE/user_manual.pdf`**, and keeps the monorepo
README's brand block in sync with the single source of truth. It lives at the
repo root (not under `USER_GUIDE/`) because it also writes the root `README.md`.

## What it does

- **`npm run manual`** — concatenates the guide docs (in the same logical order
  as [USER_GUIDE/README.md](../USER_GUIDE/README.md)) into one PDF with a
  generated cover, a table of contents, page numbers, rendered Mermaid diagrams,
  and the screenshots from `USER_GUIDE/images/`. No intermediate `.md` is written
  — the assembly happens in memory. Output: `USER_GUIDE/user_manual.pdf`.
- **`npm run sync-readme`** — regenerates the `<!-- BRAND:start -->` … `<!-- BRAND:end -->`
  block in the monorepo `README.md` from
  [`backend/app/constants/branding.json`](../backend/app/constants/branding.json),
  the single source of brand metadata (name / tagline / description) shared with
  the backend.

## Usage

```bash
cd docs-tooling
npm install          # installs puppeteer (downloads Chromium) + marked
npm run manual       # → ../USER_GUIDE/user_manual.pdf
npm run sync-readme  # → updates ../README.md brand block
```

## Notes

- **Screenshots first.** The PDF embeds the images the docs reference under
  `USER_GUIDE/images/`. Capture those before building, or those spots render as
  broken-image icons (everything else is complete).
- **Brand metadata is single-sourced.** Edit `branding.json`, then
  `npm run sync-readme` for the README. The PDF cover reads the same JSON.
- **Mermaid** is rendered to static SVG in a headless browser before the PDF is
  captured (no async race). Needs network access at build time (mermaid is
  loaded from a CDN).
- **Logo.** The cover uses the text wordmark; drop a logo into the cover by
  extending `build-manual.mjs` once a brand SVG exists.
- This folder ships with the repo (publishable on GitHub); the generated PDF
  lands in `USER_GUIDE/` alongside the docs.
