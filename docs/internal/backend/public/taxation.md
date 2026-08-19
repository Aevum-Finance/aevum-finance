<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@ac475514/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/taxation/. -->

# The consumption tax

## The idea

Most budgeting apps tell you what you spent. Aevum turns each expense into a small act
of saving.

Every time you spend on something taxable, Aevum charges you a **small self-imposed
tax** on your own purchase and sets that money aside. Over time this builds a real
provision for future expenses of the same kind — so the money isn't merely *tracked*,
it's actually moved into a savings account.

The point is **forced provisioning, not punishment.** The tax isn't a scolding for
spending; it's a way of quietly funding the next time you need to spend on that thing.

## How much you're taxed

It depends on what kind of spending it was. Each of your categories carries a type, and
each type has its own rate — which **you** control:

| Kind of spending  | Examples                | Default rate |
| ----------------- | ----------------------- | ------------ |
| Discretionary     | dining out, shopping    | 10%          |
| Essential         | groceries, utilities    | 5%           |
| Fixed commitments | rent, loan EMIs         | 0%           |
| Uncategorized     | anything not yet sorted | 10%          |

Income, transfers between your own accounts, and anything you mark **exempt** are never
taxed.

Fixed commitments sit at 0% by default on purpose: they're counted as taxable, but
start un-taxed, so you can raise the rate yourself if you want to provision for them.

## Budgets add a penalty — the tax alone does not

You can set a budget per category. Stay inside it and you pay only the base tax. Go
over it and a **penalty** is added on top, for the portion past the limit.

This is the part most people get backwards, so it's worth being explicit: **the base
tax applies to all taxable spending, all the time.** Breaching a budget doesn't create
the tax — it only adds the extra penalty.

A refund works in your favour twice over. Tagged as a refund, cashback, or
reimbursement, it books a matching **deduction** — giving back the self-tax the
original spend set aside — and it reduces your spending for the month, which can bring
you back under a budget limit. If a week's refunds come to more than its tax, you owe
nothing that week and the surplus carries into the next.

## One bill a week

Rather than nickel-and-diming every purchase, Aevum totals everything into a **single
weekly bill**, running Monday to Sunday in your timezone.

During the week the bill is live — it grows as you spend, so you can watch it in real
time rather than being surprised. When the week closes, the bill is finalized and you
have two weeks to settle it. Settling moves the money out of your everyday account and
into your savings account.

You can make that transfer by UPI without leaving Aevum — it prepares the payment into
your savings account and hands it to your UPI app. If you'd rather move the money some
other way, you can, and simply tell Aevum you did.

Some weeks you owe nothing — you only moved money to savings, or paid off a tax
bill, or spent nothing taxable at all. Those weeks still get a bill; it just says
nothing is owed, and why. Aevum keeps them rather than skipping them, so a quiet
week always looks like a quiet week and never like something that went missing.

Once a week has closed, its bill is never rewritten. If you later correct a transaction
from that week, the difference appears as a clearly-labelled adjustment on your
*current* bill instead — so your history stays trustworthy, and you can always see what
changed and why.

## You stay in control

- **Rates are yours.** Every rate and penalty is tunable.
- **The tax can be switched off entirely**, leaving expense tracking alone.
- **Budgets are optional** — with budgeting off, there are no breaches and no penalties.
- **If bills pile up unpaid**, Aevum stops auto-finalizing them and hands control back
  to you rather than letting a backlog build silently.

## Where the money goes

Into a savings account you nominate. Today that's exactly what it is: real money, set
aside, yours. It's the foundation the rest of Aevum is built to grow on.
