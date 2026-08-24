<!-- AUTO-GENERATED from aevum-stats.json by tooling/merge-stats.mjs — do not hand-edit. -->

# Aevum — by the numbers

_Generated 2026-08-24 · backend @ 12c2032f · frontend @ 67671c44._

Engineering metrics for Aevum, merged from each submodule’s per-lane stats. Full
machine-readable detail in [`aevum-stats.json`](aevum-stats.json); per-lane sources in
[`docs/internal/backend/stats.backend.json`](docs/internal/backend/stats.backend.json) and
[`docs/internal/frontend/stats.frontend.json`](docs/internal/frontend/stats.frontend.json).

## Scale

| | Backend | Frontend |
| --- | ---: | ---: |
| Feature modules | 25 | 18 |
| Tests | 1,816 | 1,542 |
| Code lines (ex. blanks/comments) | 55,271 | 93,855 |

## Backend — API & domain engine

- **25 feature modules** · 57 data models · 162 REST endpoints (34 routers) · 8 scheduled workers
- **1,816 tests** (pytest) · complexity avg A (2.75) · maintainability grade A on 99.4% of modules
- **55,271 SLOC** (29,733 app / 25,538 tests)
- **API latency** (local/staging, concurrency 4): reads p50 ~20–51 ms; create-transaction (full tax recalc) p50 ~206 ms

## Frontend — React SPA

- **18 feature modules** · null functions · **1,542 tests** (vitest, 254 files)
- **93,855 SLOC** (67,785 src / 26,070 tests)
- **Entry bundle 104.5 kB** gzip · 18.4 kB CSS · 231 chunks
- **Lighthouse** (mobile, slow-4G): performance 86–99 across 8 routes

## Notes

Tier-2 numbers (API latency, bundle sizes, Lighthouse) are **indicative, not contractual** —
measured in a local/staging environment and preserved between static regenerations. See each
lane’s `performance.md` ([backend](docs/internal/backend/performance.md) ·
[frontend](docs/internal/frontend/performance.md)) for methodology and the full hot-path tables.
