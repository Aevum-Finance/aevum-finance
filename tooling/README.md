# Tooling

The outer monorepo's **single code home**. Everything else at the repo root is the
product / marketing surface (README, USER_GUIDE, ARCHITECTURE); all executable tooling
lives here. Each script reads a source of truth and (re)generates a committed artifact at
the repo root — it never hand-authors content.

## What it does

- **`npm run stats`** — merges the two submodules' per-lane stats
  ([`backend/docs/stats.backend.json`](../backend/docs/stats.backend.json) +
  [`frontend/docs/stats.frontend.json`](../frontend/docs/stats.frontend.json)) into the
  root **`aevum-stats.json`** (machine-readable, the single pull point for any downstream
  consumer) and a curated **`METRICS.md`** (human-readable "by the numbers"). The per-lane
  files are deterministic; the publish date + submodule SHAs are stamped here, at the merge
  — the moment the numbers lock against each lane's pinned commit.
  `--check` exits non-zero if the committed outputs are stale; `--stdout` prints the JSON
  without writing; `AS_OF=YYYY-MM-DD` pins the publish date.
- **`npm run sync-branding`** — vendors the brand source into this repo:
  copies [`backend/app/constants/branding.json`](../backend/app/constants/branding.json)
  (the authoring SoT — the backend consumes it at runtime) → local **`tooling/branding.json`**,
  a byte-identical mirror. `sync-readme` and `manual` read this local copy, **never across the
  submodule boundary**, so they keep working once the submodules go private. `--check` fails if
  the vendored copy is stale. (Edit brand strings in the backend source, then re-run this.)
- **`npm run sync-readme`** — regenerates the `<!-- BRAND:start -->` … `<!-- BRAND:end -->`
  block in the root `README.md` from the vendored `tooling/branding.json` (name / tagline /
  description).
- **`npm run manual`** — concatenates the topic-wise [USER_GUIDE](../USER_GUIDE/) docs into
  one marketable **`USER_GUIDE/user_manual.pdf`** with a generated cover, table of contents,
  page numbers, rendered Mermaid diagrams, and the screenshots from `USER_GUIDE/images/`.
- **`npm run build`** — the cheap aggregate: `sync-readme` + `stats`. (Excludes `manual`,
  which is heavy — puppeteer + network.)

## Usage

```bash
cd tooling
npm run stats          # → ../aevum-stats.json + ../METRICS.md   (no deps needed — pure Node stdlib)
npm run sync-branding  # → refresh tooling/branding.json from the backend source (no deps)
npm run sync-readme    # → updates ../README.md brand block       (no deps needed)
npm install            # installs puppeteer (downloads Chromium) + marked — only for `manual`
npm run manual         # → ../USER_GUIDE/user_manual.pdf
```

`stats` and `sync-readme` use only the Node standard library, so they run without
`npm install`. Only `manual` needs the dependencies.

## Notes

- **Generated artifacts, not sources.** `aevum-stats.json`, `METRICS.md`, `tooling/branding.json`
  (a vendored mirror of the backend source), and the README brand block are all generated — edit
  the upstream source (per-lane stats, the backend's `branding.json`) or the generator here, never
  the output.
- **Brand SoT is the backend, for now.** The brand strings are authored in the backend and vendored
  here. An eventual re-homing (brand *voice* authored in this public outer repo, submodules
  mirroring it) is a documentation-architecture decision, not settled here.
- **Screenshots first** (for `manual`). The PDF embeds the images the docs reference under
  `USER_GUIDE/images/`; capture those before building, or those spots render as broken-image
  icons (everything else is complete).
- **Mermaid** (for `manual`) is rendered to static SVG in a headless browser before capture;
  it needs network access at build time (mermaid loads from a CDN).
- This folder ships with the repo (publishable on GitHub); the generated PDF lands in
  `USER_GUIDE/` alongside the docs.
