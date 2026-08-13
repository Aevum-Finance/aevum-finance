<!-- AUTO-GENERATED from aevum-stats.json by tooling/merge-stats.mjs — do not hand-edit. -->

# Aevum — by the numbers

_Generated 2026-08-13 · backend @ ed1b2e1e · frontend @ 0b88db8b._

Engineering metrics for Aevum, merged from each submodule’s per-lane stats. Full
machine-readable detail in [`aevum-stats.json`](aevum-stats.json); per-lane sources in
[`docs/internal/backend/stats.backend.json`](docs/internal/backend/stats.backend.json) and
[`docs/internal/frontend/stats.frontend.json`](docs/internal/frontend/stats.frontend.json).

## Scale

| | Backend | Frontend |
| --- | ---: | ---: |
| Feature modules | 25 | 18 |
| Tests | 1,503 | 1,324 |
| Code lines (ex. blanks/comments) | 48,474 | 86,110 |

## Backend — API & domain engine

- **25 feature modules** · 56 data models · 154 REST endpoints (33 routers) · 8 scheduled workers
- **1,503 tests** (pytest) · complexity avg A (2.69) · maintainability grade A on 99.3% of modules
- **48,474 SLOC** (27,258 app / 21,216 tests)
- **API latency** (local/staging, concurrency 4): reads p50 ~20–51 ms; create-transaction (full tax recalc) p50 ~206 ms

## Frontend — React SPA

- **18 feature modules** · 3,998 functions · **1,324 tests** (vitest, 224 files)
- **86,110 SLOC** (63,264 src / 22,846 tests)
- **Entry bundle 103.6 kB** gzip · 18.3 kB CSS · 225 chunks
- **Lighthouse** (mobile, slow-4G): performance 86–99 across 8 routes

## Notes

Tier-2 numbers (API latency, bundle sizes, Lighthouse) are **indicative, not contractual** —
measured in a local/staging environment and preserved between static regenerations. See each
lane’s `performance.md` ([backend](docs/internal/backend/performance.md) ·
[frontend](docs/internal/frontend/performance.md)) for methodology and the full hot-path tables.
