# Contributing to Aevum

Everything a developer needs to clone, run, test, and contribute to Aevum. For
*how the pieces fit together*, read [ARCHITECTURE.md](ARCHITECTURE.md) first;
for *what the app does*, see the [User Guide](docs/public/README.md).

Aevum is built as two repositories — a **FastAPI** backend (`aevum-api`) and a
**React** frontend (`aevum-web`). All development happens *in those repos*. This
repo does not contain application code: it is Aevum's public home, carrying the
product documentation and a mirror of each lane's own docs.

## Tech stack

| | Backend (`aevum-api`) | Frontend (`aevum-web`) |
| --- | --- | --- |
| Language | Python 3.13 | TypeScript 5.9 |
| Framework | FastAPI | React 18 |
| Build / run | uvicorn | Vite 6 |
| Data | PostgreSQL (async, asyncpg) · Alembic migrations | — |
| Coordination | Redis (locks, caches, rate limits) | — |
| State | SQLAlchemy 2.0 (async ORM) | Zustand + TanStack Query |
| Tests | pytest (Postgres testcontainer) | Vitest (happy-dom) |
| Lint / format | ruff | ESLint + Prettier |

## Clone

**The two lanes are private repositories**, and this repo does not track them —
it mirrors their public docs instead, so everything published here reads from a
plain clone with no access to either lane.

To actually run Aevum you need access to both. Clone them as **siblings**, which
is the layout the doc tooling expects:

```bash
git clone <outer-url>       aevum-finance
git clone <aevum-api-url>   aevum-api      # the backend lane
git clone <aevum-web-url>   aevum-web      # the frontend lane
```

The setup steps below run inside `aevum-api/` and `aevum-web/` respectively.

## Backend setup

Postgres + Redis run via docker-compose; the app and its tooling run in a venv.

```bash
cd aevum-api
docker compose up -d                                   # Postgres + Redis

python -m venv .venv
source .venv/bin/activate                              # .venv\Scripts\activate on Windows
.venv/bin/pip install -r requirements.txt -r requirements-dev.txt

cp .env.example .env                                   # then fill in the REQUIRED vars
.venv/bin/python -m app.db.init_db                     # migrate + seed (also auto-runs on startup)
.venv/bin/python run.py                                # dev server on http://localhost:4000
```

API docs once it's up: <http://localhost:4000/docs> (Swagger) and
<http://localhost:4000/redoc>. The full env-var reference is in
the backend lane's own `README.md`; the deeper architecture rules are in its
`CONTRIBUTING.md`.

> `run.py` enables hot-reload only outside production (it gates on `NODE_ENV`).
> On Render the app runs from the Dockerfile command, not `run.py`.

## Frontend setup

```bash
cd aevum-web
npm install
npm run dev                                            # Vite dev server on http://localhost:5173
```

The frontend talks to the backend over `/api/v1/*`. Override the API base with
`VITE_API_URL` (default `http://localhost:4000`) — **no trailing slash**, or
URLs end up double-slashed.

## Common commands

**Backend** (from `aevum-api/`, with the venv active):

```bash
.venv/bin/pytest                                       # full suite (ephemeral Postgres testcontainer)
.venv/bin/pytest path/to/test_file.py::test_name       # one test
.venv/bin/pytest --cov=app --cov-config=tests/.coveragerc --cov-report=term-missing
ruff check .                                            # lint (E501 line-length intentionally ignored)
```

**Frontend** (from `aevum-web/`):

```bash
npm test                                               # Vitest run
npm run typecheck                                      # tsc --noEmit (strict)
npm run lint                                            # ESLint — gate is 0 errors / 0 warnings
npm run build                                           # production build to dist/
npm run gen:api                                         # regenerate API types from the backend OpenAPI schema
```

## Configuration

