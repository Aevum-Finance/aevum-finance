<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@e09e7c9e/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/transactions/. -->

# Your transactions

## What this is

Every expense and every bit of income in Aevum is a **transaction** — one line saying
how much moved, in which direction, on what day, and who it was with. This is the
raw record everything else is built on: your budgets, your weekly tax, your spending
insights all read from here.

There are two ways a transaction gets in, and both end up in the same place.

## Adding them yourself

You can type a transaction in by hand: the amount, whether it was money out or money
in, the date, who it was with, and an optional note. Aevum will try to recognise the
payee and sort the transaction into a category for you, so it lands ready to use
rather than needing tidying afterwards.

Anything you enter by hand, you can freely edit or remove later.

## Importing a bank or UPI statement

Instead of typing, you can upload a statement — a PhonePe, Paytm or Google Pay PDF,
or a CSV — and Aevum will read every row out of it for you.

- **It happens in the background.** Big statements can take a moment, so the upload
  returns straight away and fills in as it works — you can keep using the app and
  watch the progress.
- **Aevum picks the right reader automatically** by looking at what's actually inside
  the file, not just its name. If it guesses wrong, you can pick the format yourself.
- **It knows which account it is.** If the statement mentions an account you've already
  registered, Aevum links the transactions to it. If it doesn't recognise the account,
  it offers to register it for you.
- **It won't import the same statement twice**, and if something goes wrong partway,
  nothing is left half-imported — you can simply try again.

Because imported rows come straight from your bank, Aevum keeps their **amounts
locked** — that's the official record. You can still re-categorize them or add a note,
you just can't rewrite what the bank reported.

## Nothing is ever silently lost

When you delete a transaction, Aevum hides it from all your lists and totals — but it
doesn't truly erase it. The record is kept quietly in the background so that anything
that depended on it (a past tax bill you already settled, an audit of your history)
still adds up correctly. To you it's gone; underneath, the trail stays intact.

The same care applies to names: if you later delete a payee, the transactions you made
with them don't go blank — they keep showing the name as it was at the time.

## Seeing where your money went

Beyond the plain list, you can group your transactions two ways:

- **By category** — how much went to dining, groceries, rent, and so on.
- **By payee** — how much went to each person or merchant.

You can look at a single week, a single month, or your whole history at once. These
views are what turn a long list of lines into a picture of your spending.

## How it all fits together

However a transaction arrives — typed or imported — it flows through the same steps:
Aevum works out who it was with, which account it touched, and how to categorize it,
then updates your budgets and your weekly tax to match. That's why a single edit
ripples through the rest of the app instantly, and why everything you see stays in
step with the underlying record.
