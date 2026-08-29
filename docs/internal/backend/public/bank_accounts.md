<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@09917f61/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/bank_accounts/. -->

# Your accounts

## Why add your accounts

Aevum works fine without them — you can track spending and be taxed on it without ever
registering a single account. But telling Aevum about the accounts you actually use
unlocks two things: your bank statements import against the right account automatically,
and you get to choose where your set-aside savings live.

## Registering an account

An account in Aevum is just a record of somewhere your money sits — a bank account, or a
prepaid wallet like a PhonePe or Paytm balance. For each one you give it a name and say
what it's for: everyday spending, a dependent's expenses, an emergency fund, a savings
goal, and so on.

That "what it's for" is your call, not the bank's. If you'd rather use an ordinary
account as your savings pot, Aevum won't argue — you label it, you decide.

## Your UPI handles

Add the UPI handles (and later, other identifiers) you pay from to the account they
belong to. This is what lets an imported statement land against the right account
without you sorting it by hand: when Aevum sees a payment from a handle you've
registered, it knows exactly which of your accounts it came from.

A couple of things make this reliable:

- **Case and spacing don't matter.** Aevum tidies each handle when you save it, so the
  same handle typed two slightly different ways is recognised as one, not two.
- **The same handle can belong to two people.** If you share a joint account, both of
  you can register its handle — you won't be blocked because someone else already has it.

If a statement shows a payment from a handle Aevum doesn't recognise, it won't guess —
it'll suggest you register the account, and leave the choice to you.

## Nominating a savings account

Aevum's self-imposed tax moves money into a savings account you nominate. To be eligible,
an account has to be marked as savings — everyday spending accounts can't be the pot,
because that's money you'd spend, not money you've set aside.

You can have more than one savings account, and you can turn the savings role off for
one you'd rather keep as a plain goal or emergency fund. Whichever account you nominate,
that's where your weekly tax bills are settled — real money, set aside, still yours.

## A few things worth knowing

- **Changing what an account is for can re-sort your history.** If you turn an account
  into your savings pot after you've already imported transfers into it, Aevum quietly
  re-reads those transfers so your tax bills settle correctly. It's automatic — you don't
  have to redo anything.
- **You can't delete an account that has transactions.** To keep your history intact,
  Aevum won't let you remove an account that's already tied to spending. **Archive** it
  instead — it disappears from your everyday menus, and your past records stay whole.
