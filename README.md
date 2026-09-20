# Wear Label

Company profile, product catalogue and storefront for **Wear Label** — an apparel
brand in Bandung, Indonesia. A **Shopify theme**, built from an approved design.

```bash
npm install
npm run theme:css        # build theme/assets/theme.css
npm run theme:check      # shopify theme check — runs offline
npm run theme:dev        # local preview with hot reload
```

| | |
|---|---|
| **Deliverable** | Liquid theme in [`theme/`](./theme/README.md) — Online Store 2.0, JSON templates, sections and blocks |
| **Styling** | Tailwind CSS v4 precompiled, CSS-variable design tokens |
| **Store** | `kbysza-bk.myshopify.com`, theme `205197312286`, role `unpublished` |
| **Tooling** | Shopify CLI pinned as a devDependency; `npm install` is all you need |
| **Design** | Ported from two Claude Design documents — see [Design](#design) |
| **Archive** | The Next.js app at the repo root is the reference the theme was ported from |

[`CLAUDE.md`](./CLAUDE.md) is the working document: architecture, conventions, the
catalogue table, the store's identity and every decision made or deliberately
deferred. [`theme/README.md`](./theme/README.md) is the port's own record — what
moved, what got better, and the one thing that got worse. This file is the tour.

---

## It was headless, and now it is not

The site was built first as a custom Next.js frontend on the Shopify Storefront API.
That was rebuilt as a theme on 2026-08-20, for a reason the old `CLAUDE.md` had
already written down without drawing the conclusion:

> This repo is **presentation only**. No commerce logic lives here.

If there is no commerce logic, headless is paying for control nobody uses — and
`lib/shopify/` was ~850 lines standing in for things Liquid does natively:

| Deleted | Lines | Replaced by |
|---|---|---|
| `cart.ts` + `actions.ts` | 343 | form posts to `/cart/add` and `/cart/change` |
| `catalogue.ts` | 241 | `collection.filters`, `sort_by`, `paginate` |
| `fixtures.ts` | 121 | the store |
| `types.ts` | 79 | Shopify's own objects |
| `money.ts` | 39 | `{{ price \| money }}` |
| `env.ts` | 26 | no live/fixture gate left to keep |

The port was a rewrite of markup, not of behaviour, because the two conventions the
app was built on are Shopify's own model:

- **"The URL is the state"** — filters are links that flip one facet and preserve
  the rest. That is exactly `?filter.v.option.size=M&sort_by=price-ascending`.
- **"Forms work without JavaScript"** — that is how a Liquid cart form works.

Three platform facts pointed the same way: checkout is Shopify-hosted either way on
a non-Plus plan, Indonesian couriers need an app that quotes rates during checkout,
and the client can write their own copy in the theme editor instead of waiting on a
code change.

## What is built

All six routes, plus the shell.

| Route | What it is |
|---|---|
| `/` | Hero carousel, new arrivals, customer voices wall, service band, Instagram strip |
| `/collections/all` | Catalogue — filter rail, sort, 3-up grid, paging |
| `/products/<handle>` | Product — gallery, size and colourway, quantity, add to bag, tabs, related |
| `/cart` | Bag — lines, quantity, removal, order summary, hand-off to Shopify checkout |
| `/pages/about` | About Us — the Shopify page's own title and content |
| 404 | Branded, with placeholders until the copy exists |

Three sections are built and deliberately **not placed**: the category mosaic
(removed on request), the limited-run band (cut from the design's sequence), and
made-to-order. The first two may go back — and because they have presets, that is
now a click in the theme editor rather than a code change.

Made-to-order must **not**: the studio does not offer that service, so every line of
that band is a promise nobody can keep. [`PRODUCT.md`](./PRODUCT.md) records the
decision and the customer evidence behind it.

## What is *not* built, and why

Store configuration, not code — and every gap renders a labelled placeholder at
final size rather than breaking:

| Missing | What you see instead |
|---|---|
| The eleven products | Placeholder cards at the real card proportions — nine on the catalogue, eight on the home page |
| Storefront filters | The rail says they are configured in Shopify's Search and Discovery app |
| The `about` page | `/pages/about` 404s; the section is written and waiting |
| `custom.material`, `custom.care` metafields | Labelled placeholders on the card's material line and the Fabric & care tab |
| Brand copy | Blank theme settings render labelled placeholders at final size |

### The rule that shapes all of it

**Never invent commerce data.** No fabricated shipping rates, review counts, stock
numbers, countdowns or discount depths — not even as placeholder polish. Where a
number cannot be known, the UI says where it comes from ("Calculated at checkout") or
the block hides itself. It is why the design's star rating and its "Up to 40% off"
tile are absent.

**Quoting a customer is not inventing one.** The voices wall carries twenty real
Shopee reviews, verbatim, in Indonesian. That is why it is allowed where a star
rating is not: it reproduces what customers wrote instead of synthesising a score.
They are extracted from the source programmatically and asserted verbatim — never
edited, tidied or translated.

## The catalogue is real

Eleven pieces, from the design project's own `CATALOG`. Real names, materials,
prices, markdowns and photography. Sizes XS–XL and five colourways apply to every
piece, giving 25 variants each. Stock is not modelled — the sold-out states are
implemented throughout and light up the moment Shopify reports inventory.

The full table, and how `productType` was derived, is in
[`CLAUDE.md`](./CLAUDE.md#the-catalogue). Importing it into Shopify is the next big
step.

## Design

Ported from two Claude Design documents derived from the client's brand guideline:
a design system (the authority for colour, type, radius, spacing, shadow and motion)
and four approved screens.

### Tokens

One file — [`app/tokens.css`](./app/tokens.css) — and it is **shared** between the
theme and the archived app. `:root` holds brand primitives (`--wl-*`); `@theme` holds
the semantic tokens Tailwind turns into utilities. No section or snippet contains a
hardcoded design value; the palette is replaceable in one edit.

`app/base.css` holds the base layer and is shared the same way.
`theme-src/theme.css` imports both and adds only what exists because Liquid has no
React — the disclosure's icon swap, the reveal transitions, the no-script fallbacks.
720 lines of design system maintained twice would drift, so they are not.

Palette, spacing, radius and motion are deliberately **not** theme settings.
Exposing them in the editor would let one edit break the system.

### Assets

Everything came out of the design project byte-exact. `snippets/icon.liquid` is
generated from the React icon set and all twelve paths verified against it — the
design's SVGs were pulled once to diff, matched, and then not shipped twice.

### Accessibility

Part of the design, not a pass afterwards. One `h1` per page with no skipped levels —
the carousel puts an `h1` on every slide and makes the inactive ones `inert`, which
is what keeps that true. 44px minimum control height, visible focus never removed,
and **colour never carries meaning alone**: sold out says "Sold out", an applied
filter carries `aria-current`, a toggle carries `aria-pressed`.

Four contrast pairs the design specifies fall short of AA. They are implemented as
specified and annotated at the top of `tokens.css`, so the decision is visible rather
than buried.

### Motion, and the performance rules behind it

Two continuous background loops and a screenful of scroll reveals. Both have already
cost a round of visible stutter:

- **A continuous loop animates `transform` or `opacity`. Nothing else.** Anything
  else is re-rasterised on the main thread every frame.
- **`background-attachment: fixed` is banned.** It was the worst offender here.
- **Never wrap a 3D scene or a blended layer in something that animates opacity.**
  It becomes a stacking context, which flattens `preserve-3d` and breaks
  `mix-blend-mode`. The voices wall and the Instagram strip carry no reveal for
  exactly that reason.
- **`prefers-reduced-motion` leaves content reachable**, not merely frozen. A
  stopped tilted wall holds most of its reviews outside a stage that clips at 560px,
  so it flattens to a grid instead.

The voices wall and the Instagram strip cost **zero JavaScript** — both loop on CSS.

## Progressive enhancement

`theme/assets/theme.js` is seven behaviours, and each one is paired with a fallback:

| Behaviour | Without JavaScript |
|---|---|
| Header disclosure | Ships open; script is what closes it |
| Scroll reveals | Forced to their final state under `scripting: none` |
| Hero carousel | Each slide parked at its own offset; controls removed |
| Product tabs | All three panels visible, tab strip removed |
| Product gallery | Every angle shown in sequence |
| Quantity stepper | The value lives in a real number input; ± are decoration |
| Save for later | Inert, as it was in React — `localStorage` only either way |

The variant picker and the catalogue filters need no fallback: both are plain links.

## Platform constraints

Fixed properties of Shopify in this market:

- **Shopify Payments is unavailable in Indonesia** — a third-party gateway is
  required, and Shopify adds a fee on top of the gateway's.
- **A custom checkout UI needs Shopify Plus.** Checkout is Shopify-hosted, which is
  why the bag has no shipping selector and its total equals its subtotal.
- **JNE, J&T and SiCepat are not native to Shopify** — they need a
  RajaOngkir/Biteship app, which quotes rates *during* checkout. Hence "Calculated
  at checkout".
- **Discount codes are validated at checkout and nowhere else**, so the bag's promo
  field carries the code there as `?discount=` rather than applying it in place.
- **Filter counts are computed against the filtered set.** Shopify exposes no
  whole-catalogue equivalent, so the React app's rule — counts from every product,
  because a count that shrinks as you narrow tells you nothing — could not be kept.
  It is the port's one genuine regression, and it is written into the snippet.

## Repo layout

```
theme/                 THE DELIVERABLE
  layout/              theme.liquid — the shell
  sections/            one per block; *-group.json for header and footer
  snippets/            primitives and composites
  templates/           JSON templates, one per route
  assets/              theme.css (built), theme.js, artwork
  config/ locales/     settings schema, interface chrome
theme-src/theme.css    stylesheet entry

app/tokens.css         DESIGN TOKENS — shared, live
app/base.css           base layer — shared, live

app/ components/ lib/  archived Next.js app — the port's reference
public/                original asset exports
.design-sync/          syncs .tsx to claude.ai/design; knows nothing about Liquid
```

## Commands

```bash
npm run theme:css          # build theme/assets/theme.css (minified)
npm run theme:css:watch    # rebuild on change
npm run theme:check        # shopify theme check
npm run theme:dev          # local preview
npm run theme:push         # build, check, push to theme 205197312286
```

The store and the theme id are pinned inside `theme:dev` and `theme:push`, so
neither can wander onto the live theme by accident.

`theme/assets/theme.css` is **committed** — Shopify has no build step, so the built
asset is what the store serves. Never hand-edit it.

The archived app's `npm run dev` and `npm run build` still work, and the build is
kept green, because `app/tokens.css` and `app/base.css` are shared: a regression
there is a regression in the theme.

## Working on this repo

Read [`CLAUDE.md`](./CLAUDE.md) first — it carries the conventions and the working
agreement, including the rule that a change is not done until it is on the store,
verified against the rendered HTML, and pushed to `main`.

Two things worth knowing before the first edit:

1. **`theme check` is not verification.** It proves the Liquid parses. It does not
   prove the page renders what you meant. Fetch the preview URL and count what comes
   back.
2. **Do not port changes backwards** into the archived React app to keep the two
   level. They are allowed to drift; record the divergence in the theme.
