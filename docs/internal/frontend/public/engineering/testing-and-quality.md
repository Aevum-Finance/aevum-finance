<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@88bd7892/docs. Edit at source, not here. -->

# Testing and Quality

Quality on the frontend is enforced by machinery, not by good intentions. The
goal is a test suite that runs fast enough to live in the everyday loop, exercises
components the way a real user and a real backend would, and refuses to let
quietly-wrong behavior slip through green. This page describes how that is wired,
at a mechanics level; the structural seam it rides is described in
[how the pieces fit](how-the-pieces-fit.md).

## Components tested against realistic behavior

Component tests run in a **simulated DOM** — a lightweight stand-in for the
browser — rather than a real one, so the whole suite runs in-process and
finishes quickly. Instead of reaching for a live server, the app's network calls
are **mocked at the boundary**: requests leave the code exactly as they do in
production and are answered by stand-in handlers that mimic the real backend's
responses. This means a test drives the actual data-fetching path — the same
hooks, the same cache, the same request the shipped app makes — rather than a
stubbed-out fake wired in behind the component. The component is exercised
against realistic API behavior, without the cost and flakiness of a real server.

A safety rail sharpens this: any request that escapes without a matching handler
**fails the test** rather than silently hanging or hitting the network. A test
must declare the backend behavior it depends on, so what each test assumes about
the server is always explicit.

## Warnings fail the suite

A console warning is treated as a test failure. This matters more than it sounds:
the default test reporter swallows console output for passing tests, so a warning
about a subtle correctness problem — state updating outside the framework's
managed scope, an accessibility attribute missing from a dialog — would sail
through a green run completely unseen. That is exactly how a real regression once
hid for a long stretch. By escalating a known class of warning into an outright
failure, the run stays honest: the only way to make the test green is to fix the
underlying cause at its source, never to widen the filter. The set of escalated
warnings only shrinks as their causes are eliminated.

## Snapshot tests on the pure views

The frontend separates a screen into a data-owning container and a pure
presentational view that takes everything it renders as plain inputs and reads
nothing from the network or global state. That seam makes a particular kind of
test cheap and powerful: the pure view is rendered directly from a single
co-located set of sample data — no network at all — and its output is captured as
a **snapshot**. Because the very same sample data and the very same view also
power the product, the demo, and the marketing showcases, a change to the shape
of the data fails one small, isolated test instead of quietly skewing several
hand-maintained surfaces at once. One test guards a contract that spans the app.

## Store-reset hygiene

The app keeps small client-side stores for things like theme and session, and a
test must start from a clean baseline so one test can't leak state into the next.
The reset is deliberately timed to run **before** each test sets up its screen,
not after the previous one tore down — resetting a live, subscribed store after a
tree has already mounted forces an out-of-band update that trips the very
warnings-are-failures rail above. Ordering the reset correctly was, in practice,
the single biggest source of spurious noise removed from the suite. Getting this
detail right is what lets the honesty rail stay strict without drowning in
false alarms.
