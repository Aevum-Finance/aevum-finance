<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@5b72b821/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/beneficiaries/. -->

# The people and places you pay

## The idea

Every transaction has another side — the shop you bought from, the friend you split a
bill with, the employer who pays your salary. Aevum keeps a tidy record of each of
these, so that "Flipkart" or "Mum" is a real thing the app understands, not just a line
of messy text on a bank statement.

Getting that record right is what lets everything else work: the app can only categorize
your spending, tax it correctly, and total up "how much did I spend at cafés this month"
once it knows _who_ each payment was with.

## Your list starts empty, and fills itself in

When you first sign up, your list of payees is essentially blank. You don't have to
build it by hand. As you add transactions and import statements, Aevum recognises the
places you pay and adds them for you — and for well-known businesses it already knows
the useful details, like which category they belong to.

So the list grows naturally around _your_ spending. You'll never scroll past hundreds of
shops you've never visited; you'll see the ones you actually use.

## Businesses and people

Aevum sorts each payee into one of two kinds:

- **Businesses** — shops, restaurants, utilities, anywhere you spend money. These can
  carry a category, which helps the app tag your spending automatically.
- **People** — friends, family, anyone you send money to directly. Money moving between
  you and another person is treated as a transfer, not spending, so it isn't taxed.

You can switch a payee from one kind to the other at any time, and Aevum keeps the
contact details you'd already filled in.

## Recognising the same payee twice

Bank statements are messy — the same shop can appear under half a dozen different names.
Aevum works hard to match each new payment to a payee you already have, rather than
creating a near-duplicate. When you add one yourself, it warns you _before_ you save if
the name or a nickname clashes with someone already on your list.

This matters more than it sounds. If the same shop ends up recorded twice, your spending
there gets split between the two entries, and there's no clean way to stitch it back
together later. Aevum is deliberately careful to avoid that in the first place — and if
two entries _do_ end up representing the same payee, you can **merge** them into one, and
their combined history moves across intact.

## Nicknames

You can give any payee extra names — nicknames or aliases. A statement that reads
"EKART" can then be recognised as the "Flipkart" you already know. Adding a nickname is
often all it takes to teach the app that two differently-worded payments were really the
same place.

## Where each side's money sits

Aevum can also remember the _other side's_ account details — the account your salary
lands from, or the one a refund comes back to. That's how it can reliably tell that this
month's salary is the same recurring income as last month's, even if the wording changes.

## You, as a payee

There's one payee that's always there from the start: **you**. When you move money
between your own accounts, the other side of that transfer is simply yourself. Aevum
keeps this entry locked and always in sync with your name, because so much of the app
leans on knowing which movements are just your own money shuffling around.
