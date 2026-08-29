<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@09917f61/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/recurring/. -->

# Recurring expenses

## The idea

Some of what you spend is a surprise. A lot of it isn't — rent, a phone bill, a
streaming subscription, the same trip to the same shop every payday. Aevum learns
those repeating expenses on its own and tells you what's coming, so the predictable
stuff never catches you out.

You don't have to set any of this up. Aevum simply watches your history and notices
the rhythm.

## How Aevum learns a pattern

When the same expense turns up on a regular beat — every week, every month, once a
year — Aevum recognizes it as a **pattern**: who it's paid to, roughly how much, and
when to expect it next.

It waits until it's actually sure. A single payment isn't a pattern, and neither is
two. Once it has seen the same expense repeat enough times to be confident, Aevum
locks the pattern in and starts forecasting the next one. Until then it holds the idea
quietly in the background rather than bothering you with a guess.

## What you get from it

- **A heads-up on what's due.** Aevum shows you the expenses it expects in the days
  ahead, so nothing predictable arrives as a surprise.
- **A check that each one actually happened.** When a forecasted expense comes through,
  Aevum matches it up and marks it confirmed. If one you expected never arrives, it's
  flagged rather than silently forgotten.
- **A tidier picture of your money.** Because Aevum knows which expenses repeat, it can
  tell the recurring commitments apart from the one-off spending.

## It stays honest about your money

This is worth being clear about: **Aevum never spends on your behalf and never invents
a transaction.** Everything it shows is either something that genuinely happened in
your accounts, or a forecast clearly marked as something it _expects_. The real
payments always come from you or your bank — Aevum only recognizes them.

So a forecast is a prediction, never a charge. If Aevum expects a bill and it doesn't
show up, nothing is created out of thin air; the expectation simply expires.

## You stay in control

- **You can add a pattern yourself.** If you know you have a regular expense Aevum
  hasn't picked up yet, you can tell it directly.
- **The moment you edit one, it's yours.** Aevum will keep quietly adjusting the
  patterns it worked out on its own — but as soon as you change one, it stops
  second-guessing you and leaves that one exactly as you set it.
- **Patterns that stop repeating fade out.** If a subscription ends or a habit changes,
  Aevum notices the expected expense keeps not arriving and steps the pattern back down
  on its own, instead of nagging you about a bill that's gone for good.

## Why it's here

Knowing what's coming is the quiet half of staying on top of your money. By learning
your repeating expenses, Aevum turns "what did I spend?" into "what's about to happen?"
— and lets the rest of the app plan around the expenses you can already see coming.
