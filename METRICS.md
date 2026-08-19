<!-- AUTO-GENERATED from aevum-stats.json by tooling/merge-stats.mjs — do not hand-edit. -->

# Aevum — by the numbers

_Generated 2026-08-19 · backend @ da0dbbf1 · frontend @ aa4009c5._

Engineering metrics for Aevum, merged from each submodule’s per-lane stats. Full
machine-readable detail in [`aevum-stats.json`](aevum-stats.json); per-lane sources in
[`docs/internal/backend/stats.backend.json`](docs/internal/backend/stats.backend.json) and
[`docs/internal/frontend/stats.frontend.json`](docs/internal/frontend/stats.frontend.json).

## Scale

| | Backend | Frontend |
| --- | ---: | ---: |
| Feature modules | 25 | 18 |
| Tests | 1,655 | 1,388 |
| Code lines (ex. blanks/comments) | 52,456 | 87,754 |

## Backend — API & domain engine

- **25 feature modules** · 57 data models · 156 REST endpoints (34 routers) · 8 scheduled workers
- **1,655 tests** (pytest) · complexity avg A (2.73) · maintainability grade A on 99.4% of modules
- **52,456 SLOC** (28,518 app / 23,938 tests)
- **API latency** (local/staging, concurrency 4): reads p50 ~20–51 ms; create-transaction (full tax recalc) p50 ~206 ms

## Frontend — React SPA

- **18 feature modules** · 4,080 functions · **1,388 tests** (vitest, 235 files)
- **87,754 SLOC** (63,901 src / 23,853 tests)
- **Entry bundle 103.9 kB** gzip · 18.3 kB CSS · 226 chunks
- **Lighthouse** (mobile, slow-4G): performance 86–99 across 8 routes

## Notes

Tier-2 numbers (API latency, bundle sizes, Lighthouse) are **indicative, not contractual** —
measured in a local/staging environment and preserved between static regenerations. See each
lane’s `performance.md` ([backend](docs/internal/backend/performance.md) ·
[frontend](docs/internal/frontend/performance.md)) for methodology and the full hot-path tables.
