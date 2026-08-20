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

**Done — the shell and all six routes.**

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

**Not done, and it is store configuration rather than code:**

| Blocked on | What the theme does meanwhile |
|---|---|
| No photography on the 115 Shopee pieces | Their cards draw the `media` placeholder at the real card proportions; the eleven design pieces carry their shots. Nothing in a grid is a placeholder *card* any more — 126 products are on the store. |
| Filters not defined in Search and Discovery | The rail says where they are configured instead of inventing facet values. |
| No `about` page in Shopify | `/pages/about` 404s. Creating the page in Content → Pages is the whole fix; `main-page` is written and waiting. |
| `custom.material` and `custom.care` metafields | Product cards and the Fabric & care tab show labelled placeholders. |

`sections/main-stub.liquid` still backs the templates the design never covered —
blog, article, search, list-collections, gift card, customer pages.

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

hero → new arrivals → customer voices → service band → Instagram strip

The wall was moved ahead of the arrivals grid on 2026-08-20 and moved back on
2026-08-21, on the client's call. The reasoning for moving it — the reviews are
the strongest thing the page has — did not survive contact with the rendered
page: the catalogue has since been imported, so the arrivals grid is photography
rather than 3,760px of placeholder, and leading with the wall no longer buys what
it was meant to buy.

Three blocks exist and are deliberately **not** placed:

| Block | Why it is off the page | May it go back? |
|---|---|---|
| `category-mosaic` | Removed on request, 2026-08-20 | Yes — it has a preset, so it goes back from the theme editor. Keep it **above** the service band: the blocks below the voices wall exist to keep the wall and the Instagram strip out of one viewport. |
| Limited-run band | Cut from the design's sequence | Yes, once there is a real run and an end date. A countdown that is really a fixed string is worse than no countdown. |
| Made to order | The studio does not offer the service (confirmed 2026-08-20, PRODUCT.md) | **No.** Every line of it is a promise nobody can keep. |

This makes the theme's home page a **divergence from `app/page.tsx`**, which
still renders the mosaic. The theme is the deliverable and the React app is the
reference it was ported from, so the two are allowed to drift — the point is that
the drift is written down.
