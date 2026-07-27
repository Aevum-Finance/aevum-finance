<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@88bd7892/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience. The entry point to the web app's documentation.
     Links out to the general-audience pages (this file + public/) and down into the
     developer docs under internal/. Keep it jargon-free and navigational. -->

# Aevum web app — documentation

This is the documentation for **Aevum's web frontend** — the React single-page app
that renders everything you see in the browser. It talks to the
[backend API](../README.md), which owns the data and the money logic.

Start here if you're new; drop into `internal/` when you need the developer detail.

## Get oriented

| Read                               | For                                                                 |
| ---------------------------------- | ------------------------------------------------------------------- |
| [architecture.md](architecture.md) | A high-altitude tour of how the app is built                        |
| [performance.md](performance.md)   | Load-time budgets and the numbers behind them                       |
| [internal/](internal/README.md)    | The full developer documentation (per-feature, conventions, wiring) |

## What each screen does

Plain-language, code-free pages — one per feature. This is the same content that feeds
Aevum's product documentation.

<!-- BEGIN GENERATED:module-index-t1 -->

| Feature        | What it does                                                           | Page                                                 |
| -------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| Account        | the /account/\* profile, security, privacy and settings area           | [public/account.md](public/account.md)               |
| Auth           | sign-in, 2FA, recovery, and the device-bound token machinery           | [public/auth.md](public/auth.md)                     |
| Bank accounts  | your accounts + the savings account, with UPI/QR input                 | [public/bank-accounts.md](public/bank-accounts.md)   |
| Beneficiaries  | the merchants and people you pay                                       | [public/beneficiaries.md](public/beneficiaries.md)   |
| Budgets        | spending limits and the expense tracker                                | [public/budgets.md](public/budgets.md)               |
| Categorization | the auto-tagging rules surface                                         | [public/categorization.md](public/categorization.md) |
| Dashboard      | the authenticated home — a glance over every feature                   | [public/dashboard.md](public/dashboard.md)           |
| Onboarding     | the guided setup, sample-data demo, and product tour                   | [public/onboarding.md](public/onboarding.md)         |
| Payments       | the UPI initiate-and-record rail — payload, handoff, confirm-on-return | [public/payments.md](public/payments.md)             |
| Recurring      | spotting and confirming repeating bills                                | [public/recurring.md](public/recurring.md)           |
| Tags           | the category tree that sets each transaction's tax treatment           | [public/tags.md](public/tags.md)                     |
| Taxation       | the Tax Tracker surface                                                | [public/taxation.md](public/taxation.md)             |
| Transactions   | the ledger, manual entry and statement upload                          | [public/transactions.md](public/transactions.md)     |
| Treasury       | the Savings page                                                       | [public/treasury.md](public/treasury.md)             |

<!-- END GENERATED:module-index-t1 -->

## How it works

**[public/engineering/](public/engineering/)** goes a level deeper than the
per-screen pages — the load-bearing mechanics (the design system, interaction
patterns, how the pieces fit, testing) for a technical reader. Still public-safe:
how things work, without the wiring-and-component detail.

## Note on tiers

These docs are written at several altitudes: this page and everything under `public/`
are for anyone; `internal/` is for developers, and the `reference.md` files inside it
are generated. You never need to think about which is which — follow the links that
match how deep you want to go.
