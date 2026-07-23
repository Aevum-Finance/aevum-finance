<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@34999cd1/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience. The front door to the docs tree — a "start here"
     index, not content of its own. Point readers at the map, the per-feature
     pages, and the developer detail, then get out of the way. -->

# Aevum backend — documentation

Start here. This tree is written in tiers, from the big picture down to the
exact field on a table — read as deep as you need and stop.

## Start with the map

**[architecture.md](architecture.md)** — what the backend is, how it's laid out,
and the flow that turns a transaction into a weekly tax bill. Read this first;
everything else hangs off it.

## What each feature does

**[public/](public/)** holds one plain-language page per feature — no code, no
internal paths, just what the feature does and why. Good for understanding a
part of the product without reading its implementation.

<!-- BEGIN GENERATED:module-index-t1 -->

| Feature        | What it does                                                | Page                                                 |
| -------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Activity feed  | the per-user activity feed and signal settings              | [public/activity.md](public/activity.md)             |
| Auth           | sign-in, tokens, 2FA, recovery, device challenges           | [public/auth.md](public/auth.md)                     |
| Bank accounts  | the user's own account legs + the savings/committee account | [public/bank_accounts.md](public/bank_accounts.md)   |
| Beneficiaries  | the merchants and people a transaction is with              | [public/beneficiaries.md](public/beneficiaries.md)   |
| Budgets        | per-category limits (off/manual/auto) + the spend trackers  | [public/budgets.md](public/budgets.md)               |
| Categorization | assigning tags to transactions via rules                    | [public/categorization.md](public/categorization.md) |
| Exports        | per-domain CSV/JSON data export                             | [public/exports.md](public/exports.md)               |
| Onboarding     | post-registration setup + the sample-data demo              | [public/onboarding.md](public/onboarding.md)         |
| Recurring      | recurring-payment inference and forecast                    | [public/recurring.md](public/recurring.md)           |
| Tags           | the hierarchical category tree and tag types                | [public/tags.md](public/tags.md)                     |
| Taxation       | the real-time consumption-tax ledger and weekly bills       | [public/taxation.md](public/taxation.md)             |
| Transactions   | the raw ledger + statement upload                           | [public/transactions.md](public/transactions.md)     |
| Treasury       | the committee's append-only revenue books                   | [public/treasury.md](public/treasury.md)             |
| Users          | profile, preferences, account reset                         | [public/users.md](public/users.md)                   |

<!-- END GENERATED:module-index-t1 -->

## Developer and AI detail

**[internal/](internal/)** is the engineering documentation — build-a-feature
conventions, the detailed architecture, database, testing, deployment, and a
`README.md` + generated `reference.md` for every feature. Its
[README](internal/README.md) is a grouped index of everything there.

## Also here

- **[performance.md](performance.md)** — benchmark baselines for the backend.
