<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@be3d1be7/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/bankAccounts/. -->

# Bank Accounts

This is where you tell Aevum about the accounts you actually spend from — your everyday
bank account, a wallet like PhonePe or Paytm, and the savings account it sets your tax
aside into. You reach it under **Settings → Bank accounts**.

Adding your accounts is optional. Aevum works fine with none of them — but adding them is
what lets an imported statement land against the right account, and it gives your tax
somewhere to be saved.

## Adding an account

Add an account and you give it a name, say what kind it is (a regular bank account, a
savings account, a wallet, or something else), and — if you like — attach its **UPI ID**.

That UPI ID is the important part. It's how Aevum knows a transaction in an imported
statement belongs to _this_ account. Because a single wrong character would quietly
misfile your spending, Aevum tries hard to let you add the ID without typing it:

- **Scan its QR code** with your camera — handy on a laptop or tablet, where you can hold
  your phone's UPI QR up to the screen.
- **Upload a screenshot** of the QR — handy on your phone itself, which can't photograph
  its own screen.
- **Paste it** — every UPI app has a "Copy UPI ID" button.
- Or just type it, as a last resort.

However it arrives, the ID drops into the field for you to glance at and confirm before
anything is saved — Aevum never commits a scanned code straight to your account, in case
it misread. If you didn't give the account a name, Aevum fills one in from the ID (using
the payee name from the QR where it can), so you rarely have to write one yourself.

You can attach more than one UPI ID to the same account.

## Your savings account

One of your accounts can be marked as your **savings account** — the one your
self-imposed tax is set aside into. When a bill comes due, Aevum moves the money from
your everyday account into this one; when you spend _from_ it later, it knows that money
was already saved.

Only a savings-type account can play this role, and that's deliberate: the whole point is
that this is money you've genuinely set aside, not money that's still free to spend. You
can have more than one savings account, and you choose which of them holds your tax.

Until you've picked one, a gentle banner reminds you to — because without it, your tax
has nowhere to settle. You can dismiss it whenever you like.

## Editing, archiving and removing

Each account has a **⋯** menu to edit its details, change its UPI IDs, or remove it.

If an account already has transactions tied to it, Aevum won't let you delete it outright
— that would orphan your history. Instead it offers to **archive** it: the account steps
out of the way and drops to the bottom of the list, but stays around so your past
imports still recognise it. You can bring it back at any time.

## Picking an account as you record spending

When you add or edit a transaction by hand, you can point it at one of your accounts. If
you haven't added any accounts yet, that choice simply doesn't appear — so nothing on the
form is ever asking you for something you haven't set up.
