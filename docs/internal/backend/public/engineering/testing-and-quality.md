<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@6b1e4989/docs. Edit at source, not here. -->

# Testing and quality

Correctness in a system that moves money cannot rest on good intentions or a careful eye.
In this backend it is enforced by machinery: the test suite runs against a real database,
isolates every test from every other, tracks how much of the code it exercises, and fails
the build on a performance regression the same way it fails on a broken assertion.

## Tests run against a real database

The suite does not use a lightweight stand-in database that "behaves mostly like" the real
one. It runs against **real PostgreSQL** — the same engine that runs in production — spun up
in a throwaway container that is created for the test run and discarded at the end. This
matters because the interesting bugs live exactly where a stand-in and the real engine
disagree: strict grouping rules, null ordering, sequence behavior, timezone handling. A
substitute database hides those; a real one surfaces them before they ship. The container is
started once and shared across the whole run, so paying for a real database costs startup
time once, not per test.

## Per-test isolation, so tests stay independent and fast

Every test runs inside its own transaction that is **rolled back the moment the test
finishes**. Each test opens on the same freshly seeded starting state, does its work — inserts,
edits, reads — and then everything it touched is unwound. Nothing a test writes is ever
visible to another, so the tests are genuinely independent and their order never matters.

This buys independence *without* the usual cost. The alternative — rebuilding the schema and
re-seeding between tests — is correct but slow. Rolling back a transaction is nearly free, so
the suite gets the isolation of a fresh database at a fraction of the time. Fast tests are run
tests, and a suite that is pleasant to run is a suite that actually guards the code.

## Fixtures do the wiring, so tests stay about behavior

A small set of shared fixtures hands each test everything it needs pre-wired: a database
session already bound to that test's throwaway transaction, a ready HTTP client pointed at the
application, and a variant already signed in as a seeded user for the many tests that need an
authenticated caller. Supporting infrastructure that would otherwise reach outside the process
— caches, outbound email, rate limiting — is swapped for in-memory equivalents, so a test can
never accidentally touch a real external service and every run is deterministic. The payoff is
that a test reads as a statement about behavior: arrange a situation, act, assert the outcome,
with none of the plumbing showing.

One discipline the fixtures deliberately do **not** paper over: because a test's writes live in
a transaction that is rolled back, a test passing is not by itself proof that the code commits
correctly in production. That property is reasoned about directly rather than assumed from a
green run — the machinery is trusted for what it can prove and no further.

## Coverage as a tracked discipline

How much of the code the suite actually exercises is **measured, not guessed**. Coverage is
collected as part of running the tests and tracked over time, so a change that adds behavior
without adding tests is visible rather than invisible. It is treated as a signal to hold the
line, not a number to game — the point is that untested paths are known, and staying honest
about them is part of the workflow rather than an afterthought.

## Benchmarks run as a gate

Performance is defended by the same principle as correctness: **a regression fails the build,
not the eye.** The project carries a dedicated benchmark suite that exercises the hot paths —
the ingestion parsers, the categorization engine, the tax recalculation, the authentication
primitives — against realistic volumes of data. These are not read once and admired; they run
as a gate, measured against a recorded baseline, so a change that quietly makes a core path
slower is caught mechanically before it lands rather than noticed later in production.

The through-line across all of it is the same: quality here is a property the machinery
enforces, not a promise a developer makes. A real database catches the bugs a fake one hides,
isolation keeps every test honest and independent, coverage keeps the blind spots visible, and
the benchmark gate keeps performance from eroding one unnoticed change at a time.

See also [how the pieces fit](how-the-pieces-fit.md) and [the resolved
ledger](the-resolved-ledger.md) for the mechanisms this suite exists to protect.
