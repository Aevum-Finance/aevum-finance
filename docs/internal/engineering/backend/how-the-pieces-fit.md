# How the pieces fit

The [consumption-tax engine](the-consumption-tax-engine.md) is the heart of the
system, but it only works because a handful of other mechanisms feed it correct
inputs and keep the ledger honest. Each of the load-bearing ones is described below —
one mechanism, one idea.

## Categorization — rules and tag lineage

Categorization is the auto-tagging engine that answers a single question for every
transaction: *given who this was with, and in what capacity, which categories does it
get?* The insight that shapes it is that one counterparty can play more than one role
— the same name can be your employer paying salary and a merchant issuing a refund —
so a rule is keyed on the **standing relationship and the direction of money**, not
just on the payee. When no rule matches, the transaction falls back to a safe default
(an unknown outflow is treated as spend; an unknown inflow is *not* assumed to be
income) rather than being guessed. Crucially, every category lives in a **hierarchy**,
so once a leaf category is assigned it **propagates up its parent chain** — tagging a
coffee as "cafés" also rolls it into "eating out" and "food" automatically. That
lineage is what makes hierarchical spending totals work, and it is exactly the typed
signal the tax engine reads.

## Recurring — an inference engine that never writes transactions

The recurring module learns repeating expenses, and the one fact to hold onto is that
it **never creates a transaction**. Nobody declares "I pay rent on the 1st"; instead
a worker *watches the ledger*, notices that a counterparty keeps getting paid on a
regular beat, and infers a pattern. It then forecasts the next occurrence and later
checks whether a real payment actually arrived to match it — confirming the forecast
on a match, expiring it on a miss. It reads transaction history and writes only its
*own* records — inferred patterns and forecasts. A real payment always comes from the
ledger; recurring only *recognizes* it. Machine-inferred patterns can be auto-adapted
or dropped by the worker, but the moment a person edits one it becomes user-owned and
the worker stops second-guessing it.

## Activity signals — a registry-driven feed

The activity engine turns domain events worth surfacing — a weekly bill generated, a
budget breached, an import failed, security setup left incomplete — into **per-user
signals** on the dashboard. Its organizing principle is that feature modules **never
describe a feed card**; they emit a self-sufficient event and hand it off, and every
feed decision (placement, ranking, whether it collapses, when it expires) is made
inside the engine from a **registry contract**. Adding a new kind of signal is a
registry edit, not new engine code. Signals come in two classes — passive
*notifications* and *alerts* that need the user to act — and an alert clears itself
when the underlying condition is resolved, rather than a producer racing to delete it.
Emitting a signal is always a best-effort side effect: a broken card can never abort
the financial computation that produced it.

## Treasury — an append-only ledger with soft-void

Treasury is the **accounting view** over the money the user has set aside. It answers
one question — how much of the set-aside cash is real, recognized revenue matched to
an actual bill, versus money received ahead of any bill — and it answers it as a
**pure derivation over a journal it only ever appends to**. Every entry is a signed
line; a correction or reversal is another signed line of the same kind, **never an
edit or a delete**, which is what keeps the whole thing auditable and reconstructable.
The journal keeps itself fresh **on read**: whenever the savings view is requested, a
convergent, idempotent reconciler appends only the deltas needed to make the journal
match the current settlement truth — run it twice with nothing changed and the second
run does nothing. This pairs with a system-wide rule that a transaction is **never
hard-deleted**: deleting one marks it void and preserves the row for audit, and voided
rows simply drop out of every list and total.

## Statement ingestion — an async parse-then-categorize pipeline

Bank statements are imported through an **asynchronous job**. The upload returns
immediately with a job handle; the heavy work — parsing the file, resolving each row,
categorizing and committing — runs in the background while the frontend polls for
progress. Both entry points for a transaction, a manual entry and a statement import,
funnel through the **same single road into the ledger**, which guarantees each row is
staged, de-duplicated and resolved in exactly one order no matter which door it came
through. Two design choices stand out. First, **the user is the only authority on
whether something is a duplicate**: within one upload a repeated-looking charge is
treated as two real purchases (a bank doesn't list a transaction twice), but across
separate uploads a possible duplicate is held and the user is asked — nothing is ever
silently dropped. Second, resolution failures **never block import**: a transaction
whose payee can't be identified is still real money that moved, so it lands as
uncategorized rather than being refused, because under-reporting the user's own
spending is the worse failure.

## Auth and device binding — the high-level shape

Authentication is built on short-lived **access tokens** plus a longer-lived
**refresh token**, and its defining idea is **device binding**: every protected
request must prove it comes from the same device that logged in. Each device holds its
own key, the access token is bound to that key, and every request is signed, so a
stolen token is useless from any other device. The refresh token is kept in a secure,
JavaScript-inaccessible cookie so common browser attacks can't lift it, and it rotates
on each use. On top of that sit the expected layers — social login, optional two-factor,
an always-on check for logins from a new device, and account recovery — but the
device-binding guarantee is the load-bearing one. *(The cryptographic specifics are
intentionally out of scope here.)*
