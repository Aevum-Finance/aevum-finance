<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@5b72b821/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/budgets/. -->

# Budgets

## The idea

A budget in Aevum is a simple promise you make to yourself: _I'll keep my spending on
this category, this month, under this amount._

You set one limit per category — dining out, groceries, shopping, whatever you track.
Aevum quietly keeps a running total of what you've spent against it, so you always know
how much room is left before the month is out.

## What a budget actually does

Budgets don't cost you anything on their own. What they do is change how the
self-imposed tax treats your spending:

- **Stay under the limit** and you pay only the ordinary base tax on that spending — the
  same small set-aside that applies to everything taxable.
- **Go over the limit** and a **penalty** is added on top, for the spending past the
  line.

So a budget is really a lever on the tax: keeping your word costs you nothing extra;
crossing the line you drew for yourself costs a little more, which goes into your
savings just like the base tax does.

## An important distinction

The base tax and the penalty are two different things, and it's easy to mix them up:

- The **base tax** applies to all taxable spending, all the time — with or without a
  budget.
- The **penalty** only ever comes from crossing a budget you set. It's added _on top_ of
  the base tax, never instead of it.

Setting a budget doesn't create the tax. It only decides whether a penalty gets added.

## Refunds count in your favour

Aevum measures a category by your _net_ spending — money out, minus money back. So if you
get a refund, it lowers your total for the month, and can bring you back under a limit you
had crossed. You're judged on what you actually kept spending, not on a number that only
ever goes up.

## Let Aevum set the budgets for you

You don't have to pick every number by hand. Budgeting has three settings:

- **Off** — no limits, no breaches, no penalties. (Your ordinary base tax still applies —
  it's independent.)
- **Manual** — you set each category's limit yourself.
- **Automatic** — Aevum sets a sensible limit for each category from your own recent
  spending, and adjusts it over time: the limit eases up where you consistently spend
  more, and the penalty softens after a clean month or firms up after one you overran.

Whatever Aevum sets automatically, you can always override. The moment you edit an
automatic limit, it becomes yours to keep.

## A budget is fixed for its month

Once a month is under way, the limit for that month doesn't move — not even in automatic
mode, where new limits are always drawn from _completed_ months, never the one you're
still living in. That's deliberate: a goalpost that shifted every time you spent wouldn't
be a budget at all. Next month, the automatic limits catch up to your latest habits.

## You stay in control

- **Every limit and penalty is yours to tune.**
- **Budgeting can be switched off entirely**, and your expenses are still tracked.
- **With budgeting off, there are simply no penalties** — only the base tax you'd pay
  anyway.
