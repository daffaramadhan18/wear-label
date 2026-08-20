@AGENTS.md

# CLAUDE.md

## Project

Company profile + product catalogue + commerce storefront for **Wear Label**, a
fashion/apparel brand in Bandung, Indonesia.

**The deliverable is a Shopify theme, in [`theme/`](./theme/README.md).** Work
happens there and in the Shopify admin. The Next.js app at the repo root is the
reference the theme was ported from — see [The Next.js app is an
archive](#the-nextjs-app-is-an-archive) before touching it.

**Who this is for and what it is for: [`PRODUCT.md`](./PRODUCT.md).** The primary
buyer, what she decides on, and the fact that this site is a credibility surface
rather than the till are recorded there, with the customer evidence behind each one.
Read it before proposing anything that changes what the site claims.

**Status: the store exists and the theme is on it, unpublished.** All six routes are
ported. What is missing is store *configuration*, not code — and every one of those
gaps renders a labelled placeholder at final size rather than breaking, so the theme
is reviewable now:

1. **No products.** The eleven pieces below are not imported yet, so every grid
   draws placeholder cards at the real card proportions.
2. **No filters.** They are defined in Shopify's Search and Discovery app; until
   then the filter rail says where they come from instead of inventing facets.
3. **No `about` page**, and no `custom.material` / `custom.care` metafields.
4. **Copy.** Brand voice is unsettled. Blank theme settings render a labelled
   placeholder, so filling them in is the whole change.
5. **The decisions under [Still open](#still-open).** Nothing in that list may be
   guessed at; ask.

Everything else — palette, type, layout, motion, accessibility, the catalogue
itself — is settled and sourced. If you are about to invent a price, a stock
number, a review, a category or a shipping rate, stop: that is the one class of
change this repo refuses.

## The store

| | |
|---|---|
| Store | `kbysza-bk.myshopify.com` |
| Shop ID | `gid://shopify/Shop/108822364446` |
| Admin | https://admin.shopify.com/store/kbysza-bk |
| Theme | `205197312286` — "Wear Label", role `unpublished` |
| Preview | https://kbysza-bk.myshopify.com?preview_theme_id=205197312286 |
| Editor | https://kbysza-bk.myshopify.com/admin/themes/205197312286/editor |

The storefront is password-protected, as new stores are. `theme push` does **not**
need that password; `theme dev` does, and it is in Online Store → Preferences. It is
not written down here and must not be committed.

**Never push to the live theme.** Push to `205197312286` by id. Publishing is a
decision, not a step.

Some Admin API work still needs `shopify store auth --store kbysza-bk.myshopify.com`
run interactively — importing the catalogue, for one. `shopify auth login` alone is
enough for theme commands.

## Working agreement

**Finish the job, then land it.** When you are asked to change something, do the
work, get it onto the store, and get it into `origin/main` in the same turn. Do not
stop to ask whether to commit or push, and do not leave the change sitting in the
working tree.

The pipeline, in order:

```bash
# 1. verify first — a broken commit is worse than an unfinished one
npm run theme:css                    # rebuild assets/theme.css
npm run theme:check                  # shopify theme check; runs offline
npx tsc --noEmit && npx eslint app components lib theme

# 2. land it on the store — the script pins the store and theme id, never --live
npm run theme:push

# 3. verify against what the store actually rendered, not against intent
#    (curl the preview URL and grep for the markers you changed)

# 4. stage exactly what you changed, never `git add -A` blind
git add <the files you touched>

# 5. commit straight onto main — no feature branch
git commit          # message: what changed and WHY, in the imperative

# 6. push, then keep the graph current
git push origin main
graphify update .
```

**Step 3 is not optional.** `theme check` proves the Liquid parses; it does not
prove the page renders what you meant. Every claim about this theme's output in
git history was checked by fetching the rendered HTML and counting what came back.
Keep doing that.

The end state after every task, without being asked:

- **No branches.** `git branch` shows `main` and nothing else. Do not create a
  working branch and do not leave one behind. A branch checked out in another
  worktree belongs to another session — leave it alone and say so.
- **No uncommitted changes.** `git status` is clean, apart from files that are
  deliberately untracked.
- **Nothing unpushed.** `git status -sb` shows no `ahead` marker.

Two things this does **not** license: committing work you have not verified, and
sweeping unrelated staged files into your commit. Stage by path — a previous session
may have left something staged that is not yours to land.

Commit messages carry the reasoning, not just the change. Anything decided,
derived or deliberately not done belongs in the message; the next person's first
question is always "why is it like this".

## Architecture

```
Customer
   |
Shopify (Liquid theme)   <- we build this, in theme/
   |-- sections, snippets, templates, settings
   |
Shopify                  <- configured in admin, not in code
   |-- products, variants, inventory, metafields
   |-- cart, orders, customers
   |-- checkout, payment, shipping, discounts
   |-- storefront filters (Search and Discovery)
```

There is no API client, because there is no API call. Liquid reads Shopify's own
objects. That is what the port deleted: `lib/shopify/` was ~850 lines standing in
for `collection.filters`, `cart.items`, `paginate` and the `money` filter.

### Responsibility boundary

The theme is **presentation only**. No commerce logic lives here.

| In the theme | In Shopify admin |
|---|---|
| Sections, snippets, templates, layout | Products, variants, pricing, stock, metafields |
| Which blocks are on a page, and in what order | Cart and order state |
| Design tokens, theming, the stylesheet | Checkout, payment gateway |
| Copy, via theme and section settings | Shipping rates, couriers |
| Storefront filter *markup* | Which filters exist (Search and Discovery) |
| SEO markup, OG tags | Discounts, vouchers, marketing lists |

If a task appears to require writing cart, order, inventory, payment, shipping-rate
or discount logic, stop — it belongs in Shopify configuration instead.

## Stack

- **Shopify Online Store 2.0** — JSON templates, sections, section groups, blocks
- **Liquid**, server-rendered. No framework, no build step on Shopify's side
- **Tailwind CSS v4**, precompiled to `theme/assets/theme.css`
- **CSS-variable design tokens** in `app/tokens.css`, shared with the archived app
- **Vanilla JS** in `theme/assets/theme.js` — seven behaviours (the header
  disclosure, the scroll reveals, the carousel, the gallery, the tabs, the quantity
  stepper, save-for-later), all progressive enhancement
- **Shopify CLI 4.x**, pinned as a devDependency so the scripts resolve it from
  `node_modules/.bin` — a bare `shopify` is not on `PATH` here

Do **not** add a JavaScript framework, a bundler, or a second CSS pipeline. Do not
reach for Hydrogen — it is Remix-based and this is a theme.

## Routes

Shopify route names, and what the React app called them:

| Route | Was | What it is |
|---|---|---|
| `/` | `/` | Home — hero carousel, new arrivals, customer voices, service band, Instagram strip |
| `/collections/all` | `/shop` | Catalogue — filter rail, sort, 3-up grid, paging |
| `/products/<handle>` | `/shop/[handle]` | Product — gallery, size + colourway, quantity, add to bag, tabs, related |
| `/cart` | `/cart` | Bag — lines, order summary, hand-off to Shopify checkout |
| `/pages/about` | `/about` | About Us — the Shopify page's own title and content |
| `/account` | `/account` | Shopify's customer routes — still `main-stub`, not designed |
| 404 | `app/not-found.tsx` | `sections/main-404.liquid` |

Filter and sort URLs are Shopify's: `?filter.p.product_type=Wide+leg`,
`?filter.v.option.size=M`, `?sort_by=created-descending`, `?page=2`. That is the URL
contract now, and it replaces `QUERY_KEYS` entirely.

Templates the design never covered — blog, article, search, list-collections, gift
card and all seven `customers/*` — render `sections/main-stub.liquid`, a labelled
placeholder.
Delete the stub from a template the moment that template's real section lands.

## Repo layout

```
theme/                 THE DELIVERABLE
  layout/              theme.liquid — the shell
  sections/            one per block; *-group.json for header and footer
  snippets/            primitives and composites
  templates/           JSON templates, one per route
  assets/              theme.css (built), theme.js, artwork
  config/              settings_schema.json
  locales/             en.default.json — interface chrome
  README.md            port status, deviations, build
theme-src/theme.css    stylesheet entry; imports app/tokens.css + app/base.css

app/tokens.css         DESIGN TOKENS — single source of truth, shared
app/base.css           base layer — shared

app/                   archived Next.js routes
components/            archived React components — the port's reference
lib/                   archived data layer and content module
public/                original asset exports
.design-sync/          config for syncing components to claude.ai/design
```

## Commands

```bash
npm run theme:css          # build theme/assets/theme.css (minified)
npm run theme:css:watch    # rebuild on change
npm run theme:check        # shopify theme check — offline, no store needed
npm run theme:dev          # build CSS, then shopify theme dev
npm run theme:push         # build, check, push to theme 205197312286
```

The store and the theme id are pinned inside `theme:dev` and `theme:push`, so
neither can wander onto the live theme by accident. `theme dev` will still ask for
the storefront password once.

`theme/assets/theme.css` is **committed**. Shopify has no build step, so the built
asset is what the store serves. Read `theme-src/theme.css`, `app/tokens.css` and
`app/base.css` for the source — never hand-edit the built file.

Archived-app commands (`npm run dev`, `npm run build`) still work and the build is
still kept green, because `app/tokens.css` and `app/base.css` are shared and a
regression there is a regression in the theme.

Nothing is read from the environment any more. The three `SHOPIFY_*` /
`NEXT_PUBLIC_SITE_URL` variables only ever fed the archived app.

## The theme

| File | Ported from |
|---|---|
| `layout/theme.liquid` | `app/layout.tsx` |
| `sections/announcement-bar` · `header` · `footer` | `components/layout/*` |
| `sections/hero-carousel` | `components/home/hero-carousel.tsx` |
| `sections/new-arrivals` | the arrivals block in `app/page.tsx` |
| `sections/voices-wall` | `components/home/testimonial-wall.tsx` |
| `sections/service-band` | `components/home/service-band.tsx` |
| `sections/instagram-strip` | `components/home/instagram-strip.tsx` |
| `sections/category-mosaic` | `components/home/category-mosaic.tsx` — **unplaced** |
| `sections/main-collection` · `main-product` · `main-cart` · `main-page` · `main-404` | the matching routes |
| `snippets/product-card` | `components/shop/product-card.tsx` + `card-hover.tsx` |
| `snippets/catalogue-filters` · `results-toolbar` · `pagination` | `components/shop/*` |
| `snippets/product-gallery` · `product-purchase` · `product-tabs` | `components/product/*` |
| `snippets/cart-lines` · `order-summary` | `components/cart/*` |
| `snippets/copy` · `media` · `price` · `badge` · `alert` · `aurora` · `icon` · `wordmark` · `breadcrumbs` · `save-button` · `cart-badge` | `components/ui/*` |
| `assets/theme.js` | the header disclosure, the reveals, the carousel, the gallery, the tabs, the stepper, the save button |

Two of those are **generated from the React source, not retyped**, and must stay
that way: `snippets/icon.liquid` (all twelve paths verified byte-exact against
`components/ui/icons.tsx`) and the twenty reviews in `sections/voices-wall.liquid`
(asserted verbatim against `lib/content/site.ts`).

**Home page sequence:** hero → new arrivals → customer voices → service band →
Instagram strip. Three blocks exist and are deliberately not placed — the mosaic
(removed on request), the limited-run band (cut), and made-to-order (**never** to be
placed; the studio does not offer the service). `theme/README.md` has the table.

## The catalogue

Eleven pieces, from the design project's `CATALOG` constant. Names, materials,
prices, the markdowns and the new flags are the client's own data; the photographs
are the client's own shots, one square `.webp` per piece in `public/products/`, named
by handle. **None of this is in Shopify yet** — importing it is the next big step.

| Handle | Name | Material | Price | Was | Flags | Category |
|---|---|---|---|---|---|---|
| `basic-linen-cullote` | Basic Linen Culotte | Handwoven linen | Rp 165.000 | | | Culottes |
| `casual-culotte-zipper` | Casual Culotte Zipper | Washed linen | Rp 165.000 | | | Culottes |
| `basic-pants` | Basic Pants | Cotton poplin | Rp 165.000 | | | Straight cut |
| `cerra-loose-pants` | Cerra Loose Pants | Cotton twill | Rp 159.000 | | | Wide leg |
| `dalia-wide-pants` | Dalia Wide Pants | Tencel | Rp 175.000 | | | Wide leg |
| `lilo-pants` | Lilo Pants | Viscose blend | Rp 159.200 | Rp 199.000 | New | Wide leg |
| `milly-stripe-pants` | Milly Stripe Pants | Linen blend | Rp 159.200 | Rp 199.000 | New | Wide leg |
| `moa-pants` | Moa Pants | Cotton twill | Rp 159.200 | Rp 199.000 | New | Wide leg |
| `pallo-pants` | Pallo Pants | Pinstripe linen | Rp 159.200 | Rp 199.000 | | Wide leg |
| `taka-flare-pants` | Taka Flare Pants | Cupro | Rp 199.000 | | | Wide leg |
| `yora-loose-pants` | Yora Loose Pants | Cotton twill | Rp 165.000 | | | Wide leg |

- **Sizes** XS–XL and **colourways** Cream, Camel, Taupe, Sage, Espresso (hexes in
  `lib/shopify/vocabulary.ts`, taken from the design system's Colourway row) apply to
  every piece, giving 25 variants each. That matrix is the design's, not an inference
  from the catalogue.
- **Stock is not modelled.** The sold-out states are implemented throughout and
  light up the moment Shopify reports inventory; inventing a sold-out run would be
  inventing commerce data.
- **`productType` is derived** — the piece's own name where it states the cut, the
  garment shot where it does not. Wide leg 8, Culottes 2, Straight cut 1.
- **`material` and `care` become metafields** (`custom.material`, `custom.care`).
  Until they exist the card's material line and the Fabric & care tab render
  labelled placeholders.

## Conventions

### Data

- **Shopify's objects are the data layer.** `collection`, `product`, `cart`,
  `paginate`, `collection.filters`, the `money` filter. Do not reimplement any of
  them, and do not compute a price, a total, a discount depth or a shipping rate in
  Liquid. The one arithmetic that is allowed is a display-only percentage off, from
  `compare_at_price` and `price` that Shopify already gave you.
- **Never invent commerce data.** No fabricated shipping rates, review counts,
  stock numbers, countdowns or discount depths — not even as placeholder polish.
  Where a number cannot be known, the UI says where it comes from ("Calculated at
  checkout") or the block hides itself. This is why the design's star rating and
  its "Up to 40% off" tile are absent.
- **Quoting a customer is not inventing one.** The voices wall carries twenty real
  Shopee reviews, verbatim. That is why it is allowed where a star rating is not:
  it reproduces what customers wrote instead of synthesising a score. Never edit,
  tidy or translate one, and never add a review that did not come from the store.
- **Placeholder mode is a feature, not scaffolding.** A snippet called without its
  object renders the labelled placeholder at final size — `product-card` with no
  product, `media` with no image, `copy` with a blank string. That is what makes an
  empty store reviewable. Keep it working; do not add an early return that renders
  nothing.
- **An empty collection and a filtered-to-nothing collection are different facts**
  and must not look the same. The first draws placeholder cards; the second gets
  the no-results alert.

### Copy

- **Two homes, and the split is deliberate.** Interface chrome lives in
  `theme/locales/en.default.json` — it is not brand copy, and it is translatable.
  Everything the brand *says* is a theme or section setting, so the client edits it
  in the theme editor instead of waiting on a code change. That split is what
  stopped "copy is unwritten" from being a code blocker.
- **Never hardcode a user-visible string in a section or snippet.** If script needs
  one, pass it in through a data attribute — `save-button` does.
- **A blank setting is a valid state.** `snippets/copy.liquid` renders a labelled,
  correctly-sized placeholder for any blank slot, so the layout is already final
  before the copy arrives.
- **Site language: English**, single locale. Amounts render the way Shopify's
  `money` filter formats them for Indonesia — `Rp 750.000`.
- **Quoted material keeps its own language.** The customer reviews are Indonesian
  and stay that way; translating a quotation turns it into a paraphrase. This is
  the only exception, and it applies to quotations, never to the site's own voice.

### Rendering

- **Liquid renders on the server. That is the whole model.** There are no client
  islands to reason about any more — the thirteen the React app had came down to six
  behaviours in one file.
- **Everything in `theme.js` is progressive enhancement, and each one is paired
  with a fallback.** The disclosure panel ships open and script closes it. Tab
  panels all ship visible; `scripting: none` keeps them that way and removes the
  strip. The gallery ships showing every angle. The carousel parks each slide at
  its own offset and loses its controls under `scripting: none`. The quantity
  stepper's value lives in a real number input. Add a behaviour, add its fallback.
- **The URL is the state.** Catalogue filters are links that flip one facet and
  preserve the rest — Shopify's `url_to_add` / `url_to_remove`. The variant picker
  is links to `?variant=<id>`. Sort is a plain `GET` form that carries the active
  filters as hidden inputs and deliberately drops `page`. No client filtering, no
  state to keep in step, and every result is shareable.
- **Forms work without JavaScript.** Add to bag posts to `/cart/add`. Each bag line
  is one form to `/cart/change` with two submit buttons carrying different
  quantities, and remove is the same endpoint at quantity 0. Nested forms are
  illegal — the checkout button reaches the cart form by its `form` attribute
  instead of being wrapped in it. Do not "fix" that into a form per button.
- **Checkout is a hand-off.** A submit named `checkout` on the cart form. Do not
  build a custom checkout UI (see [Platform constraints](#platform-constraints)).
- **The voices wall and the Instagram strip cost zero JavaScript** and must stay
  that way. Both loop on CSS.

### Design

- **One token file: `app/tokens.css`, and it is shared.** Every colour, font,
  radius, spacing, shadow and duration resolves to a variable there. `:root` holds
  brand primitives (`--wl-*`, never referenced from markup); `@theme` holds the
  semantic tokens Tailwind turns into utilities. No section or snippet contains a
  hardcoded design value — the palette must be replaceable in one edit.
- **`app/base.css` is shared too.** Change a rule there and both the theme and the
  archived app get it. Theme-only rules — the ones that exist because Liquid has no
  React — live in `theme-src/theme.css` and nowhere else. Never duplicate a rule
  into the theme.
- **Palette, spacing, radius and motion are NOT theme settings.** Exposing them in
  the editor would let one edit break the system. Only copy and the type pairing
  are editable.
- **The page is white; cream is a band colour.** `body` resolves to
  `--color-surface`. Cream (`--color-canvas`) is what fills things *on* it — the
  hero panel, every chip, input, stepper and review card. Paint the shell cream and
  all of those flatten into it.
- **The aurora is two CSS classes, not inline styles.** `.wl-aurora` in `base.css`
  assembles the wash; the stop lists are tokens. `snippets/aurora.liquid` only picks
  a tone, an origin and an intensity. **The veil layer MUST be painted in the colour
  of the surface underneath** — a mismatch shows up as a visible rectangle, and that
  is the bug this effect always has. Its parent MUST carry `relative isolate
  overflow-hidden`; `isolate` is what keeps `soft-light` blending against the band
  rather than the page.
- **A background loop is CSS, not script.** `.wl-voices-*` and `.wl-marquee` in
  `base.css` drive the voices wall and the Instagram strip, and their loop lengths
  are tokens. **Animate `transform` or `opacity` and nothing else.** A loop that
  animates a paint property — `background-position`, `stroke-dashoffset` — is
  re-rasterised every frame on the main thread. A line-art wash of 36 animated
  bezier strands sat behind New arrivals for exactly that reason and was removed.
- **Accessibility is part of the design, not a pass afterwards.** Single `h1` per
  page with no skipped levels — the carousel puts an `h1` on every slide and makes
  the inactive ones `inert`, which is what keeps that true. 44px minimum control
  height, visible focus never removed, sticky-header scroll padding, and **colour
  never carries meaning alone**: sold out says "Sold out", an applied filter carries
  `aria-current`, a toggle carries `aria-pressed`. Four contrast pairs fall short of
  AA; they are implemented as specified and annotated at the top of `tokens.css`.
- **Motion has a readable resting state.** `prefers-reduced-motion` does not merely
  pause a loop — it has to leave the content reachable. The Instagram strip keeps a
  scrollable rail; the voices wall drops its tilt, its offsets and its duplicate
  copies and becomes a plain grid; the carousel never starts rotating at all.

### Performance

The home page carries two continuous background loops and a screenful of scroll
reveals. Both have already cost a round of visible stutter, and the rules below are
what came out of fixing it.

- **A continuous loop animates `transform` or `opacity`. Nothing else.** Those two
  are composited: the texture is rasterised once and the compositor moves it. Every
  other property is re-rasterised on the main thread every frame, and the cost
  scales with how big the element is on screen.
- **`background-attachment: fixed` is banned.** It ties a layer's paint to scroll
  position. It was the single worst offender on this site.
- **Never wrap a 3D scene or a blended layer in something that animates opacity.**
  `[data-reveal]` animates opacity, which makes its element a stacking context.
  Around the voices wall that flattens `preserve-3d`, so the plane's
  `translateZ(-100px)` stops holding the cards behind the stage fades and the wall
  ends in a hard edge; around an aurora band it makes `mix-blend-mode: soft-light`
  blend against the wrapper instead of the page, which draws a visible rectangle.
  The voices wall and the Instagram strip are therefore deliberately **not** given
  `data-reveal`.
- **Skip what is off screen.** `content-visibility: auto` on the voices stage (md
  and up, where the tilted 40-card scene exists). Give anything you add that
  treatment a correct `contain-intrinsic-size`, or scope it to the breakpoint where
  its height is known — reserving the wrong height puts a jump in the page.
- **The mobile layout is the cheap one, on purpose.** Below `md` the voices wall
  loses its perspective, its plane transform, its animations and half its cards. If
  something is smooth on a phone and heavy on a laptop, look at what the desktop
  layout switches back on before blaming the browser.
- **One known cost is still there.** The aurora's `filter: blur(10px)` sits on the
  parent while the animated layer is its child, so the blur is recomputed every
  frame over the whole band. Moving the blur onto the moving layer, or baking a
  pre-softened gradient, is the next step if a band still costs too much.

## Design sources

Two files in Claude Design project
[`bf11a0f4-4b1c-400b-802c-b9c9c2d66673`](https://claude.ai/design/p/bf11a0f4-4b1c-400b-802c-b9c9c2d66673),
both derived from the client's `BRAND GUIDELINE.pdf` and `Katalog Baju` upload:

- **`Wear Label Design System.html`** — the authority for colour, type, radius,
  spacing, shadow, motion and component behaviour. Ported into `app/tokens.css`.
- **`Wear Label Storefront.dc.html`** — the four approved screens.

Its `handoff/` folder holds developer copies of the aurora band and the voices wall.
Both are ported, not dropped in; read the two READMEs there for the reasoning behind
the measured values before changing any of them.

When the design and one of these conventions disagree, say so and ask — do not
silently pick either side. Deviations already taken are recorded at the top of the
section or snippet that took them, and the port's own deviations are listed in
`theme/README.md`.

### Assets, and how they were pulled

Everything came out of the design project byte-exact — nothing was redrawn,
re-exported or approximated. `public/` holds the original exports; `theme/assets/`
holds the copies the theme serves.

| Local | From | Notes |
|---|---|---|
| `public/products/*.webp` (11) | `assets/products/` | The catalogue shots. Square, 639–1024px, named by handle. **Upload these to Shopify with the products** |
| `theme/assets/*.png` (7) | `assets/` | `wordmark`, `stacked`, `mark`, each with a cream variant, plus `wordmark-taupe` |
| `theme/assets/hero-{1,2}.webp` | the design's `sf-hero-*` image slots | The two hero slides |
| `app/icon.png`, `app/apple-icon.png` | the monogram | Per the design system's "monogram for favicons" rule. **Still to set as the store's favicon** |

The icon set is not a file anywhere: `snippets/icon.liquid` carries the path data,
generated from `components/ui/icons.tsx`, which took it verbatim from
`assets/icons/*.svg`.

**The two hero filenames no longer match the slides they sit on.** They were named
for the slides they first sat on and the two have since been swapped, so
`hero-2.webp` (`sf-hero-1`, the order-notes card) leads and `hero-1.webp`
(`sf-hero-2`, the photograph) follows. That is the design's own order. The slide
order lives in `theme/templates/index.json`, not in the filenames.

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
- **Discount codes are validated by Shopify at checkout and nowhere else**, so the
  bag's promo field carries the code to checkout as `?discount=` rather than
  applying it in place. That is a behaviour the design did not draw; the note beside
  the field says so.
- **Storefront filter counts are computed against the filtered set.** Shopify
  exposes no whole-catalogue equivalent, so the React app's rule — counts from every
  product, because a count that shrinks as you narrow tells you nothing — cannot be
  kept. It is the port's one genuine regression and it is written into
  `snippets/catalogue-filters.liquid`.

## The Next.js app is an archive

`app/`, `components/` and `lib/` are the reference the theme was ported from. They
still build, and the build is still kept green — but they are **not the
deliverable**, and the two are allowed to drift. The theme's home page has already
dropped the category mosaic while `app/page.tsx` still renders it.

Rules:

- **Do not port a change backwards** into the React app to keep them level. Record
  the divergence in the theme instead.
- **Do not delete it either**, unless asked. It is the only place the ported
  behaviour is explained at length, and several snippets say "port of <file>" and
  mean it.
- **`app/tokens.css` and `app/base.css` are the exception** — they are shared, live,
  and changing them changes the theme. Treat them as theme files that happen to sit
  in `app/`.
- **`lib/shopify/` is dead code** for the theme's purposes, kept for the catalogue
  fixture (which is where the eleven pieces will be read from when they are
  imported) and the colourway hexes in `vocabulary.ts`.
- **`.design-sync/` is behind the app and behind the theme.** It syncs `.tsx` to
  claude.ai/design and knows nothing about Liquid.
- `AGENTS.md` is written by `next dev` and governs the archived app only.

## Still open

Not decided, and not to be filled in by guessing:

| Open | What happens meanwhile |
|---|---|
| Whether customer accounts exist, or guest checkout is enough | Every `templates/customers/*` renders `main-stub` — the design never covered them, so nothing is drawn rather than Shopify's default being dressed up. "Save for later" is `localStorage` only, in `snippets/save-button.liquid` |
| Which payment gateway | Checkout hands off to Shopify; no gateway is configured yet |
| Shop-banner photography | The catalogue opens straight on the pieces, as the React route did — no banner to fill |
| Per-product Details and Fabric & care copy | `description` and `custom.care` → placeholders. The design reused one generic paragraph for all eleven pieces; it would state a wrong inseam and a wrong fabric on most of them |
| About Us and 404 copy | Blank → placeholders. About Us is the Shopify page's own content |
| Whether there is a limited run, and when it ends | Moot while the band is unplaced. Both the band and the countdown are ported and real |
| Social handles | No socials render, so no dead buttons |
| The unbuilt footer destinations (The studio, Journal, FAQ, Order tracking, Wishlist, Contact us, Returns & refunds, Size guide, Terms) | Nine of twelve footer entries have no URL and render as plain text, never as a 404 link. Add the URL in the theme editor when the page exists |
| A review system | The design's star rating is still deliberately absent — a fabricated score is the one placeholder that cannot be labelled as one. Real quotations are a separate matter and are live in the voices wall; there is no feed behind them, so new reviews mean editing the section's blocks |
| Whether the studio ships from Bandung or Bekasi | The hero's order-notes card says "Pengiriman dari Kota Bekasi"; the footer note says the studio is in Bandung. Both are live. Nothing picks a side |
| Search | The design's search mark is absent; Shopify's search route renders the stub |
| The store's own domain | `kbysza-bk.myshopify.com` until a domain is connected |
| Whether the theme goes live | It is `unpublished`. Publishing is a decision |

**Answered, and recorded so it is not reopened:**

- ~~Which pieces are made to order~~ — **none, 2026-08-20. The studio does not offer
  the service.** The band and every "Start an order" link are off the page; the
  hero's second slide points at the customer voices instead. `sections/category-mosaic`
  and the made-to-order section are kept for the day the service exists, marked as
  not to be placed. The `/shop` "Made to order" filter row that counted zero is gone
  — Shopify has no such filter unless somebody makes one.
- ~~Whether to stay headless~~ — **no, 2026-08-20.** The repo's own rule was
  "presentation only, no commerce logic here"; with no commerce logic, headless was
  paying for control nobody used.

Brand identity, palette, typography and tone are **no longer open** — the design
system settled them, and `app/tokens.css` is where they live. Changing them is a
design-system decision, not a code decision.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
