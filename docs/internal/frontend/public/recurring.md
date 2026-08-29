<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@fb9bd3eb/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/recurring/. -->

# Recurring bills

Most of your money moves on a schedule — rent, a subscription, a salary, the same
grocery run every week. Aevum watches for those repeats so you don't have to track them
by hand.

## How Aevum spots them

As you record transactions, Aevum quietly looks for patterns: the same payee, around the
same amount, at a regular interval. When it's seen enough of a rhythm to be confident,
it surfaces the pattern as something it **detected** — a suggestion, not a decision.

It's important that these start as suggestions. Aevum never invents a payment or moves
your money on its own. It's showing you what it noticed and asking whether it got it
right.

## Confirming, correcting, dismissing

Detected patterns wait for you on the Recurring page under **Detected**. For each one you
can:

- **Confirm** it — you agree this is a real recurring bill, and Aevum should keep an eye
  out for it going forward.
- **Edit** it — the amount drifted, the day changed, the payee is slightly off. Adjust
  it and it becomes yours.
- **Dismiss** it — it was a coincidence, or it's over. It moves aside and stops being
  forecast. If you change your mind, you can bring it back.

Once you confirm one, it moves to **Confirmed**, alongside anything you added yourself.

## Adding one yourself

If there's a regular bill Aevum hasn't spotted yet — maybe it's brand new, or you just
started using the app — you can add it by hand with **Add manually**. You pick the payee,
the amount, whether it's money going out or coming in, and how often it repeats (weekly
on a given day, monthly on a given date, or yearly). From then on it's treated exactly
like a confirmed one.

## Keeping an eye on things

Aevum flags a confirmed bill as **needs attention** when it stops behaving — a payment
that should have arrived didn't, or the amount has drifted away from what it used to be.
That's your cue to take a look: maybe the rent went up, maybe a subscription lapsed.
Either confirm the new normal or dismiss the bill.

You can also **pause** a bill without deleting it — handy for a subscription you've put on
hold — and unpause it later.

## What's coming up

The **Upcoming** view lists the bills Aevum expects over the next month, each with its
payee, amount, and due date — so you can see what's about to leave your account before it
does. A shorter version of the same forecast sits on your dashboard for the week ahead.

When a real transaction later matches one of these — you pay the rent, the salary lands —
Aevum recognises it and ties the two together, so the forecast and your actual spending
stay in step without any extra work from you.
