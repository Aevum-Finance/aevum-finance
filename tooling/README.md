# Tooling

This repo's **single code home** — everything else at the root is content. Each script reads
a source of truth and regenerates a committed artifact; none of them hand-author anything.

**This is a run-book: what each script produces and how to invoke it.** For *why* the
pipeline is shaped this way — the tiers, the mirror's provenance rules, the coverage
assertion, the fold posture — see
[`docs/engineering/documentation.md`](../docs/engineering/documentation.md).

## Scripts

| Command | Produces | `--check` |
| --- | --- | --- |
| `npm run docs` | [`docs/internal/`](../docs/internal/) — each lane's public docs, mirrored + stamped | ✅ |
| `npm run features` | the product-topic roster (stdout; every other stage consumes it) | ✅ |
| `npm run public` | the generated provenance regions in [`docs/public/`](../docs/public/) | ✅ |
| `npm run outer` | the generated regions in [`ARCHITECTURE.md`](../ARCHITECTURE.md) | ✅ |
| `npm run stats` | [`aevum-stats.json`](../aevum-stats.json) + [`METRICS.md`](../METRICS.md) | ✅ |
| `npm run sync-branding` | `tooling/branding.json` (a vendored brand copy) | ✅ |
| `npm run sync-readme` | the `BRAND` block in the root [README](../README.md) | — |
| `npm run manual` | `USER_GUIDE/user_manual.pdf` + its input hash | ✅ |
| `npm run links` | nothing — fails on a broken relative link | — |
| `npm test` | nothing — the tooling's own tests | — |
| `npm run build` | everything cheap: branding · readme · stats · docs · public · outer | — |
| `npm run check` | what CI gates on: features · links · tests · public · outer | — |

`--check` exits non-zero when the committed output is stale. `stats` also takes `--stdout`
(print, don't write) and `AS_OF=YYYY-MM-DD` (pin the publish date).

## Running it

```bash
cd tooling
npm install      # only `manual` needs deps (puppeteer + marked + mermaid)
npm run build    # everything except the PDF
npm run manual   # → ../USER_GUIDE/user_manual.pdf
npm run check    # the gates, before you push
```

Everything except `manual` is Node stdlib only and runs without `npm install` — which is
why `toml-lite.mjs` exists rather than a TOML dependency.

## Where the lanes come from

`lanes.mjs` resolves the two lane clones as **siblings of this repo**;
`AEVUM_BACKEND_DIR` / `AEVUM_FRONTEND_DIR` override that, which is how CI points at its own
checkouts. Only `docs` and `stats` read a lane — everything downstream reads the mirror, so
the rest of the pipeline runs from a bare clone of this repo alone.

⚠️ A lane clone must have **full history** (`fetch-depth: 0` in CI). `sync-docs` refuses a
shallow one: per-file provenance cannot be resolved without history, and the failure is
otherwise silent. See the handbook.

## Notes

- **Generated, not sources.** `docs/internal/`, the marked regions in `docs/public/` and
  `ARCHITECTURE.md`, `aevum-stats.json`, `METRICS.md`, the README brand block and the PDF.
  Edit the upstream source or the generator — never the output.
- **Brand SoT is the private `aevum-brand` repo.** Its dispatcher pushes `branding.json`
  here and the marks into `docs/public/images/brand/`. `sync-branding` re-derives the
  vendored copy and survives as a drift check; do not edit brand strings to change them.
- **Screenshots come from `aevum-web` CI**, never a hand-drop —
  [CONTRIBUTING](../CONTRIBUTING.md#documentation-screenshots) has the ownership split.
- **Mermaid** renders to static SVG in a headless browser and loads from a CDN, so `manual`
  needs network access at build time.
