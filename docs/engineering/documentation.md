<!-- Engineering handbook. Audience: developers and AI who edit or extend the docs system.
     The aggregator's half of it — the mirror, the product merge, and the fold.
     ⚠️ This repo is PUBLIC. Mechanisms, triggers, secret NAMES and the scopes they need
     belong here; secret VALUES, expiries and rotation schedules never do. -->

# The documentation system — aggregator side

`aevum-finance` is the last stage of a documentation gradient that starts in two private
code lanes. This page is how that stage works: what it pulls, what it merges, what it
asserts, and what it will refuse to do. The lanes document their own halves in
`docs/internal/handbook/documentation.md` — same shape, one tier up the pipe.

Read this before adding a product topic, a generated region, or anything that reads a lane.

## The four tiers

Docs are one **audience gradient**, widest audience first:

| Tier | Where | Audience | Authored? |
| --- | --- | --- | --- |
| **T0** | [`docs/public/`](../public/) — **this repo** | product / users | hand |
| **T1** | each lane's `docs/` root + `docs/public/` | general / public-safe | hand, upstream |
| **T2** | each lane's `docs/internal/` + this page | developers + AI | hand |
| **T3** | each lane's `**/reference.md` | AI / precise lookup | **generated** upstream |

This repo holds **T0**, and a **mirror of T1** under [`docs/internal/`](../internal/).

⚠️ `docs/internal/` here does **not** mean what it means in a lane. In a lane it is the
private tier; here it is *other people's public content* — the mirrored T1. Nothing private
is in this repo, and nothing here is a place to put something private.

## The pipeline

Each stage reads what the one before it produced:

```
lane docs/**  ──sync-docs──▶  docs/internal/          the mirror (byte-faithful)
                                    │
        product-features.toml ──────┴──feature-index──▶  the topic roster
                                    │
                                    ├──build-public──▶  docs/public/*.md
                                    ├──inject-outer──▶  ARCHITECTURE.md regions
                                    ├──merge-stats───▶  aevum-stats.json + METRICS.md
                                    └──build-manual──▶  USER_GUIDE/user_manual.pdf
```

Invocation and flags are in [`tooling/README.md`](../../tooling/README.md); this page is
the *why*.

### The mirror — a pull, not a push

Both lanes are private. Their T1 docs are public-safe by tier definition, but a reader
cannot reach them, so this repo **pulls** each lane's `docs/**` — minus `internal/` (the
private tier) and `archive/` (frozen legacy) — into `docs/internal/<lane>/`. The tier
boundary IS the publish boundary; that single rule is what makes the copy safe.

The copy is **byte-faithful**. Nothing is rewritten on the way in — not links, not headings.
The moment the mirror edits its source it stops being evidence of anything.

**Provenance is per file.** Each doc is stamped with the commit that last touched *that
file*, not the lane HEAD, so an unrelated lane commit never re-stamps the tree. Markdown
carries the stamp inline; data sidecars (json/toml) cannot hold an HTML comment, so they are
recorded in the generated [`docs/internal/MIRROR.md`](../internal/MIRROR.md).

> ⚠️ **Lane clones must carry full history.** A shallow clone can only answer "which commit
> last touched this?" with HEAD, so every stamp silently collapses to the lane tip — a green
> run that writes wrong values, and a permanent fight with any full clone that disagrees.
> `sync-docs` **refuses** a shallow lane rather than mirroring it wrongly. In CI that means
> `fetch-depth: 0`; locally, `git fetch --unshallow`. This shipped broken once; the guard and
> its pinning tests exist because the failure has no symptom at the point of generation.

### The roster — the one thing no generator can derive

The product docs are cut along the product's **topic** axis; the lanes are organised along
their **module** axis. A topic can span several modules (`savings-account` ← `bank_accounts`
+ `treasury`), and one topic can absorb modules that split across lanes for implementation
reasons. Nothing in the code expresses that mapping, so it is authored in
`tooling/product-features.toml` — the outer analog of each lane's module manifest.

Being hand-authored, it is **asserted** against both mirrored manifests:

- **DANGLING** — a topic points at a module that is missing or infra-tier.
- **ORPHAN** — a `user_facing` module is claimed by no topic, and would silently vanish
  from the product docs.

