<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@fb9bd3eb/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/categorization/. -->

# Categorization

Categorization is how Aevum learns to file your spending for you. Every transaction
gets a category, and once you've told Aevum how you want a particular payee handled, it
handles the next one the same way on its own.

## How the auto-tagging works

When money moves to or from someone — a shop, a person, your employer — Aevum looks for
a **rule** you've set for them and applies its categories automatically. A rule is just
a memory: "whenever I pay this coffee shop, tag it as Eating Out." Once that rule
exists, every future coffee is tagged the moment it appears, without you touching it.

The category that lands first is the **primary** one. That's the label Aevum treats as
the headline for the transaction, and it's what decides how the spending is taxed. You
can attach more than one category to a rule, but the first one leads.

## The same payee, more than one story

A single payee isn't always one kind of spending. The same company might be a shop you
buy from _and_ your employer. Money coming in from the employer side is salary; a refund
coming back from the shop side is something else entirely.

So Aevum lets a payee carry more than one rule, and you can tune them by direction:

- A **default** rule that covers everything unless you say otherwise.
- An override for **money going out**.
- An override for **money coming in**.

Most payees only ever need the default, and that's all you'll see for them. The extra
lanes are there for the few that need to tell two different stories — and Aevum keeps
them tidy, only showing the finer breakdown when a payee actually has one.

## Correcting what Aevum guessed

You're always in charge of the rules. On the categorization rules screen you can add a
rule, change the categories on one, or delete it. Each rule is shown grouped under the
payee it belongs to, so it's easy to find the one you want.

If you're entering or reviewing a transaction and its category is wrong, you can jump
straight to fixing the rule behind it — Aevum opens the editor already filled in with
that payee, so a correction is a couple of taps rather than a hunt. When you're editing
an existing rule, it shows you plainly what's changing: which categories you're adding
and which you're removing.

Adding a brand-new payee doesn't break your flow either. Right from the payee search
inside a rule, there's an option to create one on the spot; Aevum saves it, selects it,
and drops you back into the rule you were building with nothing lost.

A few of Aevum's built-in labels — the ones it uses for its own bookkeeping — can't be
put on a rule, so you won't see them offered. Those aren't categories you assign; they're
part of how the app keeps its own totals straight.

## Re-running on what you already have

New rules apply going forward automatically, but sometimes you want them applied to
history too — after a cleanup, or when you've just taught Aevum something it didn't know
before. The **Re-run categorization** action does exactly that: it walks back over your
existing transactions and re-files them against your current set of rules, so old
spending catches up with the way you categorize things today.