- **Backend** is configured entirely through environment variables (`.env` in
  development, the host's dashboard in production). `.env.example` lists them;
  the required ones block boot if unset. Never commit real secrets.
- **Frontend** reads `VITE_API_URL` at build time. Nothing else is required for
  local dev.

## Conventions

Each lane documents its own conventions in depth — read them before a first
contribution:

- **Backend** — feature-based modules, async-only data access, dependency
  injection, services own business logic. See
  the `aevum-api` lane's `CONTRIBUTING.md` and its engineering handbook at
  `docs/internal/handbook/engineering.md`.
- **Frontend** — feature isolation enforced by `eslint-plugin-boundaries`,
  modal-first CRUD, typed API layer per feature. See
  the `aevum-web` lane's `CONTRIBUTING.md` and its engineering handbook at
  `docs/internal/handbook/engineering.md`.

A couple of cross-repo rules:

- **Commit in the lane that owns the change.** A backend change is committed in
  `aevum-api`, a frontend change in `aevum-web`. This repo is never where code
  changes land — it only ever carries docs and the tooling that aggregates them.
- **Keep a change within one lane where possible.** Cross-stack work is two
  commits in two repos, coordinated — not one commit that reaches across.
- **Docs live with the code they describe.** Each lane authors its own docs;
  this repo mirrors the public ones and merges them into the product docs. Fix a
  lane's doc *in that lane* — a mirrored copy here is output, and the next fold
  overwrites it.

This repo's own half of that system — the mirror, the topic roster and its coverage
assertion, the product merge, and the CI fold — is documented in
[`docs/engineering/documentation.md`](docs/engineering/documentation.md). Read it before
adding a product topic or touching anything generated.

## Tests & quality gates

- Backend: `pytest` must pass; `ruff` clean.
- Frontend: `npm test` green, `npm run typecheck` clean, `npm run lint` at zero
  warnings, and `npm run build` succeeds.

Run the relevant gate before you push; both lanes treat a red gate as
blocking.

## Try Aevum with sample data

[**synthetic-statement**](https://github.com/RohitSSolanki/synthetic-statement) generates
**synthetic** bank/UPI statements and renders them as PhonePe / Paytm / Google Pay-styled
PDFs. It's how you (or a privacy-conscious new user) can explore Aevum end-to-end without
touching real financial data — and it's also what the import pipeline is tested against.

The zero-setup way is the hosted, in-browser generator — compute stays in your browser,
nothing is uploaded:

> **<https://synth.rohitsolanki.in/>** — pick options, download a PDF / CSV / JSON.

Or install the package (it's `pip`-installable — formerly the vendored `dummy-statement`
submodule) and generate locally:

```bash
pip install "synthetic-statement[pdf] @ git+https://github.com/RohitSSolanki/synthetic-statement@main"

synthetic-statement --yes --seed 7 --range 2026-01-05:2026-01-25 --output-dir runs/demo
python -m synthetic_statement.render_statement runs/demo --app all   # phonepe/paytm/gpay.pdf
```

Then [import](docs/public/transactions.md) one of those PDFs into Aevum
and explore with fully synthetic data. When you're ready to use Aevum for real,
do a [data reset](docs/public/data-and-privacy.md#reset-all-your-data) and
start fresh from your real statements.

> Everything the generator ships is synthetic — see its own `README.md`.

## Documentation screenshots

`docs/public/images/` has **two subfolders with two different owners**, and the split
is deliberate: ownership is a directory boundary, so neither producer can overwrite
the other's files even by accident.

| Folder | Owner | How it changes |
|---|---|---|
| `images/screenshots/` | **`aevum-web`** | Regenerated in CI from the dev-only capture gallery, then pushed straight to `main` here. |
| `images/brand/` | **`aevum-brand`** | Product banners, pushed by the brand dispatcher per `brand-manifest.json`. |

**Do not hand-edit or hand-drop either.** A screenshot committed by hand is a copy
nothing can reproduce; the next CI run overwrites it and the difference is invisible
in review. If a shot looks wrong, fix the gallery or the fixture in `aevum-web` — the
PNG is output, never a source.

- **Why CI and not a local run:** PNG bytes depend on the Chrome version and the
  installed fonts. Alternating between a laptop and a runner rewrites every image
  with no visible change — megabytes of binary churn that hides the real diffs.
- **Naming:** `<topic>-<subject>.png`, lowercase, matching both the link in the doc
  and the entry in `aevum-web`'s `screenshot-manifest.json` (e.g. `transactions-list.png`).
  The manifest is what tells the dispatcher which paths it owns.
- **No exceptions any more.** Five flow shots (`add-transaction`, `import-queue`,
  `import-result`, `import-statement`, `parser-picker`) were hand-kept until the capture
  gallery learned to compose them; `aevum-web`'s manifest now lists **no** hand-kept files.
  The capture job still leaves anything it does not own untouched, so re-introducing an
  exception is possible — but a hand-kept shot is a shot nothing can reproduce, and it
  should be the last resort, not the shape of the folder.
- **Use synthetic data**, never real financial data, for anything captured by hand —
  generate sample statements with the synthetic-statement tool (above).
