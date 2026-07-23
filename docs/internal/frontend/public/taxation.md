<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@be3d1be7/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/taxation/. -->

# Tax Tracker

The Tax Tracker is where you watch your self-imposed consumption tax accumulate and
settle it. (For what the tax _is_ and why it exists, see the engine's own overview.)

## This week, live

The top of the Tax Tracker shows the week you're currently in — how much tax you've
accrued so far, and how much of that is penalty from going over a budget.

It updates as you spend. You don't wait until the end of the week to find out where
you landed; the number moves with you, so the tax stays a visible running total rather
than a surprise.

The week runs **Monday to Sunday** in your own timezone.

## Your past bills

Below the current week is the list of finalized bills — one per past week — each
showing its status at a glance:

| Status       | What it means                                              |
| ------------ | ---------------------------------------------------------- |
| **Accruing** | the live week, still growing                               |
| **Billed**   | the week has closed; you have two weeks to pay             |
| **Paid**     | settled                                                    |
| **Overdue**  | past its due date                                          |
| **Expired**  | left unpaid long enough that Aevum stopped auto-finalizing |

You can sort the list, and open any bill to see exactly what made it up.

## What's inside a bill

Opening a bill shows every transaction that contributed, what it was taxed at, and —
if you went over a budget — a breakdown of the penalty by which budget you breached.
So a bill is never just a number you're asked to accept; you can always trace it back
to the specific spending that produced it.

If you corrected a transaction from an already-closed week, that shows here too, as a
clearly-labelled adjustment with a before-and-after, rather than by quietly rewriting
history.

## Paying

There's a single **Pay tax** action that settles what you owe in one go, moving money
from your everyday account into your savings account. You can also mark individual
bills as paid if you settled them another way.

If you transfer money into your savings account yourself, Aevum recognises it and
applies it to your oldest outstanding bills automatically — so paying "by hand" still
keeps the ledger straight.

## Setting your rates

Under **Settings → Taxation rules** you control the whole thing: the tax rate for each
kind of spending, and the penalty rate for going over budget.

Each rule is listed with a plain-language explanation of what that kind of spending
covers, so you're not guessing what "discretionary" means when you change a number.
Rates can be entered however you think about them — `5%`, `0.05`, or just `5`.
