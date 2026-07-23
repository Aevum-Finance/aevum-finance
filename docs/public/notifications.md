<!-- Tier: T0 · product · users. Assembled at aevum-finance by merging the backend + frontend
     lane T1 docs into one product narrative. The prose here is authored; the provenance block
     below is generated (tooling/build-public.mjs). Keep this page free of tier labels and
     internal paths — a reader must never be shown which module or bucket its content came from. -->

<!-- BEGIN GENERATED:provenance -->
<!-- Product topic "Notifications & activity". Reconciles these mirrored lane T1 docs
     (edit at source; reconcile the merge here):
     backend:  activity (the per-user activity feed and signal settings) -> ../internal/backend/public/activity.md -->
<!-- END GENERATED:provenance -->

# Notifications & activity

Aevum does a lot for you quietly in the background — closing your weekly tax bill, watching your budgets, reading the statements you upload. The **activity feed** is where all of that surfaces, so nothing important happens without you knowing.

It's the single place to answer one question: **is there anything I should look at?**

## What shows up

The feed gathers the moments worth your attention as they happen:

- **A new bill** — your weekly [consumption tax](consumption-tax.md) has closed and is ready to settle.
- **A budget breach** — you've gone over a limit you set on one of your [budgets](budgets.md).
- **A failed import** — a bank statement couldn't be read and your [transactions](transactions.md) need another try.
- **Setup left half-done** — something like [account security](account-and-security.md) you started but didn't finish.
- **Quiet good news** — a bill paid, a task completed, a step wrapped up.

## Two kinds of update

Not everything is equally urgent, so Aevum sorts each update into one of two kinds:

- **Notifications** simply tell you something happened — a bill was generated, a payment went through. Nothing is required of you.
- **Alerts** are things that need you to act — an over-budget category, a broken import, an unfinished setup step. These sit higher and stand out.

The distinction earns its keep in what happens next: an alert **clears itself the moment you fix the underlying thing.** Sort out the over-budget spending, retry the import, or finish the setup step, and the alert quietly disappears on its own. You never have to tidy up the feed by hand — it reflects the real state of things, not a pile of reminders you have to dismiss one by one.

## Seen, but not gone

Glancing at the feed and acting on something are different things, and Aevum keeps them apart:

- Scrolling past an update just **quietens** it — it stays, a little dimmer, so you don't lose it.
- **Acknowledging** it settles it for good.
- You can also **snooze** an update, and it'll resurface later when it's a better time to deal with.

So a busy week never makes you lose track of something just because you saw it in passing.

## You decide what's worth hearing

Every kind of update can be **switched off individually.** If new-bill notices are noise to you but budget alerts aren't, mute the one and keep the other. Reminders about [recurring](recurring.md) bills coming due, nudges to finish securing your account, the quiet confirmations when a payment lands — each is yours to keep or silence. Your choices are yours alone, and you can change them any time from your **notification settings**.

Muting a signal only stops it from appearing in your feed; it never changes what Aevum does underneath. Turn off new-bill notices and your weekly bill still closes on schedule — you simply won't be pinged about it.

## Always up to date

Most updates appear the instant they happen — the second your weekly bill closes or a budget tips over. A few are about the passage of time itself, like a payment falling due, and Aevum checks for those once a day so they never slip through unnoticed.

Either way, the feed is the one place that always reflects where things stand right now — a running record of everything the app has done on your behalf, and everything still waiting on you.