Either fails the build. This is the distinction the whole CI posture rests on: a **generation
failure** (the human-owned manifest is wrong — a person must fix it) versus **drift** (the
output moved — fold it, don't fail). `tooling/docs-substrate.test.mjs` pins that the
assertions actually fire; a guard nobody tests is a guard nobody has.

### The merge — T0 is authored, not generated

`build-public` does **not** write product prose. Each topic doc is hand-written in the
product voice, fusing the backend's *mechanism* T1 with the frontend's *surface* T1. The
generator owns exactly one marked region per file, recording which mirrored lane docs that
topic reconciles.

That region is an HTML comment on purpose: **invisible to a reader** — a product page must
never show which module its content came from — but live for a maintainer, so an upstream
scope change surfaces here. Prose outside the region is never touched, and a newly declared
topic is scaffolded rather than silently forgotten.

Tier and audience labels are HTML comments at *every* tier. A reader is never shown which
bucket they were sorted into.

### The manual

Built from `docs/public` — prose and the images it embeds — in the roster's reading order,
so the manual and the docs it is made of cannot fall out of step. `USER_GUIDE/` holds only
the built PDF and the hash of its inputs.

The rebuild trigger is an **input hash**, never the PDF's own bytes: puppeteer stamps a
creation date, so comparing output would rebuild forever.

## The CI fold

Same posture as both lanes: **derived content never fails a build.** It is a pure function
of its inputs, so the honest response to drift is to correct it.

[`.github/workflows/docs.yml`](../../.github/workflows/docs.yml):

- **`check`** — fail-closed: the coverage assertion, the link gate, the tooling tests. Needs
  no lane access, so it runs on forks and PRs.
- **`fold`** — on main and a weekly cron: regenerates the mirror, the injected regions, the
  metrics and the PDF, and commits them back as *Aevum Docs Bot*.

The fold is the **sole owner of the PDF**, and it has no paths filter — deliberately. Every
route by which an input can change is a push to main: an edit here, a screenshot dispatched
from `aevum-web`, a brand mark from `aevum-brand`. A paths filter on a second workflow is
how the previous arrangement broke: it went on watching `USER_GUIDE/**` after the prose moved
to `docs/public/`, so it no longer watched its own sources.

The weekly cron is a deliberate stand-in for per-lane `repository_dispatch` (deferred): it
catches lane drift even when nothing is pushed here. Latency, not correctness.

> ⚠️ **`DOCS_TOKEN`** — both lanes are private, so the fold needs a PAT with **read** access
> to `aevum-api` and `aevum-web`, stored as a repository secret of that name. Only `fold`
> uses it; `check` passes without it. When it lapses the fold fails at checkout — loudly,
> which is the correct behaviour.

## What fails, and what folds

| Fails the build | Folds silently |
| --- | --- |
| coverage assertion (DANGLING / ORPHAN) | the mirror |
| a broken relative link | the generated regions in `docs/public` + `ARCHITECTURE.md` |
| a shallow lane clone | `aevum-stats.json` + `METRICS.md` |
| the tooling tests | the manual PDF |

## How to …

- **Add a product topic** → add `[topics.<slug>]` to `tooling/product-features.toml` naming
  the lane modules it covers, run `npm run public` to scaffold `docs/public/<slug>.md`, then
  write the prose. The roster drives the site nav, the manual's reading order and the
  ARCHITECTURE table, so nothing else needs telling.
- **A lane added a user-facing module** → the next fold fails with ORPHAN until a topic
  claims it. That is the feature: a new module cannot reach users undocumented.
- **Change what a topic covers** → edit the manifest, not the generated region. The region is
  overwritten on every fold.
- **Move an image** → it is a docs edit. Paths are relative and resolve identically in the
  repo, on GitHub and in the PDF, which is why the HTML is written into `docs/public` at
  build time rather than into a temp dir.
- **Never** hand-edit anything under `docs/internal/`, or between `BEGIN/END GENERATED`
  markers. Edit at source; the fold will overwrite you.
- **Screenshots and brand marks** are dispatched, never hand-dropped — see
  [CONTRIBUTING](../../CONTRIBUTING.md#documentation-screenshots).
