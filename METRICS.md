<!-- AUTO-GENERATED from aevum-stats.json by tooling/merge-stats.mjs — do not hand-edit. -->

# Aevum — by the numbers

_Generated 2026-07-23 · backend @ e09e7c9e · frontend @ b006f48c._

Engineering metrics for Aevum, merged from each submodule’s per-lane stats. Full
machine-readable detail in [`aevum-stats.json`](aevum-stats.json); per-lane sources in
[`docs/internal/backend/stats.backend.json`](docs/internal/backend/stats.backend.json) and
[`docs/internal/frontend/stats.frontend.json`](docs/internal/frontend/stats.frontend.json).

## Scale

| | Backend | Frontend |
| --- | ---: | ---: |
| Feature modules | 21 | 16 |
| Tests | 1,215 | 924 |
| Code lines (ex. blanks/comments) | 41,683 | 73,613 |

## Backend — API & domain engine

- **21 feature modules** · 54 data models · 141 REST endpoints (28 routers) · 8 scheduled workers
- **1,215 tests** (pytest) · complexity avg A (2.67) · maintainability grade A on 99.3% of modules
- **41,683 SLOC** (24,227 app / 17,456 tests)
- **API latency** (local/staging, concurrency 4): reads p50 ~20–51 ms; create-transaction (full tax recalc) p50 ~206 ms

## Frontend — React SPA

- **16 feature modules** · 3,502 functions · **924 tests** (vitest, 183 files)
- **73,613 SLOC** (55,915 src / 17,698 tests)
- **Entry bundle 101.7 kB** gzip · 17.8 kB CSS · 198 chunks
- **Lighthouse** (mobile, slow-4G): performance 86–99 across 8 routes

## Notes

Tier-2 numbers (API latency, bundle sizes, Lighthouse) are **indicative, not contractual** —
measured in a local/staging environment and preserved between static regenerations. See each
lane’s `performance.md` ([backend](docs/internal/backend/performance.md) ·
[frontend](docs/internal/frontend/performance.md)) for methodology and the full hot-path tables.
