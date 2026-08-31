# Wear Label — Shopify theme

The storefront, rebuilt as a Liquid theme. This directory is the deliverable; the
Next.js app at the repo root is the reference it is ported from and will be
retired once the port lands.

## Why a theme and not the headless app

`CLAUDE.md` states the rule the headless build was already working to:

> This repo is **presentation only**. No commerce logic lives here.

If there is no commerce logic, headless is paying for control that is not being
used. The theme gets that control back for free and deletes the code that was
imitating it:

| Deleted from `lib/shopify/` | Lines | Replaced by |
|---|---|---|
| `cart.ts` + `actions.ts` | 343 | native cart form POST to `/cart/add`, `/cart/change` |
| `catalogue.ts` | 241 | `collection.filters`, `sort_by`, `paginate` |
| `fixtures.ts` | 121 | the store |
| `types.ts` | 79 | — |
| `money.ts` | 39 | `{{ price \| money }}` |
| `env.ts` | 26 | no live/fixture gate to keep |

The two conventions that made the React app portable were already Shopify's own
model, which is why the port is a rewrite of markup rather than of behaviour:

- **"The URL is the state"** — filters are links that flip one facet and preserve
  the rest. That is exactly `?filter.v.option.size=M&sort_by=price-ascending`.
- **"Forms work without JavaScript"** — that is how a Liquid cart form works.

Three platform facts also point the same way: checkout is Shopify-hosted either
way (no Plus), Indonesian couriers need an app that quotes during checkout, and
the client can write their own copy in the theme editor instead of waiting on an
edit to `lib/content/site.ts`.

## What is shared, not copied

`theme-src/theme.css` imports `../app/tokens.css` and `../app/base.css` — the
same two files the Next.js app uses. They are not duplicated, because 720 lines
of design system maintained twice is 720 lines that will drift. `app/globals.css`
is now a three-line entry over the same pair.

Everything else in `theme-src/theme.css` is theme-only: rules that exist because
Liquid has no React (the disclosure's icon swap was a ternary in JSX; the reveal
was a Motion variant).

## Build

```bash
npm run theme:css          # build assets/theme.css (minified)
npm run theme:css:watch    # rebuild on change
npm run theme:check        # shopify theme check — runs offline, no store needed
npm run theme:dev          # build CSS, then shopify theme dev
npm run theme:push         # build, check, then push
```

`assets/theme.css` is committed. Shopify has no build step, so the built asset is
the artifact the store serves; read `theme-src/theme.css`, `app/tokens.css` and
`app/base.css` for the source.

## Port status

**Done — the shell, all six ported routes, and four more the brief added.**

| File | From |
|---|---|
| `layout/theme.liquid` | `app/layout.tsx` |
| `sections/announcement-bar.liquid` | `components/layout/announcement-bar.tsx` |
| `sections/header.liquid` | `components/layout/site-header.tsx` |
| `sections/footer.liquid` | `components/layout/site-footer.tsx` |
| `snippets/wordmark.liquid` | `components/layout/wordmark.tsx` |
| `snippets/cart-badge.liquid` | `components/layout/cart-badge.tsx` |
| `snippets/copy.liquid` | `components/ui/copy.tsx` |
| `snippets/aurora.liquid` | `components/ui/aurora.tsx` |
| `snippets/icon.liquid` | `components/ui/icons.tsx` — four of the marks so far |
| `assets/theme.js` | `components/motion/{reveal,stagger}.tsx`, the header disclosure, the carousel, the gallery, the tabs, the stepper, the save button |
| `sections/hero-carousel.liquid` | `components/home/hero-carousel.tsx` |
| `sections/new-arrivals.liquid` | the arrivals block in `app/page.tsx` |
| `sections/voices-wall.liquid` | `components/home/testimonial-wall.tsx` |
| `sections/category-mosaic.liquid` | `components/home/category-mosaic.tsx` |
| `sections/service-band.liquid` | `components/home/service-band.tsx` |
| `sections/instagram-strip.liquid` | `components/home/instagram-strip.tsx` |
| `sections/main-collection.liquid` | `app/shop/page.tsx` |
| `sections/main-product.liquid` | `app/shop/[handle]/page.tsx` |
| `sections/main-cart.liquid` | `app/cart/page.tsx` |
| `sections/main-page.liquid` | `app/about/page.tsx` |
| `sections/main-404.liquid` | `app/not-found.tsx` |
| `snippets/product-card.liquid` | `components/shop/product-card.tsx` + `card-hover.tsx` |
| `snippets/catalogue-filters.liquid` | `components/shop/catalogue-filters.tsx` |
| `snippets/results-toolbar.liquid` | `components/shop/results-toolbar.tsx` |
| `snippets/pagination.liquid` | `components/shop/pagination.tsx` |
| `snippets/product-gallery.liquid` | `components/product/product-gallery.tsx` |
| `snippets/product-purchase.liquid` | `components/product/product-purchase.tsx` |
| `snippets/product-tabs.liquid` | `components/product/product-tabs.tsx` |
| `snippets/cart-lines.liquid` | `components/cart/cart-lines.tsx` |
| `snippets/order-summary.liquid` | `components/cart/order-summary.tsx` |
| `snippets/media.liquid`, `price`, `badge`, `alert`, `breadcrumbs`, `save-button` | the matching `components/ui/*` |

