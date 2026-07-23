<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@be3d1be7/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/transactions/. -->

# Transactions

This is your ledger — everything you've spent and received, in one place. You can
add entries by hand, import a bank or UPI statement, and look at the whole thing
three different ways.

## Three ways to look at the same money

A single toggle switches how your transactions are shown:

- **List** — the plain running list, newest first. Filter it by type, tag, month
  or who you paid, and sort it however you like.
- **Beneficiary** — the same spending grouped by who received it, so you can see
  how much went to each shop or person over time.
- **Calendar** — a month (or a week, on a phone) with each day shaded by how much
  you spent, so heavy days stand out at a glance. Tap a day to see everything on it.

Whatever you filter to becomes part of the web address, so a filtered view is a link
you can bookmark or share, and it survives a reload.

## Adding a transaction

Add an entry from the list at any time. Pick who it was, the amount, and tag it so
Aevum knows what kind of spending it is. If you've set up a rule for that shop or
person before, the tags fill themselves in — and if you change them, Aevum asks
whether that's just this once or a new rule to remember.

Two things get double-checked as you add, because only you can settle them:

- If the entry looks like one you've **already recorded**, Aevum pauses and lets you
  confirm it really is separate before adding it — so you don't quietly double-count.
- If it looks like the **other half of a transfer** between two of your own accounts,
  Aevum asks whether to join them into one move or keep them apart.

## Importing a statement

Instead of typing everything, you can upload a statement and let Aevum read it. It
recognises common UPI and bank formats automatically, and if it guesses wrong you can
pick the right one yourself.

You don't have to sit and wait. The moment you upload, Aevum takes you back to your
dashboard and carries on reading the file in the background — a small progress
indicator in the corner keeps you posted from whatever page you're on, and tells you
the moment it's done. Refreshing or moving around won't lose the import.

## The review list

Sometimes an import turns up entries Aevum genuinely can't judge on its own, so
rather than guess, it holds them aside and asks you:

- **Possible duplicates** — an entry that matches one you already have. Two identical
  coffees on the same day might be one payment recorded twice, or two real coffees —
  there's no way to tell from the numbers alone, so Aevum shows you **both, side by
  side**, and you decide.
- **Possible transfers** — an entry that looks like money moving between your own
  accounts. Confirm the account is yours once, and every future transfer between those
  two accounts is recognised automatically from then on.

If an import overlaps heavily with what you already have, you might get a whole batch
of these at once — so you can accept or skip the whole import together instead of one
by one. Either way, nothing is thrown away and nothing is added behind your back:
these entries wait, out of your balance, until you answer.

## Editing and deleting

Open any transaction to view or change it. Entries that came from an imported
statement keep their original figures locked — you can still re-tag them and add
notes, but the amounts stay true to the statement.

Deleting is a confirm-first action. If you delete a transaction that was paying off
some of your self-tax, Aevum asks whether to keep those bills settled or reopen them,
so a cleanup never quietly changes what you owe.

## Recurring payments

When a transaction settles one of your recurring bills, it's marked so you can spot
it, and the mark links straight to the recurring template it belongs to — so a single
payment is always traceable back to the schedule it came from.
