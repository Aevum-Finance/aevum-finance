<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@be3d1be7/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/beneficiaries/. -->

# Beneficiaries

Beneficiaries is your directory of everyone money moves between — the shops and
services you pay, and the people who pay you. Keeping it tidy is what lets Aevum
recognise your spending and sort it for you automatically.

## Businesses and people

Every entry is either a **business** (a shop, a subscription, a utility) or a
**person** (a friend, family member, your employer, a landlord). The distinction
matters, because Aevum treats the two differently — a person can be your employer
whose salary you expect each month, while a business is somewhere you spend.

You don't have to build this list up front. It fills itself in: the first time you
record a payment to a new shop, that shop is added for you. A brand-new account
starts almost empty, and that's exactly as intended.

## Recognising who you pay

As you type a name, Aevum offers a match from its catalog of known businesses. Accept
the suggestion and the entry arrives already set up — sorted into the right kind of
spending from the start, instead of landing as "uncategorised" for you to fix later.

If a name you're adding already exists, Aevum tells you **before** you save, so you
don't end up with the same shop listed twice. Two copies of one payee would split its
history in half, so it's worth heeding that warning.

## How auto-sorting works

Aevum learns to categorise your spending by the **relationship** you set on a
beneficiary — for example, marking someone as your employer, or a business as your
landlord. Once it knows the relationship, it can tag future payments to and from that
party without you lifting a finger.

You set up those sorting rules on the **Categorization** page, not on the beneficiary
itself. The beneficiary page is where you say _who_ someone is; the rules are where you
say _how their payments should be sorted_.

## Names and nicknames

A single beneficiary can carry several **aliases** — the different names the same shop
shows up as on your statements. Adding them means every variation gets recognised as
the same place, so your spending on it stays together rather than scattered.

## Cleaning up

You can **edit** any entry, **delete** ones you no longer need, or **merge** two
entries into one when you realise they're the same party under different names —
Aevum brings their history together.

One entry, **Self**, is always present and can't be removed: it represents you, and
Aevum uses it whenever you move money between your own accounts.
