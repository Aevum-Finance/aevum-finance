<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@43bf08e3/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience. A plain-language overview of how the web app's speed
     and size are measured and kept in check. The detailed audit (bundle decomposition,
     Lighthouse lab tier, warm-cost model) is the T2 companion internal/performance.md;
     the codebase's scope figures live in architecture.md ("By the numbers"). -->

# Performance

Aevum's web app is built to load fast and stay small. Speed and size are treated as
things you **measure and guard**, not assert.

## The load headline

<!-- BEGIN GENERATED:perf-summary -->

| Metric              | Value  |
| ------------------- | ------ |
| Entry bundle (gzip) | 101 kB |
| CSS (gzip)          | 18 kB  |
| Lazy chunks         | 226    |

<!-- END GENERATED:perf-summary -->

The entry bundle is what a first-time visitor downloads before anything renders; it's
held under a hard **size gate** (`npm run size`) on every build, so it cannot creep up
unnoticed. These figures come from the same `stats.frontend.json` the drift gate checks.

## How it's kept honest

The deeper numbers — per-chunk sizes, Lighthouse scores, the warm schedule — are captured
by the bench framework and preserved between regenerations. They are indicative, not
contractual (lab runs are median-of-N with jitter tamed). The full method and the live
tables are in the audit, [internal/performance.md](internal/performance.md).

Load size is only half the picture. A **field probe** measures what size gates and
headless tools can't: paint smoothness, scroll jank, and whether animations actually run
— in a real browser on a real device, Firefox included. The first app-wide sweep (all 39
pages) and the three measurement tiers live in the audit's
[field-probe + per-page inventory](internal/performance.md#field-perf-probe-t-perf-probe).

For the size and scale of the codebase (features, tests, lines of code), see
[architecture.md](architecture.md) → _By the numbers_.
