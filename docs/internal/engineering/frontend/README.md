# How the Frontend Works

Aevum's web app is a single-page React application. This page explains the shape
of the machinery — how the code is organized, how it builds, how it holds state,
how it talks to the backend, and how it stays fast — for a technical reader who
wants the mental model without the implementation.

## Feature-based structure

The codebase is organized by **feature, not by file type**. Rather than a folder
of all components beside a folder of all data-access code, each product area owns
a self-contained slice — its screens, its data hooks, its routes, and its tests
live together. Around those features sit two supporting layers: a **shared**
layer of cross-feature building blocks (navigation, modals, form controls,
charts, the theme and motion foundations) that a feature reaches for but never
owns, and an **app shell** that composes everything — the provider stack, the
router, and the root layout every screen mounts inside. A boundary rule is
enforced by tooling: the shared layer may never depend on a feature, and one
feature reaches another only through its published surface, so the slices stay
genuinely independent.

## Build and delivery

The app is built and served with a modern bundler that produces a small initial
download and splits the rest into on-demand pieces. Types are generated from the
backend's own API description, so the frontend's view of the server is derived
from the source of truth rather than hand-copied and left to drift.

## State: two kinds, two mechanisms

State is deliberately split by origin:

- **Server state** — anything owned by the backend — lives in a **query cache**.
  Each feature exposes read and write hooks; reads are cached and revalidated in
  the background, and a write invalidates exactly the reads it affects, so the UI
  re-syncs without manual refetching.
- **Client state** — theme, display and accessibility preferences, the signed-in
  user — lives in **small, domain-scoped stores**, one per concern, kept separate
  from the server cache.

## The data layer

Every call to the backend flows through **one typed client** and **one central
registry of URLs** — there are no inline server paths scattered through feature
code, which gives the app a single, auditable seam to the backend and makes an
API-version change a one-place edit. The client owns the cross-cutting concerns
of talking to the server: attaching the session, transparently renewing an
expired session once and replaying the request, and translating server errors
into a consistent, user-safe shape (a server-side fault surfaces a generic
message plus a support reference, never a raw internal string). Callers just get
clean data or a clean error.

## Routing

Routing is a straightforward component router. Routes are grouped into public
and authenticated sets; the authenticated set is wrapped so every entry inherits
its sign-in gate automatically. Every screen mounts inside the one app shell, so
the navigation chrome stays put across the whole app, and an unknown URL lands on
a branded not-found page rather than silently dumping the user elsewhere. A
render error or a failed screen-load is caught by an error boundary that shows a
recoverable fallback instead of a blank page.

## Code-splitting and lazy-loading

Speed is a budget, not an afterthought. The amount of code a user downloads
before the app is usable is **capped and enforced automatically** — exceeding it
fails the build. That discipline pushes everything non-essential off the initial
download: each screen is split into its own chunk loaded on navigation, heavy
libraries and below-the-fold content load only when needed, and the app quietly
pre-warms the chunks a user is likely to reach next so a deferred surface still
appears instantly. What's in sight paints now; what's out of sight is deferred
and warmed.

## The main areas

- **transactions** — the ledger where money is entered, edited, imported, and reviewed.
- **budgets** (Expense Tracker) — spending limits, penalty rates, and spend analytics.
- **taxation** (Tax Tracker) — the consumption-tax flow, weekly bills, penalties, and rules.
- **treasury** (Savings) — a read-only view of the balance set aside from self-tax and surplus.
- **bankAccounts** — the user's accounts, including the savings account that settles tax.
- **beneficiaries** — the directory of people and businesses the user pays or is paid by.
- **tags** — the category tree whose types drive how spending is taxed.
- **categorization** — the editor for rules that auto-tag transactions.
- **recurring** — the window onto detected recurring bills: confirm, correct, or dismiss.
- **payments** — initiating a UPI payment via the device and recording it on return.
- **dashboard** — the authenticated home that aggregates every area into one glanceable overview.
- **activity** — the notification feed and the controls to act on and tune it.
- **auth** — sign-in, registration, and the session it establishes.
- **account** & **settings** — the user-management and configuration shells.
- **onboarding** — the new-user journey: setup, checklist, sample-data demo, and product tour.
- **admin** — the operator-only portal.
- **legal** — the published legal documents.
- **metadata** & **users** — read-only reference data and the current-user data layer.
