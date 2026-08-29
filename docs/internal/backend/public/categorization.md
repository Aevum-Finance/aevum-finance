<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@09917f61/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/categorization/. -->

# Auto-categorization

## The idea

Sorting every transaction by hand is the chore that kills most budgeting apps. Aevum's
answer is simple: **tell it once, and it remembers.**

Set a rule for a merchant — say, _this coffee shop is Dining Out_ — and from then on
every payment to that merchant is tagged Dining Out automatically, whether you typed it
in yourself or it arrived in an imported bank statement. You do the thinking once; Aevum
does the filing forever.

## Categories are hierarchical

Your categories nest inside each other, like folders. _Dining Out_ might sit under
_Food_, which sits under your overall spending. When Aevum tags a transaction as Dining
Out, it also counts toward Food and toward your total — automatically, all the way up the
chain.

That's what lets you zoom in and out: see exactly what you spent on coffee, or step back
and see everything that went to Food this month, without tagging anything twice.

## The same payee, in two roles

Real life isn't tidy. A big shop might be somewhere you _buy_ from and also somewhere you
_get paid_ by. Aevum understands that money going out and money coming in from the same
place can mean completely different things — so a purchase and a refund (or a paycheck)
from the same name get sorted correctly, not lumped together.

You don't have to set this up. It just doesn't make the naive mistake of assuming one
name means one kind of money.

## When Aevum isn't sure

If a transaction is with someone you've never set a rule for, Aevum doesn't guess wildly.

- Money you **spent** to an unknown payee is filed as miscellaneous spending, so it still
  counts toward your budgets and your tax rather than vanishing.
- Money you **received** from an unknown source is set aside as unsorted — Aevum won't
  assume it's income, because guessing wrong there would quietly distort your finances.

Either way, nothing is ever dropped or silently mislabelled. You can step in and give it
the right category whenever you like — and your choice always wins over any rule.

## You stay in charge

- **Set rules once**, and everything past and future re-sorts to match.
- **Your manual choices are never overwritten.** If you categorize something by hand,
  changing a rule later won't touch it.
- **Change your mind anytime.** Edit a rule and Aevum re-tags the affected transactions;
  the totals that depend on them update to match.

Good categories are the quiet foundation everything else rests on — your budgets, your
spending insights, and the self-imposed tax that turns spending into saving.
