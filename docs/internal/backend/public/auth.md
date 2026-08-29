<!-- AUTO-GENERATED — byte-faithful mirror of aevum-api@09917f61/docs. Edit at source, not here. -->

<!-- Tier: T1 · general audience ("anyone"). Public-safe: aevum-hub mirrors this
     file and merges it with the web lane's T1 into the T0 product doc.
     Keep this page free of code, internal paths and tier labels — a reader here
     should never be shown which audience bucket they were sorted into.
     Mechanics live in docs/internal/modules/auth/. -->

# Signing in and keeping your account secure

## The short version

Your account is protected by more than a password. Aevum ties each sign-in to the
specific device you're using, offers an optional second step at login, remembers
the devices you trust, and tells you by email whenever something new happens — a
sign-in from an unfamiliar device, a password change, a new email address. The
goal is simple: even if someone learned your password, they still shouldn't be
able to get in.

## Creating your account

When you register, we send a verification code to your email address. Your account
isn't active until you enter that code — this confirms the address really belongs
to you and that we can reach you if we ever need to. You can also sign up with
**Google or GitHub** instead, in which case that provider vouches for your email
and you skip the code.

## Signing in

Enter your email and password and you're in. Depending on how you've set things
up, Aevum may ask for one more thing before finishing — a code from your
authenticator app, or a one-time code we email you when you're on a device we
haven't seen before. Each of these is a quick extra step that stands between a
stolen password and your account.

## Two-factor authentication

You can turn on **two-factor authentication** (2FA) using any authenticator app
(Google Authenticator, Authy, and the like). Once it's on, signing in asks for a
short code from that app in addition to your password. Because the code changes
every few seconds and lives only on your phone, knowing your password is no longer
enough to sign in.

When you set 2FA up, we give you a set of **backup codes**. Save them somewhere
safe. If you ever lose your phone, a backup code gets you back in — each one works
once. Turning 2FA off again requires your password, so nobody can quietly disable
it.

## Trusted devices

The first time you sign in from a new phone or computer, Aevum emails you a
one-time code to confirm it's really you. Once you've entered it, that device
becomes **trusted** and won't ask again. You can see all your trusted devices in
your security settings and remove any you don't recognise — the confirmation email
also has a one-click link to revoke a device on the spot if the sign-in wasn't
you.

You can be signed in on several devices at once. If you sign in on a great many,
the oldest sessions are quietly retired to keep the list manageable.

## If you forget your password

You can reset your password two ways: by answering the **security question** you
set up, or by requesting a **code sent to your email**. Either one lets you set a
new password and sign back in.

To stop anyone from guessing their way in, recovery locks itself for a while after
several wrong attempts, and the wait grows the more times it's tried. If that ever
happens to you, the simplest fix is to wait it out — or, if you actually remember
your password, just sign in normally, which clears the block straight away. For
your privacy, the recovery screens never reveal whether an email address has an
account with us.

## Changing your email or password

- **Changing your password** signs you out of your _other_ devices, so a forgotten
  session somewhere can't linger. We email you to confirm the change happened.
- **Changing your email** takes your password (and a 2FA code, if you use 2FA),
  then sends a confirmation code to the _new_ address. We also notify your _old_
  address, so a change can never happen silently behind your back.

## We keep you informed

Aevum emails you when something that matters to your account's security happens: a
sign-in from a new device, a password change, an email change. If one of those
messages is ever about something you didn't do, it's your early warning — and the
tools to lock things down (remove a device, change your password) are right there
in your settings.

## Deleting your account

If you choose to delete your account, we don't erase everything on the spot.
There's a grace period during which the account is signed out everywhere and the
deletion can still be cancelled from a link we email you. Only after that window
passes is your data permanently removed.
