<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@34999cd1/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience. A plain-language overview of how the backend's
     speed is measured and kept in check. The detailed audit (micro-benchmarks,
     latency, methodology) is the T2 companion internal/performance.md; the codebase's
     size/scale figures live in architecture.md ("By the numbers"). -->

# Performance

Aevum's backend is deliberately small and measured. Speed is treated as something you
**measure and preserve**, not something you assert.

The detail — per-module micro-benchmarks, end-to-end request latency, the live engine
hot-paths, and how every number is captured — is in the audit,
[internal/performance.md](internal/performance.md).

## How it's kept honest

Performance is a **release-captured** measurement, not a live one: the micro-benchmarks
run against the same `postgres:16-alpine` testcontainer the suite uses, and their numbers
are preserved between regenerations. They are indicative, not contractual — Postgres over
a real connection is noisier than a toy database, and ±20% run-to-run variance is normal,
so a metric is a regression signal only when it moves well outside that band.

For the size and scale of the codebase (modules, endpoints, tests, lines of code), see
[architecture.md](architecture.md) → *By the numbers*.
