# How the Pieces Fit

A short tour of the load-bearing mechanisms behind the frontend — the seams and
conventions that let one small codebase stay consistent as it grows. Each
section is the mental model, not the wiring.

## The shared-views seam

The single most important structural pattern is the split between fetching and
rendering. A feature's screen is built from four cooperating parts. A thin
**container** owns all the moving parts — the data queries, filter and
pagination state, the modals — fetches, and then hands plain data down. A pure
**view** takes that data (plus the user's money-formatter and timezone) purely
as inputs and reads nothing from the network or from global state; it is the
only part that renders. A **presentation mode** flag lets that same view render
non-interactively (links become plain text, row actions go inert) so it is safe
on a marketing or demo surface. And a co-located **fixtures** file holds one
coherent set of sample data. Because the view is pure, the exact same component
renders in the live product, on the landing page, in the sample-data demo, and
in isolated snapshot tests — all driven by the one fixtures file. A change to
the data shape therefore fails a single test instead of silently skewing three
hand-maintained copies, and the whole demo-and-showcase apparatus rides for
free on the product's own components.

## Data fetching and caching

Server data and client state are handled by two different mechanisms, on
purpose. Everything that comes from the backend flows through a **server-cache
layer** (a query/mutation library): each feature exposes read hooks and write
hooks, cache entries are keyed per feature and action, and a write invalidates
exactly the reads it affects so the UI re-syncs without manual refetching.
Sensibly short freshness windows and a light retry posture mean a screen paints
from cache instantly and revalidates in the background. Everything that is
*not* server data — theme, display preferences, the signed-in user, the
accessibility switches — lives in **lightweight client stores**, one per domain,
kept deliberately separate from the server cache. Every request to the backend
goes through one typed client and one central registry of URLs, so the app has a
single, auditable seam where it talks to the server rather than scattered inline
calls.

## The motion posture

Animation is treated as enhancement layered on top of already-usable content,
and the heavy machinery to drive it is kept off the critical path. The
animation engine loads **lazily**, so the weight of the motion runtime never
lands in what the user downloads for first paint; above-the-fold and
first-paint-critical content animates with lightweight CSS instead. The model
is a deliberate two-beat — a surface lands, then its data animates as one
coherent group — driven by a small shared set of primitives, so a screen
"adopts motion" simply by wrapping its zones and an un-adopted screen is
untouched. Every motion earns its place by communicating something (directing
attention to a saved row, confirming a tap, giving a modal spatial continuity
with the control that opened it); decorative motion doesn't ship. And reduced
motion snaps everything to its final state as a hard guarantee.

## The performance framework

Performance is governed by an explicit, enforced budget rather than good
intentions. The central lever is an **entry-bundle budget**: the amount of
JavaScript and CSS a user downloads before the app is usable is capped, and the
cap is a committed contract checked automatically — drift against it is a build
failure, and the number ratchets down over time rather than being quietly
loosened. Keeping under it is what forces the lazy-loading discipline
everywhere: heavy libraries, below-the-fold showcases, and behind-a-click
surfaces are all split into their own chunks that load on demand. To keep those
lazy chunks from feeling slow when they *are* needed, the app does
**background warming** — it quietly pre-fetches the chunks a user is likely to
reach next, during idle moments, so a deferred surface still appears instantly.
The classification rule underneath all of this is simple: what's in sight must
paint now; what's out of sight may be deferred and warmed.

## Forms and validation

Form handling is standardized so every input surface behaves the same way. A
form is described once by a **schema** that defines its shape and rules, and a
form library wires that schema to the inputs, tracks touched-and-dirty state,
and surfaces validation messages. The same form component works whether it's
mounted on a full page or inside a modal, with no duplicated state. Commit
actions stay disabled until the form is actually dirty and confirm before
discarding unsaved input, field-level errors sit inline next to their field
while page-level context sits in a banner, and validation runs the same way on
every surface — so correctness and feel are inherited from the shared pattern
rather than re-solved per form.