**From `BRIEF.pdf`, not from the React app.** These have no port source — the
archived app never had a B2B route, a search page, a collections index or a contact
page, so nothing about them is a translation of anything:

| File | Brief | What it is |
|---|---|---|
| `snippets/button.liquid` | — | The site's one button, four variants. Extracted because the primary button's class string had already been retyped in three sections and the B2B pages needed it in eight more. |
| `sections/custom-band.liquid` | §7 | The B2B hook on the home page: headline, three service names, two CTAs, one photograph. Cream rather than espresso — the voices wall directly below is already espresso. |
| `sections/custom-hero.liquid` | §9.1 | The B2B page hero. The one hero on the site that draws no placeholder when it has no photograph: an espresso aurora band is already a finished surface. |
| `sections/custom-services.liquid` | §9.2 | Three services, one 4:5 photograph each. No icons — the photograph is the mark. |
| `sections/how-it-works.liquid` | §9.4 | Five numbered steps. The number is derived from block order, never typed in, so inserting a step renumbers the row. |
| `sections/why-wear-label.liquid` | §9.5 | Four capability claims, cream cards on white. Capability, not scale — the brief forbids "trusted by hundreds of companies". |
| `sections/quote-form.liquid` | §9.6, §16 | Three fields composed into a WhatsApp deep link. A real `<form method="get">`, so it works with script off — the chat just opens empty. |
| `sections/contact-details.liquid` | §5 | Placeholder detail rows plus Shopify's own `contact` form. The one form on the site that posts. |
| `sections/main-search.liquid` | §5 | Search, products only. A page rather than a header overlay. Replaced `main-stub`. |
| `sections/main-list-collections.liquid` | §5 | `/collections`, the catalogue by category. Replaced `main-stub`. Every link carries `?filter.v.availability=1`. |

