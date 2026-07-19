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
- **`npm run sync-branding`** — vendors a brand copy into this repo from
  [`backend/app/constants/branding.json`](../backend/app/constants/branding.json) → local
  **`tooling/branding.json`**. `sync-readme` and `manual` read this local copy, **never across
  the submodule boundary**, so they keep working once the submodules go private. `--check`
  fails if the vendored copy is stale.

  ⚠️ **Neither end of that copy is the SoT any more.** Since 2026-07-19 the brand source is the
  PRIVATE `aevum-brand` repo, whose dispatcher pushes `branding.json` **directly** into this
  repo's `tooling/branding.json` (and independently into the backend's copy) per
  `brand-manifest.json`. So `sync-branding` now re-derives a mirror from a mirror — harmless,
  and still useful as a drift check, but **do not edit brand strings in the backend to change
  them.** Edit them in `aevum-brand` and let the dispatcher push. The first dispatch found this
  repo's copy was missing `headline` and the entire `assets` block.
- **`npm run sync-readme`** — regenerates the `<!-- BRAND:start -->` … `<!-- BRAND:end -->`
  block in the root `README.md` from the vendored `tooling/branding.json` (name / tagline /
  description).
- **`npm run manual`** — concatenates the topic-wise [USER_GUIDE](../USER_GUIDE/) docs into
  one marketable **`USER_GUIDE/user_manual.pdf`** with a generated cover, table of contents,
  page numbers, rendered Mermaid diagrams, and the screenshots from `USER_GUIDE/images/screenshots/`.
- **`npm run manual:check`** — exits non-zero if the docs or images have moved since
  `user_manual.pdf` was built. Compares an **input hash**
  (`USER_GUIDE/.manual-inputs.sha256`), never the PDF's own bytes: the PDF carries a build
  timestamp and puppeteer embeds a creation date, so its bytes change on every build and
  comparing them would rebuild forever. `npm run manual` records a fresh hash as it builds,
  so the two cannot fall out of step. `.github/workflows/manual.yml` runs this on every push
  that touches `USER_GUIDE/` and rebuilds when it fails.
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
  (pushed by `aevum-brand`), and the README brand block are all generated — edit the upstream
  source (per-lane stats; brand copy in `aevum-brand/branding.json`) or the generator here,
  never the output.
- **Brand SoT is the private `aevum-brand` repo** (settled 2026-07-19). The re-homing this note
  used to call unsettled has happened — and it went to a private repo, NOT to this public outer
  one. `.github` was the earlier candidate and was rejected once privacy became a requirement:
  it is structurally always-public, which is the very property that first recommended it.
- **Screenshots first** (for `manual`). The PDF embeds the images the docs reference under
  `USER_GUIDE/images/screenshots/`, which are generated in `aevum-web`'s CI and dispatched
  here as a PR — never hand-dropped. Until they land, those spots render as broken-image
  icons (everything else is complete). Product banners sit alongside in `images/brand/`,
  owned by the `aevum-brand` dispatcher.

  **The capture script itself is no longer here.** It lives in `aevum-web` beside the
  gallery and the `*View`s it shoots, because the drift trigger for a screenshot is that
  view's snapshot test — a trigger a repo away from its subject cannot gate. This repo is
  the consumer: images arrive by PR, and merging one rebuilds the PDF.
- **Mermaid** (for `manual`) is rendered to static SVG in a headless browser before capture;
  it needs network access at build time (mermaid loads from a CDN).
- This folder ships with the repo (publishable on GitHub); the generated PDF lands in
  `USER_GUIDE/` alongside the docs.
