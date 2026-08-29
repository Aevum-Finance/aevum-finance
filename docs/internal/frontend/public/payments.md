<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@fb9bd3eb/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/payments/. -->

# Paying by UPI

You can start a UPI payment from inside Aevum and have it recorded at the same
moment. No more paying in one app and typing it into another afterwards, or waiting
for it to turn up on a statement.

## What Aevum does, and what it doesn't

Aevum prepares the payment — who it's going to, how much, and a reference of its
own — and hands that to **your** UPI app. You approve it there, with your own PIN,
exactly as you always have.

**Your money never passes through Aevum.** It goes straight from your bank to the
payee, the same as if you'd scanned the QR yourself. Aevum is not a payment app and
never holds a rupee of yours; it prepares and it records, and that's the whole of
it.

## Where you can pay from

**Pay** sits on your dashboard and on the Transactions page, and on a phone there's
a Pay button waiting at the bottom of every screen. Whichever you use, it asks the
same question first — who are you paying?

- **A payee you've saved** — pick them from the list. If you've paid them before,
  their UPI ID is already filled in.
- **Someone's QR code** — scan it with your camera, or upload a picture of it. Both
  work on a phone and on a computer, because the code is just as likely to be on a
  screen in front of you as on a counter. In a dark restaurant, there's a
  flashlight.
- **Yourself** — move money between your own accounts. Aevum knows it isn't
  spending, so it isn't taxed as any.
- **Your self-tax** — the **Pay** button on the Consumption tax page, or inside any
  unpaid bill, moves your provision into your savings account.

You're never asked to type a UPI ID out of thin air. It's long, it's easy to
mistype, and a wrong one pays a stranger with no way back — so it comes from
somewhere trustworthy: a payee on file, or a code you scanned. (You _can_ type one,
for a handle someone texted you. It's just never the thing Aevum leads with.)

## Paying someone you've paid before

Scan a code from a shop you've used, and Aevum recognises them: you see their name,
not a string of characters you'd have to read carefully. Their other UPI IDs are
there too if they have more than one — a shop's counter code and its refund code
aren't interchangeable.

If they're new, Aevum fills their name in from the code and saves them once the
payment goes through, so next time they're already known. The name is yours to
correct before you pay — and if the code carries nothing but a phone number, Aevum
leaves the name blank rather than filing them under a row of digits you'd never
find again.

## Filling in the payment

You'll be asked for the amount and shown which of your accounts you're paying
from. Two things worth knowing:

- **The amount is locked into the payment.** Your UPI app will show it already
  filled in, so there's no chance of a stray digit between here and there. If
  you're scanning a code that already carries an amount, that amount is fixed by
  the payee and can't be changed — pay it or cancel.
- **The account you pick is a note for your own records.** UPI doesn't let an app
  choose which of your accounts pays; you'll select that inside your UPI app, and
  you're free to pick a different one. Aevum records what you told it, and your
  statement is what settles the matter later.

On a phone, you'll get a button that opens your UPI app. On a computer you'll get a
QR code instead, because your UPI app is on the phone in your hand — scan it there.

## The bit that needs you: "Did it go through?"

When you come back, Aevum will ask whether the payment succeeded.

This isn't Aevum being unsure of itself. **A website genuinely cannot be told the
outcome of a UPI payment** — there's no channel for it on any phone or browser, and
Aevum isn't in the path your money takes, so it has nothing else to go on. The only
reliable source is you.

You have three answers:

- **Yes, it went through** — the payment is recorded as a real transaction, tagged
  and taxed like any other.
- **No, it failed** — nothing is recorded. A failed payment leaves no phantom spend
  behind.
- **Not now** — you don't know yet. Maybe you're waiting on your bank's message.
  The question comes back later; nothing is written either way.

That last one matters. **A guess is worse than a delay** — a wrongly recorded
payment distorts your spending, your budgets and your self-tax, and it's more work
to unpick than it was to wait.

If you close the tab, switch devices, or simply forget, the question isn't lost.
It'll be waiting in your notifications the next time you're back.

## Paying an upcoming bill

Bills Aevum expects — the ones on your Recurring page and in the upcoming widget on
your dashboard — have a **Pay** button too. The amount is prefilled from what the
bill usually costs, and you can change it if this month is different.

Once you confirm the payment, both the transaction and the bill are settled — the
bill moves out of your upcoming list and into your history there and then.
