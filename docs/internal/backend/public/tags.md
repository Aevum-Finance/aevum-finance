<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@09917f61/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/tags/. -->

# Categories

## The idea

Every expense in Aevum is filed under a **category** — Groceries, Rent, Dining out,
and so on. Categories are how the app understands your spending, and they're the reason
it can do anything smarter than list your transactions back to you.

They're also the thing you shape yourself. Aevum starts you off with a sensible set,
but you can rename them, add your own, and nest them however you think about money.

## Categories nest

Categories form a tree, not a flat list. `Groceries` and `Dining out` can both sit
under `Food`; `Rent` and `Electricity` under `Household`. When you file an expense under
a specific category, it counts toward the broader one above it too — so `Food` always
shows the whole picture without you having to tag things twice.

This lets you be as coarse or as fine-grained as you like. Track "Food" as one number,
or split it into `Groceries`, `Dining out` and `Coffee` — whatever matches how you
actually think.

## Every category has a nature

This is the part that makes Aevum different. Each category isn't just a label — it
carries a **nature** that tells the app how to treat spending filed under it:

- **Fixed commitments** — rent, loan repayments. Money you've already committed.
- **Essentials** — groceries, utilities. Things you genuinely need.
- **Discretionary** — dining, shopping, treats. Nice to have.
- **Exempt** — savings and giving, which shouldn't be counted as spending at all.
- **Income and transfers** — money coming in, or moving between your own accounts.

That nature is what decides how each expense is taxed by Aevum's self-imposed
savings tax. A discretionary treat is nudged harder than a genuine essential; income,
transfers and anything exempt aren't taxed at all. You never set a tax rate on an
individual purchase — you set the nature of the category once, and every expense filed
under it is treated consistently.

## The categories you can't remove

A few special categories are built in and can't be renamed or deleted, because Aevum
relies on them behind the scenes:

- A running **Total** across everything.
- Two **catch-alls** — one for spending and one for money received — that hold anything
  the app couldn't sort automatically, so nothing ever falls through the cracks.
- A **Consumption Tax** category that tracks the self-tax itself.

Everything else is yours to shape. You can rename the starter categories, reorganize
the tree, and add your own — and doing so never disturbs the way anything was taxed
before, because it's the category's nature, not its name, that does the work.

## In short

Categories are the backbone of Aevum. Nest them to match how you think, give each one
the right nature, and the rest of the app — your spending views, your budgets, and your
self-imposed tax — all follow from there.
