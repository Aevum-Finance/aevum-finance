# The Design System

How Aevum's visual layer works, at a mechanics level. The goal is a single,
coherent look that a designer can change in one place and see reflected
everywhere — no per-screen restyling, no drift.

## Tokens, not colors

Components never reach for a raw color value. Every surface reads from a small
set of **named semantic tokens** — an accent family, and success / warning /
danger state families — each defined once as CSS variables. Because a component
references a token by meaning ("accent", "danger") rather than by hue, the
actual color can change under it without touching the component.

Two rules make this load-bearing:

- **The accent flips per theme.** The brand accent resolves to one hue in light
  mode and a different one in dark mode. The flip lives entirely in the token
  definitions; consumers stay theme-agnostic and simply say "accent."
- **State tokens do not flip.** Success, warning, and danger keep a stable hue
  across themes; the right shade for each background is chosen at the call site,
  so a warning reads correctly in both light and dark without special-casing.

A separate "pay attention here" tone is deliberately theme-stable and distinct
from the accent, so an attention flash and an interactive chip speak the same
visual language everywhere they appear.

The upshot: no ad-hoc color in a component, ever. A raw color can't follow a
theme switch; a token can.

## The cream ground and brand gold

The app sits on a warm, low-glare ground rather than stark white, with the
brand's gold reserved for identity moments. These live as tokens too, so the
overall temperature of the app is a single-source decision rather than a value
repeated across dozens of screens.

## Light / dark / system

Theme is a **three-state choice**: light, dark, or follow-the-system. The
resolved mode is applied as a single class on the document root, and every
component ships its dark treatment alongside its light one from the day it's
built — dark mode is never deferred and retrofitted.

Two mechanisms keep it seamless:

- **System mode is live.** When the user follows the system, the app watches the
  OS preference and re-resolves the moment it changes.
- **No flash of the wrong theme.** The correct mode is applied before the app's
  UI paints, reading the saved choice up front, so a dark-mode user never sees a
  white flash on load.

## The accessibility layer

A set of device-level and user-level display preferences ride the same
class-on-root mechanism as the theme. Each is a small independent switch that,
when on, tags the document root; CSS then observes that tag. The set includes:

- **Reduced motion** — the hard contract below.
- **High-contrast** — a higher-contrast palette for readability.
- **Underlined links** — forces link underlines for users who rely on them.
- **Always-visible focus ring** — keeps the keyboard-focus indicator present at
  all times.
- **A privacy mask** — blurs on-screen monetary amounts on demand.
- **Text-size** — a user zoom override applied at the root.

Like the theme, these are painted before first render, so the app comes up in
the user's chosen state without a flash. Some are device-shaped (the right value
differs between someone's laptop and their phone, so they stay local to the
device); others are properties of the person (a user who needs a visible focus
ring needs it everywhere, so they follow the account across devices). The
distinction is deliberate and decides where each preference is remembered.

### Reduced motion is a contract, not a mode

When reduced motion is on — whether from the OS or the in-app toggle — every
animation snaps to its final state, and every value is required to be correct on
first paint with motion off. Motion is only ever an enhancement layered on top
of already-usable content; it never gates what the user can see. This guarantee
is built into the shared motion and interaction primitives, so no individual
screen has to special-case it.

## Component tokens

The same single-source idea extends past color to behavior. Interactive
elements are classified by **purpose** first — a commit action, a neutral
secondary, a low-emphasis inline action, a destructive confirm — and each role
maps to one token that carries both its look and its behavior (for example, a
commit button stays disabled until the form is dirty and flashes on success).
Two buttons that look similar can belong to different roles; classifying by what
the control *does* means it inherits the right visual and the right behavior
automatically.

Motion timings and easings live in one token set as well, and shared feedback
gestures — the tap-press depress, the save-highlight glow — are each a single
token dropped onto a surface, never re-authored per screen.

## How a change trickles down

Because every rule is single-sourced into a token or a shared primitive, a
design change follows one path: it's decided, it lands in exactly one place —
one token, one timing value, one shared component — and every consumer, which
already reads that shared surface, reflects it with no per-screen edit. That
single-sourcing is what keeps the app feeling like one coherent product rather
than a patchwork of screens.