Three existing files changed for the brief as well: the hero gained a second CTA per
slide (§6), `product-purchase` gained `Buy now` and `Buy on Shopee` (§11 and the
client's own note), and `product-tabs` gained a **Size & fit** panel (§11) which sits
*second*, ahead of Fabric & care, because fit is the purchase decision.

**Not done, and it is store configuration rather than code:**

| Blocked on | What the theme does meanwhile |
|---|---|
| No photography on the 115 Shopee pieces | Their cards draw the `media` placeholder at the real card proportions; the eleven design pieces carry their shots. Nothing in a grid is a placeholder *card* any more — 126 products are on the store. |
| Only the Availability facet exists | The rail renders it, and the Shop nav, the hero CTA and New arrivals' "View all" all point at `?filter.v.availability=1` so the catalogue opens on what can actually be bought. Product type, size and colourway are still undefined; the rail says where they are configured instead of inventing facet values. |
| **Three Shopify pages do not exist** — `about`, `custom`, `contact` | All three 404. Creating them in Content → Pages is the whole fix, and `custom` and `contact` need their template suffix set (`page.custom`, `page.contact`). The nav, the hero's second CTA, the home page's custom band and the footer already point at them. |
| **Five metafield definitions** — `custom.material`, `care`, `size_chart`, `fit`, `shopee_url` | Product cards, the Fabric & care tab and the Size & fit tab show labelled placeholders; "Buy on Shopee" does not render at all. |
| **No WhatsApp number** in Theme settings → Custom & business | `quote-form` renders at full size with a **disabled** submit and an alert saying the number is not set. This is the whole B2B conversion path. |
| **No category collections** | `/collections` renders its own "no collections yet" notice, and `category-mosaic` stays off the home page — every tile has to point at something that matches. |
| **No B2B photography** | `custom-band` and all three `custom-services` cards draw labelled placeholders at final size. By instruction, 2026-08-31. |
| **No contact details** | Email, studio address and opening hours are blank blocks rendering labelled placeholders. By instruction, 2026-08-31. |

`sections/main-stub.liquid` still backs the templates the design never covered —
blog, article, gift card, customer pages. `search` and `list-collections` no longer
use it: both got real sections when the brief asked for them.

## Copy

Split deliberately, and it is the split that unblocks the client:

- **`locales/en.default.json`** — interface chrome (`ui.*` in the React app).
  Not brand copy, and translatable.
- **Theme and section settings** — everything the brand actually says. The client
  edits it in the theme editor rather than waiting on a code change, which is the
  whole reason "copy is unwritten" stops being a blocker.

Three strings from `lib/content/site.ts` are deliberately **gone**:
`newsletterUnavailable`, `discountUnavailable` and `checkoutUnavailable`. All
three said "not connected yet". Shopify connects all three, so the notices would
now be false.

## Rules that carry over unchanged

Everything under **Conventions → Design** and **Performance** in `CLAUDE.md`
still applies — the aurora's veil must match its surface, `isolate` is required
on an aurora band, a continuous loop animates `transform` or `opacity` and
nothing else, and never wrap a blended layer in something that animates opacity.
The CSS is the same CSS; the bugs it can have are the same bugs.

## Deviations from the React app, all deliberate

Three are improvements the platform hands over:

- **The variant picker works without JavaScript.** React held the selection in
  `useState`; each option value is now a link to `?variant=<id>`, the same "URL is
  the state" rule the catalogue filters follow. A chosen variant is shareable and
  the back button undoes one choice.
- **The product card is fully server-rendered.** Its hover scale was a Motion
  client component because the card is one stretched link and pointer and keyboard
  land on different elements. `group-hover` plus `group-focus-within` covers both
  in CSS.
- **Checkout, the newsletter and discount codes are real**, so the three "not
  connected yet" strings are deleted rather than kept. Keeping them would ship a
  false statement.

Three more were taken on 2026-08-20, when the storefront was worked over for feel:

- **The arrivals grid is two-up on a phone**, where `app/page.tsx:115` is one-up.
  The card's own comment (`snippets/product-card.liquid`) says the name drops a
  rung to `--text-h3` because "the column is about 155px wide" — so the card's type
  step was already tuned for a two-up column and was mis-tuned for the layout it
  sat in. `sections/main-product.liquid`'s related grid moved with it, so the card
  now renders at consistent sizes on all three routes.
- **The hero carousel can be dragged.** That overrides part of the argument
  written at the top of `sections/hero-carousel.liquid`, which is updated in place
  rather than left contradicting the code.
- **The voices wall stays on the white page, not on an espresso band.** Putting
  it on the brand's darkest colourway was tried on 2026-08-21 and rejected by the
  client: the cards are cream and they are meant to float on white, and the four
  stage fades — which exist to soften where the tilted plane is clipped — read as
  dirty grey when they are painted in espresso over a cream card. The fades are
  back to `from-surface` at their measured 42%/30% spreads. Do not re-tone this
  band without re-tuning those four gradients, and do not re-tune them without
  looking at the result.
- **The fit record is not a section.** Lifting the customers' stated
  measurements out of the moving wall was tried twice on 2026-08-21 — first as
  seven display-size figures, then as a body/size table — and both were rejected.
  The measurements stay where the customers wrote them, inside the reviews. The
  seven verified values are in this file's git history at a335f65 if anyone wants
  them again.
- **View transitions are on, but the root cross-fade is off.**
  `::view-transition-new(root)` animates opacity across the root, which would
  transiently flatten the footer aurora's `soft-light` and the voices wall's
  `preserve-3d` — the two effects CLAUDE.md warns about by name. There is no
  browser in the build environment, so rather than ship a full-page fade nobody
  has watched, only the named product-shot morph runs. Turning the root fade back
  on is one line, once somebody has looked at it on a device.

One is a genuine regression, and it is not hidden:

- **Facet counts are computed against the filtered set, not the whole catalogue.**
  The React app used whole-catalogue counts on purpose — "a count that changes as
  you narrow tells you nothing about what the filter would do". Shopify's
  `value.count` has no whole-catalogue equivalent, so that rule cannot be kept.

One closes a Still-open item by itself:

- **The "Made to order" filter row is gone.** In React it was an availability row
  that counted zero, kept only because removing it meant touching `QUERY_KEYS`.
  Shopify has no such filter unless somebody creates one.

One changes behaviour the design drew:

- **The bag's promo field moves you to checkout.** Shopify validates discount
  codes at checkout and nowhere else, so the field rides along as `?discount=`
  rather than applying in place. The note beside it says so.

## Home page sequence

hero → new arrivals → **Wear Label Custom** → customer voices → service band →
Instagram strip

The custom band went in on 2026-08-31, directly after the product section, because
brief §7 puts it there — and because the hero's second CTA has to land somewhere on
the same page for a reader who scrolls rather than clicking.

The wall was moved ahead of the arrivals grid on 2026-08-20 and moved back on
2026-08-21, on the client's call. The reasoning for moving it — the reviews are
the strongest thing the page has — did not survive contact with the rendered
page: the catalogue has since been imported, so the arrivals grid is photography
rather than 3,760px of placeholder, and leading with the wall no longer buys what
it was meant to buy.

**One block exists and is deliberately not placed:**

| Block | Why it is off the page | May it go back? |
|---|---|---|
| `category-mosaic` | Removed on request 2026-08-20 — **and brief §6 Section 3 now asks for it back as "Shop by Category"**. It stays out until the category collections exist on the store: `/collections/pants` is a 404 today, and `?filter.p.product_type=Pants` silently returns the whole catalogue because that facet is not defined. A tile that looks like it filtered and did not is worse than a 404. | Yes, and it is expected to — the moment the collections exist. It has a preset, so it goes back from the theme editor. Keep it **above** the service band: the blocks below the voices wall exist to keep the wall and the Instagram strip out of one viewport. Change its labels and its links in the same edit — the preset still carries the *cut* vocabulary (Culottes, Straight cut) and the brief wants the *garment* one (Pants, Tops, Outerwear). |

**The limited-run band, the countdown and the made-to-order section are no longer in
this repo** — checked 2026-08-31. Earlier versions of this table and of CLAUDE.md
said they were kept and unplaced; there are no such files in `sections/`. The
made-to-order *rule* still stands: the studio does not offer per-shopper made-to-order
(2026-08-20, PRODUCT.md) and nothing may promise it.

**The brief's B2B custom apparel does not reopen that.** Made-to-order was one
garment cut for one shopper. Custom apparel production is a bulk run for an
organisation, it is a real service, and it is what `/pages/custom` is for.

**Selected Projects (brief §8, §9.3) is deliberately not built.** The brief wants a
portfolio and explicitly forbids inflating it; there are no project photographs and
no nameable clients, so there is no section rather than an empty one. Decided
2026-08-31.

This makes the theme's home page a **divergence from `app/page.tsx`**, which
still renders the mosaic. The theme is the deliverable and the React app is the
reference it was ported from, so the two are allowed to drift — the point is that
the drift is written down.
