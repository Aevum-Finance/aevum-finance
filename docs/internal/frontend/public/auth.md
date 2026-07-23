<!-- AUTO-GENERATED — byte-faithful mirror of aevum-web@b006f48c/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-finance mirrors this
     file and merges it with the api lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/auth/. -->

# Signing in & account security

Aevum holds your spending history, so getting into your account is meant to be quick
for you and genuinely hard for anyone else. This is what that looks like, and why each
step is there.

## Creating an account

Signing up asks for just an email and a password. Before your account opens, we email
you a short code to confirm the address is really yours — so nobody can create an
account in your name, and a typo can't lock you out of your own sign-ins later.

Everything else — your name, your currency, the rest of your profile — is set up
afterwards in a short guided walkthrough, not crammed into the sign-up form.

Prefer to skip the password entirely? You can sign in with Google or GitHub instead,
where those are available. Those accounts are already confirmed by the provider, so
they go straight through.

## Signing in

You sign in with your email and password. Depending on how you've secured your account,
Aevum may then ask for one more thing before letting you in. Each of these is a
deliberate checkpoint, not a hurdle for its own sake:

- **A code from a new device.** The first time you sign in from an unfamiliar phone,
  laptop or browser, Aevum emails you a one-time code to confirm it's you. If it wasn't
  you, that same email has a one-click link to shut the attempt down.
- **Your authenticator code**, if you've turned on two-factor authentication (below).
- **Confirming your email**, if you signed up but never finished confirming it.

Once you've cleared whatever applies, you're in — and that device is remembered, so you
won't be asked again from the same place.

## Two-factor authentication

Two-factor authentication (2FA) adds a second lock: even someone who knows your password
can't get in without a rotating code from your authenticator app. You set it up once by
scanning a QR code, and Aevum gives you a set of **backup codes** to save somewhere safe.

Those backup codes are the way back in if you ever lose your phone. They matter because
2FA is enforced everywhere — even resetting a forgotten password still asks for your
second factor, so recovering your password alone is never enough for someone else to get
in.

## Forgetting your password

If you forget your password, you can reset it from the sign-in screen. Aevum confirms
it's really you first — through a security question, a one-time emailed code, or both —
before letting you set a new one. If you have two-factor turned on, that still applies at
the end, so a password reset can't be used as a shortcut around it.

## How your session is protected

Once you're signed in, Aevum keeps you signed in without leaving the keys lying around:

- Your device is recognised by a **private key that never leaves it** and can't be
  copied to another machine. That's what tells a familiar device apart from a new one.
- The credential that proves who you are is **kept in your browser's memory only**, not
  written to disk, so it disappears the moment you close the tab and can't be scraped out
  of storage.
- If you're inactive long enough, your access quietly expires and is renewed in the
  background — you stay signed in without the app ever leaving a long-lived key sitting
  around.

You can review where you're signed in, and which devices you've trusted, from your
account's security settings — and sign any of them out at any time.

## If something goes wrong

If you mistype your password too many times, Aevum briefly pauses new attempts and tells
you exactly how long to wait, rather than silently failing. It's a speed bump against
someone guessing their way in — and it clears on its own.

And if something breaks on our side rather than yours, you'll see a plain message and a
short reference code, so support can look up exactly what happened instead of guessing.
</content>
