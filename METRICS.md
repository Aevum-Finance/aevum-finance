<!-- AUTO-GENERATED from aevum-stats.json by tooling/merge-stats.mjs — do not hand-edit. -->

# Aevum — by the numbers

_Generated 2026-07-15 · backend @ 1d4dbcd · frontend @ f91f6c18._

Engineering metrics for Aevum, merged from each submodule’s per-lane stats. Full
machine-readable detail in [`aevum-stats.json`](aevum-stats.json); per-lane sources in
[`backend/docs/stats.backend.json`](backend/docs/stats.backend.json) and
[`frontend/docs/stats.frontend.json`](frontend/docs/stats.frontend.json).

## Scale

| | Backend | Frontend |
| --- | ---: | ---: |
| Feature modules | 21 | 16 |
| Tests | 1,098 | 824 |
| Code lines (ex. blanks/comments) | 40,494 | 64,849 |

## Backend — API & domain engine

- **21 feature modules** · 54 data models · 141 REST endpoints (28 routers) · 8 scheduled workers
- **1,098 tests** (pytest) · complexity avg A (2.64) · maintainability grade A on 99.2% of modules
- **40,494 SLOC** (23,745 app / 16,749 tests)
- **API latency** (local/staging, concurrency 4): reads p50 ~20–51 ms; create-transaction (full tax recalc) p50 ~206 ms

## Frontend — React SPA

- **16 feature modules** · 3,174 functions · **824 tests** (vitest, 169 files)
- **64,849 SLOC** (48,816 src / 16,033 tests)
- **Entry bundle 97.2 kB** gzip · 16.5 kB CSS · 170 chunks
- **Lighthouse** (mobile, slow-4G): performance 86–99 across 8 routes

## Notes

Tier-2 numbers (API latency, bundle sizes, Lighthouse) are **indicative, not contractual** —
measured in a local/staging environment and preserved between static regenerations. See each
lane’s `performance.md` ([backend](backend/docs/performance.md) ·
[frontend](frontend/docs/performance.md)) for methodology and the full hot-path tables.
