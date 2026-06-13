# Contributing to Aevum

Everything a developer needs to clone, run, test, and contribute to Aevum. For
*how the pieces fit together*, read [ARCHITECTURE.md](ARCHITECTURE.md) first;
for *what the app does*, see the [User Guide](USER_GUIDE/README.md).

Aevum is a monorepo of two git submodules — a **FastAPI** backend and a
**React** frontend — each its own repository. Most day-to-day work happens
*inside* a submodule and is committed there; the outer repo just pins which
commit of each submodule is current.

## Tech stack

| | Backend (`backend/`) | Frontend (`frontend/`) |
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

The submodules must come down with the outer repo:

```bash
git clone --recurse-submodules <monorepo-url>
# already cloned without submodules?
git submodule update --init --recursive
```

## Backend setup

Postgres + Redis run via docker-compose; the app and its tooling run in a venv.

```bash
cd backend
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
[`backend/README.md`](backend/README.md); the deeper architecture rules are in
[`backend/CONTRIBUTING.md`](backend/CONTRIBUTING.md).

> `run.py` enables hot-reload only outside production (it gates on `NODE_ENV`).
> On Render the app runs from the Dockerfile command, not `run.py`.

## Frontend setup

```bash
cd frontend
npm install
npm run dev                                            # Vite dev server on http://localhost:5173
```

The frontend talks to the backend over `/api/v1/*`. Override the API base with
`VITE_API_URL` (default `http://localhost:4000`) — **no trailing slash**, or
URLs end up double-slashed.

## Common commands

**Backend** (from `backend/`, with the venv active):

```bash
.venv/bin/pytest                                       # full suite (ephemeral Postgres testcontainer)
.venv/bin/pytest path/to/test_file.py::test_name       # one test
.venv/bin/pytest --cov=app --cov-config=tests/.coveragerc --cov-report=term-missing
ruff check .                                            # lint (E501 line-length intentionally ignored)
```

**Frontend** (from `frontend/`):

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

Each submodule documents its own conventions in depth — read them before a first
contribution:

- **Backend** — feature-based modules, async-only data access, dependency
  injection, services own business logic. See
  [`backend/CONTRIBUTING.md`](backend/CONTRIBUTING.md) and
  [`backend/docs/conventions.md`](backend/docs/conventions.md).
- **Frontend** — feature isolation enforced by `eslint-plugin-boundaries`,
  modal-first CRUD, typed API layer per feature. See
  [`frontend/CONTRIBUTING.md`](frontend/CONTRIBUTING.md) and
  [`frontend/docs/conventions.md`](frontend/docs/conventions.md).

A couple of monorepo-wide rules:

- **Commit inside the submodule that owns the change.** A backend change is
  committed in `backend/`; a frontend change in `frontend/`. The outer repo is
  bumped separately, only to move the submodule pointers.
- **Keep a change within one submodule where possible.** Cross-stack work is two
  commits in two repos, coordinated — not one commit that reaches across.

## Tests & quality gates

- Backend: `pytest` must pass; `ruff` clean.
- Frontend: `npm test` green, `npm run typecheck` clean, `npm run lint` at zero
  warnings, and `npm run build` succeeds.

Run the relevant gate before you push; both submodules treat a red gate as
blocking.

## Try Aevum with sample data

`dummy-statement/` is a standalone tool (its own venv) that generates **synthetic**
bank/UPI statements and renders them as PhonePe / Paytm / Google Pay-styled PDFs.
It's how you (or a privacy-conscious new user) can explore Aevum end-to-end
without touching real financial data — and it's also what the import pipeline is
tested against.

```bash
cd dummy-statement
python -m venv .venv && source .venv/bin/activate
.venv/bin/pip install -r requirements.txt

./generate_statement.sh -y --seed 7 --range 2026-01-05:2026-01-25 --output-dir runs/demo
./render_statement.sh runs/demo --app all     # writes phonepe.pdf / paytm.pdf / gpay.pdf
```

Then [import](USER_GUIDE/importing-statements.md) one of those PDFs into Aevum
and explore with fully synthetic data. When you're ready to use Aevum for real,
do a [data reset](USER_GUIDE/your-data-and-privacy.md#reset-all-your-data) and
start fresh from your real statements.

> Everything the tool ships is synthetic. Real statements you drop in for parser
> calibration are git-ignored by design — see the tool's own `README.md`.

## Documentation screenshots

User Guide screenshots live in `USER_GUIDE/images/`. The guide pages already
reference them with Markdown image links and a `<!-- TODO: screenshot -->`
marker, so dropping a correctly-named PNG into the folder makes the image appear
with no edits to the prose.

- **Naming:** `<topic>-<subject>.png`, lowercase, matching the link in the doc
  (e.g. `add-transaction.png`, `transactions-list.png`, `privacy-mask.png`).
- **Find what's outstanding:** `grep -rn "TODO: screenshot" USER_GUIDE/`.
- **Use synthetic data:** generate sample statements with the dummy-statement
  tool (above) and import them, so screenshots show a realistically *populated*
  app without exposing any real financial data.
- **Before publishing:** fill in every placeholder — the links 404 until the
  matching PNG exists.
