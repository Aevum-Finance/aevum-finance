<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@b006f48c/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/tags/. -->

# Categories

Categories are how you organise your spending in Aevum. Every transaction gets one or
more categories, and they are the vocabulary the rest of the app speaks — your budgets,
your trends, and your tax are all built on top of them.

## A tree, not a flat list

Categories are arranged as a tree. You might have **Food** at the top, with **Groceries**
and **Eating out** underneath it, and something more specific under those again.

The nesting isn't just tidy — it's useful. When you tag a transaction with a specific
category, everything above it in the tree comes along automatically. Tag a coffee as
"Eating out" and it also counts toward "Food", without you doing anything. So you can
budget and read your spending at whatever level of detail suits the moment: the broad
picture, or the fine grain.

## Why the category matters: it sets the tax treatment

This is the part that makes categories more than labels. Each category has a **type**,
and that type decides how spending in it is taxed under your self-imposed consumption
tax. The four types you'll pick from:

- **Essential** — the things you need. Taxed lightly.
- **Committed** — regular, already-decided commitments. Effectively untaxed until you
  choose otherwise.
- **Discretionary** — the wants, the nice-to-haves. Taxed the most.
- **Exempted** — set aside from the tax entirely.

So choosing a category isn't only about where a transaction shows up in your reports —
it's the lever that sets its tax treatment. You control both the categories and, over in
**Settings → Taxation rules**, the exact rate each type is taxed at. (For what the tax is
and why it exists, see the Tax Tracker overview.)

## Managing your categories

You'll find everything under **Settings → Categories**. From there you can:

- **Add** a category, place it anywhere in the tree, and set its type.
- **Rename** or **re-type** an existing one.
- Give a category **aliases** — alternative names, so Aevum recognises the same category
  when it reads an imported statement, even when a merchant writes it differently.
- **Delete** a category, or delete a whole branch at once (you'll be asked to confirm).

## The ones you can't change

A few categories are built in and looked after by Aevum itself — the running total, the
catch-alls for spending that hasn't been sorted yet, and the one the tax itself uses.
These are locked so the app's own bookkeeping stays sound; you'll see them in the tree
but they have no edit or delete buttons.

A second group is the set of categories Aevum ships with as a starting point. You can't
rename or move those, but you **can** still change their type and give them aliases — so
you can tune how they behave to match how you actually spend, without breaking the
defaults everyone starts from.
