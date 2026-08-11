<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@67f5a716/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience. An orientation map, not a spec: enough to know
     what the backend is and where each piece lives, then links down to the
     developer detail. Keep it a signpost — the exhaustive wiring rationale is
     internal/architecture.md, and each feature's internals are on its own
     internal/modules/<x>/README.md. -->

# Backend architecture

Aevum's backend is a **FastAPI** service written in a **feature-based
("screaming") architecture**: the directory layout names the business, not the
framework. Every capability — transactions, taxation, budgets, auth — owns its
models, schemas, services and routes together in one place, so you can find a
feature by its name and read it end to end.

It runs **async-only** over **PostgreSQL** (via `asyncpg`), with **Redis** for
caching, locks and rate limiting, and **Alembic** owning the schema. Every route
is mounted under `/api/v1/`.

## The shape of the codebase

<!-- BEGIN GENERATED:dir-tree -->

```text
app/
├── core/       # infrastructure: config, the async DB engine, cache, scheduler, storage, middleware, the model registry
├── shared/     # ownerless cross-feature helpers (serial ids, calendar periods, password hashing / encryption) that depend only on core
├── constants/  # system-wide constants and reference data — one import surface
├── db/         # first-run migrate + seed
├── modules/    # the features — one directory each (see below)
├── web/        # the server-rendered landing page route (outside /api/v1)
└── main.py     # entrypoint: wires every router under /api/v1
```

<!-- END GENERATED:dir-tree -->

The rule that keeps it navigable: features never reach into each other's
internals. A module talks to another only through that module's public service
layer, and reads settings from `core` and `constants` — never from a sibling.
The layering runs one way: `core` ← `shared` ← `modules`.

Inside a single feature the split is always the same:

```text
*_routes.py     the HTTP layer — request in, response out
*_services.py   the business logic — owns the work and the transaction
*_schemas.py    request/response shapes
*_models.py     the database tables
```

## By the numbers

The scale of the codebase, generated from the same `stats.backend.json` the drift
gate checks — so these figures never drift from what CI enforces:

<!-- BEGIN GENERATED:stats-summary -->

| Metric                     | Value       |
| -------------------------- | ----------- |
| Feature modules            | 25          |
| Database models            | 56          |
| API endpoints              | 153         |
| Tests                      | 1,446       |
| Application code           | 26,777 SLOC |
| Avg. cyclomatic complexity | A (2.66)    |

<!-- END GENERATED:stats-summary -->

## The domain flow

The heart of Aevum is a self-imposed "consumption tax" that turns spending into
saving. A transaction travels through a chain of features, each handing off to
the next:

1. A **transaction** is recorded — typed in by hand or imported from a bank /
   UPI statement. It is the raw record: what moved, which way, when.
2. Aevum works out **who** it was with (beneficiaries and relationships) and
   **categorizes** it into tags.
3. The **taxation** engine reads those tags, applies the user's per-category
   rate, and accrues a small tax onto that week's bill; a breached **budget**
   adds a penalty on top.
4. The weekly **bill** finalizes when the week closes, and settling it moves
   real money into a **savings account** — the ledger the **treasury** keeps.

A single edit anywhere upstream ripples forward through the same chain, which is
why the numbers always stay in step.

## The features

Grouped by what they do:

- **Money in:** transactions, ledger_pipeline (the shared ingestion path),
  bank_accounts, beneficiaries, relationships, registry.
- **Making sense of it:** categorization, tags, budgets, recurring.
- **The tax engine:** taxation, treasury.
- **The account:** auth, users, onboarding, admin.
- **Around the edges:** activity (the feed), notifications (email), metadata
  (reference data), exports, cemetery (deletion retention).

## Going deeper

- Full wiring, the resolved-ledger model, the request lifecycle and the
  scheduler → **[internal/architecture.md](internal/architecture.md)**.
- What each feature does, in plain language → the per-feature pages under
  **[public/](public/)** (for example [public/taxation.md](public/taxation.md)).
- How a feature works inside, and why → its
  **[internal/modules/\<feature>/README.md](internal/modules/taxation/README.md)**.
- The whole docs tree, with a starting point → **[README.md](README.md)**.
