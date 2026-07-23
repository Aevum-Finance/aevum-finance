<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@739af13d/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience. A high-altitude tour of how the web app is put
     together — enough to orient anyone (including a developer meeting the codebase
     for the first time) before they drop into the detailed dev architecture.
     The wiring-level companion is docs/internal/architecture.md (T2). -->

# Frontend architecture

Aevum's web app is a **React 18 single-page app built with Vite**. It talks to the
[backend API](../README.md) over HTTP and renders every screen the user sees — the
dashboard, the transaction ledger, the Tax Tracker, budgets, savings, settings.

This page is the high-altitude map. The wiring-level detail — every provider, the
exact refresh contract, the router composition — lives in the developer companion,
[`internal/architecture.md`](internal/architecture.md).

## The three layers

<!-- BEGIN GENERATED:dir-tree -->

```text
src/
├── app/       # the shell — providers, router, the root layout every page mounts inside
├── shared/    # cross-feature primitives: the typed API client, UI components, hooks, Zustand stores
└── features/  # one folder per surface — auth, transactions, taxation, budgets, … (the product)
```

<!-- END GENERATED:dir-tree -->

- **`app/`** wires the application together: the provider stack (error boundary →
  data cache → motion → routes), the route table, and the top navigation.
- **`shared/`** holds everything more than one feature needs — most importantly the
  typed **API client** (auth, token refresh, error shaping) and the reusable UI
  building blocks (modals, tables, form fields, selects).
- **`features/`** is where the product lives. Each feature owns its own pages,
  components, data hooks, routes and tests, and is documented in its own page under
  [`internal/modules/`](internal/README.md). A lint rule keeps features from reaching
  into each other's internals — they may share through `shared/` or through a
  feature's public data hooks, nothing deeper.

## By the numbers

The scale of the codebase, generated from the same `stats.frontend.json` the drift gate
checks — so these figures never drift from what CI enforces:

<!-- BEGIN GENERATED:stats-summary -->

| Metric                    | Value       |
| ------------------------- | ----------- |
| Feature modules           | 16          |
| Tests                     | 924         |
| Frontend code             | 55,915 SLOC |
| Max cyclomatic complexity | 15          |

<!-- END GENERATED:stats-summary -->

## How data moves

Two kinds of state, kept deliberately separate:

- **Server state** — anything the backend owns (your transactions, bills, budgets) —
  is fetched and cached with **TanStack Query**. Components read from the cache; the
  library handles refetching, loading and error states.
- **Client state** — device-local preferences like theme, text size and reduced
  motion — lives in small **Zustand** stores that persist to the browser and paint
  before React even mounts, so the app never flashes the wrong theme.

Cross-device preferences (currency, timezone, landing page) are server-owned and sync
back to your account, so they follow you to another device.

## Signing in, and staying signed in

The app authenticates with short-lived tokens held **only in memory** (never in
`localStorage`), backed by a device-bound key so a stolen token can't be replayed
from another machine. When a token is about to expire the client refreshes it in the
background, in a single coordinated request, so an active session never interrupts you
with a login screen. The security-relevant flows — two-factor, account recovery,
verifying a new device — are covered in [Signing in](public/auth.md).

## One way to build a screen

Nearly every feature follows the same shape: a **container** that fetches data and
owns interaction, handing plain data to a **pure view** that only renders. That one
pure view is reused everywhere the screen appears — the live product, the landing-page
showcase, the sample-data demo, and snapshot tests — so a single render catches a
drift instead of several hand-kept copies. The full convention, and the handful of
deliberate exceptions, is in the [handbook](internal/handbook/README.md).

## Where to go next

| You want…                                       | Read                                                      |
| ----------------------------------------------- | --------------------------------------------------------- |
| The wiring: providers, router, refresh contract | [`internal/architecture.md`](internal/architecture.md)    |
| How to build a feature (the handbook)           | [`internal/handbook/`](internal/handbook/README.md)       |
| A specific feature, explained                   | [`internal/README.md`](internal/README.md) (module index) |
| Performance budgets and numbers                 | [`performance.md`](performance.md)                        |
| What the product does, for anyone               | [`README.md`](README.md)                                  |
