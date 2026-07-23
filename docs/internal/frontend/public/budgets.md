<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@b006f48c/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/budgets/. -->

# Expense Tracker

The Expense Tracker is where you see where your money goes each month and set
budgets on the categories you want to keep an eye on.

## The month at a glance

The page reads top to bottom, most important first, so you can stop as soon as
you have your answer:

- **The top** shows this month's total spend, how it compares to last month, and
  the categories you spent the most on.
- **The middle** is a spending trend — pick a range (a week, a few months, a
  couple of years) and see the shape of your spending, with a breakdown of which
  categories made it up.
- **The bottom** is one card per category: what you've spent, your limit if you
  set one, and a simple signal telling you whether you're on track or over.

A month picker at the top anchors the whole page, so you can look back at any
past month the same way you look at this one.

## Setting a budget

On any category card, open it and enter a **monthly limit**. You can also set a
**penalty rate** — how much extra tax a breach of that budget costs (more on that
below). If you're setting a budget on a category you already spend in, Aevum
suggests a sensible starting number based on your recent spending, so you're not
staring at a blank field.

Each card carries a plain signal so you always know where you stand:

| Signal          | What it means                |
| --------------- | ---------------------------- |
| **On track**    | comfortably under your limit |
| **Watch**       | past the halfway mark        |
| **Near limit**  | close to going over          |
| **Over budget** | you've crossed the limit     |

Categories where you haven't set a limit still get a read — compared against your
own typical spending, they'll show as **below typical**, **typical**, **above
typical**, or your **most expensive yet** — so the page is useful even before you
budget anything.

## What going over does

A budget is not just a warning. When you spend past a limit, Aevum adds a small
**penalty tax** on top of the ordinary consumption tax you already pay on that
spending — at the penalty rate you chose for that category. The idea is gentle,
not punishing: going over sets a little more aside, so the budget has real weight
behind it rather than being a number you can quietly ignore.

The extra shows up in your [Tax Tracker](taxation.md) as part of that week's
bill, with a breakdown of exactly which budget you breached — so you can always
trace a penalty back to the spending that caused it.

## Choosing how much Aevum budgets for you

You decide how hands-on budgeting is, with three modes:

- **Off** — no budgets are enforced. Going over a category never adds a penalty.
  Any limits you've set are kept, just ignored, so you can switch back later
  without losing them. (Your ordinary consumption tax is unaffected either way.)
- **Manual** — you set the budgets yourself. This is the default.
- **Auto** — Aevum sets budgets for you based on your recent spending and
  refreshes them each month. You can still take over any single category by
  editing it; that one is marked as yours, and the rest keep updating
  automatically.

Off changes only the budget penalty. The base consumption tax on your spending is
separate and stays exactly as it is in every mode.
