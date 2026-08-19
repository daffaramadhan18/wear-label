@AGENTS.md

# CLAUDE.md

## Project

Company profile + product catalogue + commerce storefront for **Wear Label**, a
fashion/apparel brand in Bandung, Indonesia. Custom Next.js frontend on top of
Shopify as the commerce engine.

**Status: the storefront is built against fixtures.** Six routes, the design
system, the catalogue data and the bag all exist. What is missing is a Shopify
store and a handful of copy decisions — all listed
under [Still open](#still-open). Nothing in that list may be guessed at; ask.

## Architecture

```
Customer
   |
Next.js (App Router)  <- we build this
   |
Shopify Storefront API (GraphQL)   <- not written yet; fixtures stand in
   |
Shopify                <- configured in admin, not in code
   |-- products, variants, inventory
   |-- cart, orders, customers
   |-- checkout, payment, shipping, discounts
```

### Responsibility boundary

This repo is **presentation only**. No commerce logic lives here.

| In this repo | In Shopify admin |
|---|---|
| Pages, components, layout | Products, variants, pricing, stock |
| Navigation, filtering, sort, paging UI | Cart and order state |
| Company profile content | Checkout, payment gateway |
| Bag UI (state lives in Shopify) | Customer records |
| Design tokens, theming | Shipping rates, couriers |
| SEO, OG tags, analytics | Discounts, vouchers, marketing lists |

If a task appears to require writing cart, order, inventory, payment, shipping-rate
or discount logic, stop — it belongs in Shopify configuration instead. The
arithmetic that currently lives in `lib/shopify/cart.ts` is there **because it is
the part Shopify's `cart.cost` replaces**, and it is the only place it is allowed
to be.

## Stack

- **Next.js 16** (App Router) + TypeScript — Server Components by default
- **Shopify Storefront API** via public access token (Headless channel / custom app)
- **Shopify Cart API** — cart lives in Shopify; we persist only `cartId` in a cookie
- **Tailwind CSS v4** + CSS-variable design tokens
- **Motion** (`motion/react`) for reveals, the staggered grids and the route crossfade
- **Vercel** for deployment, GitHub for source

Do **not** reach for Hydrogen — it is Remix-based. With Next.js we call the
Storefront API directly. `@shopify/hydrogen-react` may be used for cart and
Money formatting helpers only.

## Routes

| Route | What it is |
|---|---|
| `/` | Home — hero carousel, new arrivals, customer voices, made-to-order band, Instagram strip. The design's limited-run band, category mosaic and service band are cut from the page; all three components and their copy remain, so restoring one is an edit to `app/page.tsx` alone |
| `/shop` | Catalogue — banner, promo bands, filter rail, sort, 3-up grid, paging |
| `/shop/[handle]` | Product — gallery, size + colourway, quantity, add to bag, tabs, related |
| `/cart` | Bag — lines, order summary, hand-off to Shopify checkout |
| `/about` | About Us — company profile (copy not written) |
| `/account` | My Account — route and layout only, no auth (see [Still open](#still-open)) |

Plus `app/not-found.tsx`. Every route renders dynamically, because the header reads
the bag cookie.

## Repo layout

```
app/                   Routes, root layout, tokens.css + globals.css
components/ui/         Primitives — button, badge, alert, media, price, copy,
                       section, container, breadcrumbs, icons, aurora,
                       save-button, notice-form
components/layout/     Announcement bar, header, cart badge, footer, wordmark
components/home/       Hero carousel, promo band, countdown, category mosaic,
                       service band, made-to-order, Instagram strip,
                       testimonial wall
components/shop/       Product card, catalogue filters, results toolbar,
                       pagination, shop promos, card hover
components/product/    Gallery, purchase block, tabs
components/cart/       Bag lines, order summary
components/motion/     Reveal, Stagger, page transition, motion tokens
lib/content/           Site copy — the single content module
lib/shopify/           The only place Shopify is touched
public/brand/          Logotype artwork — wordmark, stacked, monogram
public/products/       Catalogue photography — eleven square garment shots, real
public/home/           Hero artwork, exported from the design's image slots
.design-sync/          Config for syncing components to claude.ai/design
```

Commands: `npm run dev`, `npm run build`, `npm start`, `npm run lint`.

## Conventions

### Data

- **All Shopify access goes through `lib/shopify/`.** Components never call the
  Storefront API and never import GraphQL documents. `index.ts` is the barrel for
  catalogue reads; `cart.ts` is imported directly because it reads a cookie and is
  therefore server-only — routing it through the barrel would drag `next/headers`
  into any Client Component that just wanted `formatMoney`.
- **Fixtures until live.** `lib/shopify/fixtures.ts` returns typed mock data.
  Setting `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN` makes every
  read throw a clear "not implemented" error rather than silently serving mock data
  from a deployment configured to be real. Going live must be an env-var change,
  never a component change.
- **Never invent commerce data.** No fabricated shipping rates, review counts,
  stock numbers, countdowns or discount depths — not even as placeholder polish.
  Where a number cannot be known, the UI says where it comes from ("Calculated at
  checkout") or the block hides itself. This is why the design's star rating and
  its "Up to 40% off" tile are absent.
- **Quoting a customer is not inventing one.** The voices wall carries twenty real
  Shopee reviews, verbatim, in `home.voices.reviews`. That is why it is allowed
  where a star rating is not: it reproduces what customers wrote instead of
  synthesising a score. Never edit, tidy or translate one, and never add a review
  that did not come from the store.

### Copy

- **One content module: `lib/content/site.ts`.** Every non-product string lives
  there. Components never hardcode marketing copy.
- **An empty string is a valid state.** `components/ui/copy.tsx` renders a labelled,
  correctly-sized placeholder for any blank slot, so the layout is already final
  before the copy arrives. Filling the module in is the whole change.
- **Site language: English.** Single locale, no i18n layer. Amounts are written the
  way `lib/shopify/money.ts` formats them for Indonesia — `Rp 750.000`.
- **Quoted material keeps its own language.** The customer reviews are Indonesian
  and stay that way; translating a quotation turns it into a paraphrase. This is
  the only exception, and it applies to quotations, never to the site's own voice.

### Rendering

- **Server Components by default.** Add `"use client"` only for genuine
  interactivity. The thirteen client islands are: the header's mobile disclosure,
  the hero carousel, the countdown, the product gallery, the purchase block, the
  product tabs, the card hover, the save button, the notice form, and the four
  motion wrappers. Everything else is server-rendered — including every product
  card body, the whole filter rail, every row of the bag, and both marquees. The
  Instagram strip and the voices wall move on CSS animation alone, so neither
  costs a render or a byte of JavaScript; keep it that way.
- **The URL is the state.** Catalogue filters are *links* that flip one facet and
  preserve the rest (`catalogueHref` in `lib/shopify/catalogue.ts`); sort is a plain
  `GET` form. No client filtering, no state to keep in step with the URL, and the
  result is shareable and back-button friendly. Once the store is live the same
  query becomes Storefront API arguments.
- **Mutations are Server Functions in `lib/shopify/actions.ts`**, and they are the
  only thing that writes the bag cookie — a cookie cannot be set during render.
  They call `refresh()` from `next/cache`, not `revalidatePath`: the bag is request
  state behind a cookie, not a cached route.
- **Forms work without JavaScript.** The bag's quantity stepper is one form with two
  submit buttons carrying different values, and remove retargets that same form via
  `formAction`. Nested forms are illegal — do not "fix" this into a form per button.

### Design

- **One token file: `app/tokens.css`.** Every colour, font, radius, spacing, shadow
  and duration resolves to a variable there. `:root` holds brand primitives
  (`--wl-*`, never referenced from JSX); `@theme` holds the semantic tokens Tailwind
  turns into utilities. No component contains a hardcoded design value — the palette
  must be replaceable in one edit. Motion values are mirrored in
  `components/motion/tokens.ts` because Motion needs numbers, not `var()` strings;
  change one, change the other.
- **The page is white; cream is a band colour.** `body` resolves to
  `--color-surface`, matching the design's shell. Cream (`--color-canvas`) is what
  fills things *on* it — the made-to-order band, the hero panel, every chip, input,
  stepper and review card. Paint the shell cream and all of those flatten into it.
- **The aurora is two CSS classes, not a component's inline styles.** `.wl-aurora`
  in `globals.css` assembles the wash; the stop lists are `--wl-aurora-stops` and
  `--wl-aurora-stops-invert` in `tokens.css`, so it recolours with the palette.
  `components/ui/aurora.tsx` only picks a tone, an origin and an intensity. The
  veil layer MUST be painted in the colour of the surface underneath — a mismatch
  shows up as a visible rectangle, and that is the bug this effect always has.
- **Accessibility is part of the design, not a pass afterwards.** Single `h1` per
  page with no skipped levels, 44px minimum control height, visible focus never
  removed, sticky-header scroll padding, and **colour never carries meaning alone** —
  sold out says "Sold out", an applied filter link carries `aria-current`, a toggle
  carries `aria-pressed`. Four contrast pairs fall short of AA; they are
  implemented as specified and annotated at the top of `tokens.css`.
- **Motion has a readable resting state.** `prefers-reduced-motion` does not merely
  pause a marquee — it has to leave the content reachable. The Instagram strip keeps
  a (scrollbar-less) scrollable rail; the voices wall drops its tilt, its offsets and
  its duplicate copies and becomes a plain grid, because a frozen tilted wall holds
  most of its reviews outside a stage that clips at 560px.
- **Checkout is a redirect.** Hand off to `cart.checkoutUrl`. Do not build a custom
  checkout UI (see Platform constraints).
- **Components sync to claude.ai/design.** The `SURFACE` map in
  `.design-sync/setup-pkg.mjs` is the only list of what syncs; adding a file to
  `components/` does not add it. Read `.design-sync/NOTES.md` before re-running the
  sync. **The sync is currently behind the app** — the components added for this
  storefront are not in `SURFACE` and have no previews.

## Design sources

Two files in Claude Design project
[`bf11a0f4-4b1c-400b-802c-b9c9c2d66673`](https://claude.ai/design/p/bf11a0f4-4b1c-400b-802c-b9c9c2d66673),
both derived from the client's `BRAND GUIDELINE.pdf` and `Katalog Baju` upload:

- **`Wear Label Design System.html`** — the authority for colour, type, radius,
  spacing, shadow, motion and component behaviour. Ported into `app/tokens.css`.
- **`Wear Label Storefront.dc.html`** — the four approved screens. Ported into the
  routes and components above; its copy is in `lib/content/site.ts` and its
  catalogue is in `lib/shopify/fixtures.ts`.

Its `handoff/` folder holds developer copies of two components — the aurora band and
the voices wall. Both are ported, not dropped in: the repo has no `cn()`, no
`tailwind.config.js` (Tailwind v4 keeps theme in `tokens.css`) and no appetite for a
second marquee primitive. Read the two READMEs there for the reasoning behind the
measured values before changing any of them.

**Binary assets and the 256 KiB read cap.** `read_file` refuses binaries outright and
truncates text at 256 KiB, and `.image-slots.state.json` is a single 521 KiB line —
so the hero artwork cannot be fetched that way. `render_preview` serves the project
over HTTP and relative subresources resolve against it, which is how
`public/home/hero-{1,2}.webp` were pulled byte-exact. The design maps slots by
position (`slotId: 'sf-hero-' + (i + 1)`); an unused `sf-hero` from an earlier
single-slide version is also in that file and is not one of them. **The two hero
files are named for the slide they sit on, and that order is the reverse of the
design's** — the design leads with the order-notes card, this build leads with the
photograph, so `hero-1.webp` is `sf-hero-2` and `hero-2.webp` is `sf-hero-1`.

The published design system that this repo's components sync *to* is a separate
project, [`096a4d56-a7d8-49ce-9d7a-4fe26ac82b54`](https://claude.ai/design/p/096a4d56-a7d8-49ce-9d7a-4fe26ac82b54).

When the design and one of these conventions disagree, say so and ask — do not
silently pick either side. The deviations already taken are recorded in the
component that took them, at the top of the file.

## Platform constraints

Fixed properties of Shopify in this market — design around them, don't retry them:

- **Shopify Payments is unavailable in Indonesia.** A third-party gateway is
  required, and Shopify adds a transaction fee on top of the gateway fee when
  Shopify Payments is not used.
- **A fully custom checkout UI requires Shopify Plus.** On lower plans checkout is
  Shopify-hosted. This is why the bag has no shipping selector and no address
  fields, and why its total equals its subtotal.
- **Indonesian couriers (JNE, J&T, SiCepat) are not native to Shopify** — they
  require a RajaOngkir/Biteship app, which quotes rates *during* checkout. The bag
  therefore says "Calculated at checkout" rather than showing a rate it cannot know.
- **Discount codes are validated by Shopify**, so the bag's promo field submits and
  reports that it is not connected yet instead of pretending to apply anything.

## Still open

Not decided, and not to be filled in by guessing:

| Open | What the code does meanwhile |
|---|---|
| Whether customer accounts exist, or guest checkout is enough | `/account` reserves the route with no auth; "Save for later" is `localStorage` only, in `components/ui/save-button.tsx` |
| Which payment gateway, or whether checkout is real at all | `cart.checkoutUrl` is null; the checkout action is disabled with the reason beside it |
| Shop-banner photography | Declared as an `Image` object with a null url → placeholder. The hero is no longer open: both slides are in `public/home/`, from the design's own slots |
| Per-product Details and Fabric & care copy | `description` and `care` are `""` in fixtures → placeholders. The design reused one generic paragraph for all eleven pieces; it would state a wrong inseam and a wrong fabric on most of them |
| About Us, My Account and 404 copy | `""` in `lib/content/site.ts` → placeholders |
| Whether there is a limited run, and when it ends | Moot while the band is off the home page. `home.promo.endsAt` is `""`, so the countdown hides wherever the band is placed. Both components are real |
| Social handles | `footer.socials` is empty, so no dead buttons render |
| The unbuilt footer destinations (The studio, Journal, FAQ, Order tracking, Wishlist, Contact us, Returns & refunds, Size guide, Terms) | Entries with no `href` render as plain text, never as a 404 link. Add the href when the page exists |
| Which pieces are made to order | The catalogue does not say. No product carries the `Made to order` tag in `lib/shopify/fixtures.ts`, so that facet counts zero rather than guessing; the filter row is built and waits for the list, as does the mosaic tile in the (currently unplaced) mosaic |
| Product categories | Shopify product types do not exist yet. `productType` is derived from each piece's name, or from its garment shot where the name is silent — Wide leg 8, Culottes 2, Straight cut 1 |
| A review system | The design's star rating is still deliberately absent — a fabricated score is the one placeholder that cannot be labelled as one. Real quotations are a separate matter and are live in the voices wall; there is no feed behind them, so new reviews mean editing `home.voices.reviews` |
| Whether the studio ships from Bandung or Bekasi | The hero's order-notes card says "Pengiriman dari Kota Bekasi"; `lib/content/site.ts` says the studio is in Bandung. Both are live on the home page. Nothing in the code picks a side |
| Search | The design's search mark is absent; there is no search |
| Site domain for canonical URLs and OG | `NEXT_PUBLIC_SITE_URL`, falling back to localhost |

Brand identity, palette, typography and tone are **no longer open** — the design
system settled them, and `app/tokens.css` plus `lib/content/site.ts` are where they
live. Changing them is a design-system decision, not a code decision.
