@AGENTS.md

# CLAUDE.md

## Project

Company profile + product catalogue + commerce storefront for **Wear Label**, a
fashion/apparel brand in Bandung, Indonesia.

**Wear Label is TWO businesses and the site now says so.** `BRIEF.pdf` in the repo
root is the client's own website brief and it is the current authority on scope:

1. **Ready-to-wear / B2C** — women's trousers, tops, cardigans, outerwear. Browse,
   add to bag, check out on the web, *or* be handed to the studio's Shopee listing.
2. **Custom apparel / B2B** — uniforms, corporate apparel and merchandise for
   companies, hospitals, universities, organisations, communities and event
   organisers. **No ecommerce checkout on this route** — brief §16 sends it
   straight to WhatsApp, and that is what `sections/quote-form.liquid` does.

B2B is the newer focus and the smaller book of work. The brief is explicit that the
portfolio must not be inflated to look otherwise: no "trusted by hundreds of
companies", no invented client list, and "Selected Projects" is **deliberately not
built** for v1 because there are no project photographs or nameable clients yet.
Read `BRIEF.pdf` before changing anything on the `/pages/custom` route.

**The deliverable is a Shopify theme, in [`theme/`](./theme/README.md).** Work
happens there and in the Shopify admin. The Next.js app at the repo root is the
reference the theme was ported from — see [The Next.js app is an
archive](#the-nextjs-app-is-an-archive) before touching it.

**Who this is for and what it is for: [`PRODUCT.md`](./PRODUCT.md).** The primary
buyer, what she decides on, and the customer evidence behind each claim are recorded
there. Read it before proposing anything that changes what the site claims — and
note that the brief moved two of its entries: the site is becoming a till as well as
a credibility surface, and B2B custom-apparel buyers are now an audience it serves
rather than one it turns away.

**Status: the store exists, the theme is on it, and the theme is LIVE behind the
storefront password.** All six original routes are ported and four more have landed
for the brief — `/pages/custom`, `/pages/contact`, `/collections` and `/search`.
What is missing is store *configuration* and a handful of client-supplied facts, not
code — and every one of those gaps renders a labelled placeholder at final size
rather than breaking, so the theme is reviewable now:

1. **No photography for the 115 Shopee pieces.** The eleven design pieces carry
   their shots; the 115 imported from Shopee carry none (see [The
   catalogue](#the-catalogue)), so most of the grid still draws placeholder cards
   at the real card proportions.
2. **One filter, not none.** Shopify's default **Availability** facet is live —
   `filter.v.availability=1` (In stock) and `=0` — and every entry point into the
   catalogue now carries it, because 106 of the 126 products are sold out and the
   bare `/collections/all` opened on eight sold-out cards out of nine. Product
   type, size and colourway facets are still undefined; they come from the Search
   and Discovery app, and until then the rail says so rather than inventing them.
3. **Two Shopify pages do not exist**, and every route to them 404s until they
   do. Checked against the live storefront 2026-08-31, with the password:

   | Handle | Title | Template | State |
   |---|---|---|---|
   | `custom` | Custom & Business | `page.custom` | **404 — create it** |
   | `about` | About Us | *(default `page`)* | **404 — create it** |
   | `contact` | Contact | `page.contact` | **200, and correct** — the page exists and its suffix is set; `contact-details` renders, native form and all four placeholder rows included |

   `/pages/custom` is the urgent one and it outranks the missing WhatsApp number.
   The nav, the hero's second CTA, the home page's custom band and the footer all
   point at it, so **the entire B2B route is unreachable** — and filling in the
   number changes nothing while the page it lives on 404s. Create the page first.
4. **Four product metafield definitions do not exist**, so four slots render
   placeholders: `custom.care`, `custom.size_chart`, `custom.fit`,
   `custom.shopee_url`. **`custom.material` is now defined AND populated** —
   verified 2026-08-31 against the store, which returns exactly one product
   metafield definition and a real value on all eleven design pieces, so the
   card's material line and the product page's material row draw data rather
   than a placeholder.
5. **Two theme settings are blank ON PURPOSE, pending the client**, both under
   Theme settings → Custom & business. Neither fails silently:
   - `whatsapp_number` — with it blank the quote form still renders at full size
     and its submit is *disabled* with an alert saying why. **This is the entire
     B2B conversion path**; nothing else on `/pages/custom` matters until it is
     filled in.
   - `shopee_shop_url` — with it blank, "Buy on Shopee" is simply absent from
     product pages rather than linking to a search page.
6. **Contact details are placeholders, by instruction 2026-08-31.** Email, studio
   address and opening hours are blocks on `templates/page.contact.json` with
   blank values, so each renders a labelled placeholder at final size. They are
   variable facts nobody has supplied and an address is the one string a reader
   acts on. Filling them in is a theme-editor edit.
7. **There is no B2B photography**, by the same instruction. `custom-band` and all
   three `custom-services` cards draw labelled placeholders at final size. The
   B2B hero is the exception and needs no photograph — see its own comment.
8. **Copy.** Brand voice is unsettled. Blank theme settings render a labelled
   placeholder, so filling them in is the whole change. The brief's own strings
   are in as section-setting *defaults*, so the client edits them in the theme
   editor.
9. **The decisions under [Still open](#still-open).** Nothing in that list may be
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
| Theme | `205197312286` — "Wear Label", role **`live`** |
| Preview | https://kbysza-bk.myshopify.com?preview_theme_id=205197312286 |
| Editor | https://kbysza-bk.myshopify.com/admin/themes/205197312286/editor |

The storefront is password-protected, as new stores are — `/` still redirects to
`/password`. `theme push` does **not** need that password; `theme dev` does, and so
does fetching a rendered page to verify it. It is in Online Store → Preferences.

**The storefront password is `1234`.** It is written down here by the repo owner's
explicit instruction, 2026-08-31, after being told that this repository is public
on GitHub and that a commit is permanent: "i accept the risk". That is a decision
already taken — do not re-litigate it, and do not quietly remove the value.

What it does and does not open, so nobody overestimates it: it is the pre-launch
gate on the storefront and nothing else. It is not the Shopify admin, not a
payment credential, and it grants no write access of any kind. **The rule it
replaces still applies to every other secret** — an admin token, a gateway key or
a courier API key must never be written to a file in this repo.

Authenticating from a script, which is how step 4 of the working agreement gets
done:

```bash
curl -s -c cj.txt -b cj.txt -o /dev/null -X POST \
  https://kbysza-bk.myshopify.com/password \
  --data-urlencode form_type=storefront_password \
  --data-urlencode password=1234
# then reuse cj.txt: curl -s -b cj.txt https://kbysza-bk.myshopify.com/pages/custom
```

**THE THEME IS LIVE. It was `unpublished` and somebody published it**, discovered
2026-08-31 when `theme:push` prompted "Push theme files to the live theme on
kbysza-bk.myshopify.com?". Nothing is publicly reachable — the storefront password
is still on — but two instructions that used to agree now conflict, and the
resolution is:

- **`npm run theme:push` CANNOT COMPLETE non-interactively any more.** It pins
  `--theme 205197312286`, which was the safe target and is now the live one, and the
  CLI stops with "Failed to prompt: Push theme files to the live theme…". The flag
  that gets past it is **`--allow-live`** (`-a`), which exists for exactly this and
  is not the same as `--force`. Confirmed working 2026-08-31:

  ```bash
  npx shopify theme push --path theme --store kbysza-bk.myshopify.com \
    --theme 205197312286 --allow-live --json
  ```

- **Ask before you use it.** Authorised once, 2026-08-31, for the brief's B2B and
  search work — that authorisation was for that push, not standing. The password is
  now the only thing keeping the store private, so a push to live is a change to the
  thing the client looks at, and one they should know is coming.
- **To verify without touching live, use a scratch unpublished theme.**
  `npx shopify theme push --path theme --store kbysza-bk.myshopify.com --unpublished
  --theme "<name>" --json` creates one and prints its id and preview URL. Push there,
  read the rendered output, then land it. **Delete it when done** —
  `npx shopify theme delete --store … --theme <id> --force` — it costs a theme slot
  and the next person will mistake it for the real one.
- **`theme push` reports errors `theme check` cannot see.** The `--json` output
  carries a per-file `errors` map from the store's own validator. That is how a
  `max_blocks` violation surfaces: the six-item nav the brief asks for was pushed
  against `header.liquid`'s `"max_blocks": 5`, the push *completed*, and the store
  returned "Block count exceeds maximum of 5 for section 'header'" while silently
  dropping the extra blocks. `theme check` passed on it. **Read the push output.**

Some Admin API work still needs store-level auth run interactively — importing the
catalogue, for one. `shopify auth login` alone is enough for theme commands.

Two things about that command, both of which have cost a round trip:

- **`shopify` is not on `PATH`.** The CLI is a pinned devDependency, so it is
  `npx shopify …` or nothing.
- **`--scopes` is required**, and CLI 4.7's error for omitting it is just
  `Missing required flag scopes`. It takes a comma-separated list of Admin API
  scopes and stores an online access token; re-run it if the token expires or if
  you need a scope it was not granted.

The invocation for a catalogue import, with why each scope is there:

```bash
npx shopify store auth --store kbysza-bk.myshopify.com \
  --scopes read_products,write_products,read_files,write_files,\
read_publications,write_publications,read_metaobjects,write_metaobjects,\
read_inventory,write_inventory
```

| Scope | Why |
|---|---|
| `read/write_products` | The eleven pieces, their two options, 25 variants each, and the `custom.material` / `custom.care` product metafields |
| `read/write_files` | Uploading the eleven `public/products/*.webp` photographs |
| `read/write_publications` | Publishing to the Online Store channel. **Without this the products import invisible** — they exist in admin and the storefront renders placeholders |
| `read/write_metaobjects` | Colourway swatches. Without swatch metaobjects the picker draws five identical rectangles |
| `read/write_inventory` | To set each variant's tracking. *Untracked* is the honest state where there is no stock data — inventing a stock number is exactly what this repo refuses. *Tracked at 0* is the honest state where the source says sold out, and it is what lights up the theme's sold-out markup |

Then `npx shopify store execute` runs the GraphQL mutations.

Three things the catalogue import turned up, each of which cost a round trip:

- **`ProductCreateInput` has no publications field.** Publishing is a second
  mutation — `publishablePublish` against
  `gid://shopify/Publication/377657065758` (Online Store). Skip it and the
  product exists in admin while the storefront still draws a placeholder.
- **`productSet` rejects a variant without `optionValues`**, so a product with no
  real options is `productCreate` (which makes the default variant on its own)
  followed by `productVariantsBulkUpdate` for price and inventory tracking. Two
  calls, not one.
- **The stored token has neither `read_locations` nor `read_product_listings`**,
  so `locations`, `Location.name` and `publishedOnCurrentPublication` all come
  back `ACCESS_DENIED`. Neither scope is needed: a freshly created *tracked*
  variant is already at 0 available, and the location id is readable through
  `variant.inventoryItem.inventoryLevels` if it is ever wanted.

- **It has no `read_content` either**, so `pages` comes back "Access denied for
  pages field". Found 2026-08-31 while auditing the brief. It stopped mattering
  the same day: the storefront password is now in [The store](#the-store), so the
  question "does this page exist" is a curl, and that is how the table in item 3
  above was filled in. Add `read_content` to the scope list and re-auth only if
  you need page *contents* from the Admin API rather than a status code.

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

# 2. land it on the store. THE PINNED THEME IS THE LIVE ONE NOW — see The store.
#    npm run theme:push stops with "Failed to prompt" and needs --allow-live,
#    which is a decision to ask about, not a flag to add.
npx shopify theme push --path theme --store kbysza-bk.myshopify.com \
  --theme 205197312286 --allow-live --json

# 3. READ THE PUSH OUTPUT. Its per-file `errors` map carries what theme check
#    cannot see — a max_blocks violation pushes "successfully" and silently
#    drops the extra blocks.

# 4. verify against what the store actually rendered, not against intent
#    (curl the preview URL and grep for the markers you changed).
#    NEEDS THE STOREFRONT PASSWORD — everything else redirects to /password.
#    It is `1234`, and The store has the curl that logs in. No excuse now.

# 5. stage exactly what you changed, never `git add -A` blind
git add <the files you touched>

# 6. commit straight onto main — no feature branch
git commit          # message: what changed and WHY, in the imperative

# 7. push, then keep the graph current
git push origin main
graphify update .
```

**Step 4 is not optional.** `theme check` proves the Liquid parses; it does not
prove the page renders what you meant. Every claim about this theme's output in git
history was checked by fetching the rendered HTML and counting what came back.

It was skipped once, knowingly — the brief's B2B commit, 2026-08-31, because the
password was not supplied and the client chose to review in the theme editor
instead. The commit message says so in as many words. **If you skip it, say you
skipped it**; a verification that did not happen must never be reported as one
that did.

**`theme/` HAS UNTRACKED FILES THAT ARE NOT YOURS.** A parallel session is working
on a scroll-driven sequence and has left `sections/scroll-sequence.liquid`,
`assets/scroll-sequence.js`, `assets/gsap.min.js`,
`assets/gsap-scrolltrigger.min.js` and 55 `assets/sequence-*.webp` untracked in the
working tree. They are not referenced by any committed template. **Do not commit
them, do not delete them, and do not "fix" the eslint errors in the two GSAP
files** — those 10 errors are the vendored minified builds and they are the only
eslint errors in the repo, so a clean run means "10 errors, all in GSAP", not zero.
The branch `worktree-integrate-floating-paths` is that session's; leave it alone.

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

**The B2B route has no commerce logic of any kind, and that is by instruction.**
Brief §16: "B2B tidak menggunakan ecommerce checkout -> langsung ke WA". There is no
cart, no quote object, no stored enquiry, no inbox and no price anywhere on
`/pages/custom` — a specification and a quantity are what a price gets quoted
against, and that conversation happens in WhatsApp. So the whole route is
presentation plus one link. If a task on that page appears to need a database, a
form backend or a quote calculator, it is the wrong task.

## Stack

- **Shopify Online Store 2.0** — JSON templates, sections, section groups, blocks
- **Liquid**, server-rendered. No framework, no build step on Shopify's side
- **Tailwind CSS v4**, precompiled to `theme/assets/theme.css`
- **CSS-variable design tokens** in `app/tokens.css`, shared with the archived app
- **Vanilla JS** in `theme/assets/theme.js` — eight behaviours (the header
  disclosure, the scroll reveals, the carousel, the gallery, the tabs, the quantity
  stepper, save-for-later, and the quote form's WhatsApp composer), all progressive
  enhancement
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
| `/pages/custom` | — | **Custom & Business (B2B).** Hero, services, how it works, why Wear Label, request a quote. Template suffix `page.custom` |
| `/pages/contact` | — | **Contact.** Placeholder detail rows plus Shopify's native contact form. Template suffix `page.contact` |
| `/collections` | — | **Collections.** The catalogue by category. Empty until the collections are created |
| `/search` | — | **Search.** Products only; the header mark links here |
| `/account` | `/account` | Shopify's customer routes — still `main-stub`, not designed |
| 404 | `app/not-found.tsx` | `sections/main-404.liquid` |

The four routes with no React counterpart came from the brief, not from the port —
§5 (the navigation) and §9 (the B2B page). `/pages/custom` and `/pages/contact` need
a Shopify page to exist with the matching handle and template suffix or they 404;
the other two are Shopify's own routes and work as soon as the theme has a section
for them, which they now do.

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

The store and the theme id are pinned inside `theme:dev` and `theme:push`.
**That no longer means what it used to mean.** The comment this replaces said
"neither can wander onto the live theme by accident" — true when `205197312286`
was unpublished, false now that it is the live theme. The pin is still worth
having: it stops a push landing on `Horizon` or on a stray development theme. But
`npm run theme:push` cannot complete on its own any more; see
[The store](#the-store) for the `--allow-live` invocation and when to ask before
using it.

`theme dev` will still ask for the storefront password once.

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
| `snippets/button` | nothing — extracted 2026-08-31 from the primary button's class string, which had been retyped in three sections and was about to be retyped in eight more |
| `sections/custom-band` | nothing — brief §7, the B2B hook on the home page |
| `sections/custom-hero` · `custom-services` · `how-it-works` · `why-wear-label` · `quote-form` | nothing — brief §9, the Custom & Business page |
| `sections/contact-details` | nothing — brief §5 put Contact in the nav and specified nothing else |
| `sections/main-search` | nothing — brief §5 asked for search; the route was `main-stub` |
| `sections/main-list-collections` | nothing — brief §5 asked for Collections; the route was `main-stub` |
| `assets/theme.js` | the header disclosure, the reveals, the carousel, the gallery, the tabs, the stepper, the save button, the quote form's WhatsApp composer |

Two of those are **generated from the React source, not retyped**, and must stay
that way: `snippets/icon.liquid` (all twelve paths verified byte-exact against
`components/ui/icons.tsx`) and the twenty reviews in `sections/voices-wall.liquid`
(asserted verbatim against `lib/content/site.ts`).

**Home page sequence:** hero → new arrivals → **Wear Label Custom** → customer
voices → service band → Instagram strip. The custom band went in directly after the
product section because brief §7 puts it there, and because the hero's second CTA
has to land somewhere on the same page for a reader who scrolls instead of clicking.

**One block exists and is deliberately not placed: `category-mosaic`.** The brief
asks for it back (§6 Section 3, "Shop by Category") and it stays out until the
category collections exist on the store — every tile has to point at something that
matches, and today `/collections/pants` is a 404 while
`?filter.p.product_type=Pants` silently returns the whole catalogue because that
facet is not defined. The section's own comment carries the full reasoning.

**Two blocks are gone from the repo, and CLAUDE.md used to claim they were kept.**
`made-to-order.liquid`, `promo-band.liquid`, `countdown.liquid` and `limited-run`
are **not in `theme/sections/`** — checked 2026-08-31. The made-to-order rule still
stands as a rule (the studio does not offer per-shopper made-to-order, answered
2026-08-20) but there is no file to not-place.

**The brief's B2B service does NOT reopen that decision.** They are different
things: made-to-order was one garment cut for one shopper, which the studio does not
do; custom apparel production is a bulk run for an organisation, which is the
business `/pages/custom` is about. Do not read §7 as licence to put a made-to-order
block back on a product page.

## The catalogue

**126 products are on the store, all `ACTIVE` and all published to the Online
Store.** They arrived in two imports, done deliberately differently, and the
difference is what to read before adding to either.

### The eleven design pieces

From the design project's `CATALOG` constant. Names, materials and prices are the
client's own data; the photographs are the client's own shots, one square `.webp`
per piece in `public/products/`, named by handle — **and they are on Shopify**:
these eleven are the only products in the store that carry an image.

| Handle | Name | Material | Price | Was | Flags | Category |
|---|---|---|---|---|---|---|
| `basic-linen-cullote` | Basic Linen Culotte | Handwoven linen | Rp 165.000 | | | Culottes |
| `casual-culotte-zipper` | Casual Culotte Zipper | Washed linen | Rp 165.000 | | | Culottes |
| `basic-pants` | Basic Pants | Cotton poplin | Rp 165.000 | | | Straight cut |
| `cerra-loose-pants` | Cerra Loose Pants | Cotton twill | Rp 159.000 | | | Wide leg |
| `dalia-wide-pants` | Dalia Wide Pants | Tencel | Rp 175.000 | | | Wide leg |
| `lilo-pants` | Lilo Pants | Viscose blend | Rp 199.000 | | | Wide leg |
| `milly-stripe-pants` | Milly Stripe Pants | Linen blend | Rp 199.000 | | | Wide leg |
| `moa-pants` | Moa Pants | Cotton twill | Rp 199.000 | | | Wide leg |
| `pallo-pants` | Pallo Pants | Pinstripe linen | Rp 199.000 | | | Wide leg |
| `taka-flare-pants` | Taka Flare Pants | Cupro | Rp 199.000 | | | Wide leg |
| `yora-loose-pants` | Yora Loose Pants | Cotton twill | Rp 165.000 | | | Wide leg |

- **Sizes** XS–XL and **colourways** Cream, Camel, Taupe, Sage, Espresso (hexes in
  `lib/shopify/vocabulary.ts`, taken from the design system's Colourway row) apply to
  every piece, giving 25 variants each. That matrix is the design's, not an inference
  from the catalogue.
- **Stock is not modelled for these eleven.** Their inventory is *untracked*, so
  they read as available; Shopee states availability for them but never quantity,
  and inventing a number is what this repo refuses.
- **The Rp 159.200 markdown is over.** Lilo, Milly, Moa and Pallo were imported at
  that price against a compare-at of Rp 199.000. Shopee now lists all four at
  Rp 199.000, so on 2026-08-21 all 25 variants of each were set to 199.000 and
  their compare-at cleared — a compare-at that no longer holds draws a discount
  badge for a discount the shopper cannot get. **No product on the store carries a
  compare-at any more**, which is why nothing renders a percentage-off flash. The
  design's "New" flags on Lilo, Milly and Moa **are** modelled in Shopify, as the
  tag `New` — verified 2026-08-31, and they are the only three tags on the entire
  126-product catalogue. This file said they were not; it was wrong.
- **`productType` is derived** — the piece's own name where it states the cut, the
  garment shot where it does not. Wide leg 8, Culottes 2, Straight cut 1.
- **`material` and `care` become metafields** (`custom.material`, `custom.care`).
  Until they exist the card's material line and the Fabric & care tab render
  labelled placeholders.
- **Vendor is Shopify's default `My Store`** on these eleven, not `Wear Label`.
  Nothing in the theme reads vendor, so it has been left rather than churned.

### The 115 Shopee pieces

Imported 2026-08-21 from the client's own Shopee storefront listing — the live
one, pasted in wholesale. **Title and price only.** That was the instruction, and
it is also all the listing gave: no photographs, no descriptions, no size or
colour data, and the ratings and units-sold counts were deliberately dropped
(a review score is the one placeholder that cannot be labelled as one).

- **One default variant each, no options.** Assigning XS–XL × five colourways to a
  tote bag would have been inventing the matrix. `snippets/product-purchase.liquid`
  therefore guards its picker on `has_only_default_variant`: Shopify hands a
  no-option product one synthetic `Title` option whose only value is
  `Default Title`, and rendering it draws a fieldset offering a choice that does
  not exist. Both that snippet and `sections/main-product.liquid` also fall back
  to `product.variants.first` when `selected_or_first_available_variant` comes
  back nil, which is what a fully sold-out product does.
- **Nine are in stock, 106 are sold out**, and that split is Shopee's own. The 106
  are `ACTIVE` with inventory **tracked at 0**, which is what lights up the
  theme's sold-out markup; the nine in stock are untracked, like the eleven above.
  So the storefront's sold-out state is now real data, not a state waiting for
  data.
- **Names are the Shopee titles with the marketing tail cut.** "Basic Pants by
  Wear Label - Celana Panjang Highwaist Wanita - Formal Casual" → `Basic Pants`.
  ALL-CAPS titles were title-cased; mixed-case ones were left alone, which is why
  `Cerra Loose Pants BIG SIZE` keeps its shout. The reject and defect runs kept
  their qualifier, because it is what the piece is: `Defect Sale Cerra Loose
  Pants`, `Minor Reject Sale Canvas Bag`, `Casa Bag Minor Reject`.
- **`productType` is the garment the name itself states** — Vest 31, Pants 25,
  Shirt 16, Bag 7, Skirt 6, Culottes 5, Tunik 4, Cardigan 4, Outer 3, Knitwear 3,
  Set 2, Blouse 2, Top 2, Dress 1, Blazer 1, and five left blank. The five blanks
  are the Raya series and sets and the reject-sale linen: those names state a
  collection or a fabric, not a garment, and the rule is that a type is derived,
  never guessed.
- **That mixes two axes into one facet — and the overlap is SMALLER than this file
  used to claim.** Counted against the store 2026-08-31: only **nine** of the 126
  carry a cut where a garment belongs — `Wide leg` 8 and `Straight cut` 1.
  **`Culottes` is a garment, not a cut**, and both imports agree on it (2 from the
  design pieces, 3 from Shopee), so it needs no merging at all. The fix is nine
  `productUpdate` calls, not eleven, and it is the only edit standing between the
  catalogue and a single clean `product_type` axis.

  **Do not size the collections work off the type counts alone — check stock.**
  Of the sixteen types, **three have anything in stock**: Pants 14 of 34,
  Cardigan 4 of 4, Culottes 2 of 5. The other thirteen are 100% sold out, which
  matters because every entry point into the catalogue carries
  `filter.v.availability=1`. Fifteen automated collections is still the right
  build — they are auto-maintaining and fill themselves on restock — but a
  "Shop by Category" mosaic drawn over them would be thirteen tiles opening on
  nothing. Which tiles to show is a design decision; creating the collections is
  not. Keep the two apart.
- **Duplicates were dropped, not re-imported.** Lilo, Soso and Tara Stripe Pants
  each appeared in both the in-stock and the sold-out listing; the in-stock row
  won, and the eleven already on the store were skipped outright. `Cerra Loose
  Pants BIG SIZE`, `Pallo Stripe Pants` and `Milly Balloon Skirt` are separate
  pieces from `Cerra Loose Pants`, `Pallo Pants` and `Milly Stripe Pants`, and are
  imported as such.
- **Vendor is `Wear Label`** on all 115.

## Liquid, Tailwind and theme-check traps

Every one of these cost a round trip. Four of them fail **silently** — the page
renders, nothing errors, and the thing you wrote is simply not there.

### A class name that does not exist literally in a file does not exist at all

`theme-src/theme.css` scans these files as TEXT — `@source
"../theme/sections/*.liquid"`, `snippets`, `layout`, `assets/*.js`. Tailwind reads
the raw Liquid, not the rendered output. So **a class name assembled at runtime is
never generated**:

```liquid
{%- comment -%} BROKEN: emits the right markup and no CSS exists for it {%- endcomment -%}
{%- assign off = 'border-inert-border bg-inert' -%}
class="disabled:{{ off | replace: ' ', ' disabled:' }}"
```

Write every utility out longhand, even when that means the same list twice for two
variants. `snippets/button.liquid` carries both a bare and a `disabled:`-prefixed
copy of each variant's off-state for exactly this reason, and says so.

This also means: **after adding a section, always rebuild and grep the built CSS**
for any unusual utility you used. `npm run theme:css` then
`grep -c 'order-last' theme/assets/theme.css`. A zero there is a layout that
will be wrong on the store and right in your head.

### `render` takes no filters and no expressions

Two separate limits with two different symptoms.

**A filter on a `render` argument** is caught by theme check —
`UnsupportedFilterArguments`, "Filters cannot be used on arguments passed to the
'render' tag". Assign first:

```liquid
{%- assign slide_href = block.settings.href | default: routes.all_products_collection_url -%}
{% render 'button', href: slide_href %}
```

**An expression is not caught by anything** and is a parse error at render time.
`{% render 'button', disabled: purchasable == false %}` does not evaluate to false,
it fails. The negation has to exist as its own variable first, which is why
`product-purchase.liquid` assigns `unavailable` next to `purchasable`.

### Inside `{% liquid %}`, a comment is `#` — and a stray `%}` closes the tag

`{% comment %}` is not valid in there. Worse, the lexer closes a
`{%- liquid … -%}` tag at the **first** `%}` it finds, so writing the words
`{% comment %}` inside a `#` line silently truncates the block and everything after
it becomes literal text on the page. Keep tag delimiters out of `{% liquid %}`
bodies entirely — say "percent-brace", not the characters.

### A block tag inside `{% comment %}` can still break the parse

`{% comment %}` skips its body, but a block-level tag in there — `{% form %}`,
`{% if %}`, `{% schema %}` — can still need its closer. Referring to Shopify's
contact form in prose is safe; writing `{% form 'contact' %}` in a comment is not.
`quote-form.liquid` says "Shopify's own contact form tag" for this reason.

### `theme check` does not check a schema's own limits

It validates Liquid and schema *shape*. It does not compare `"max_blocks"` against
what a `*-group.json` or template actually holds. The store does, at push time, and
reports it in the `--json` output's per-file `errors` map — **while the push
completes and silently drops the extra blocks.** This is how the brief's six-item
nav landed against `header.liquid`'s `"max_blocks": 5` with a green theme check.

Push, then read the output. It is the only validator that sees this class of bug.

## Conventions

### Data

- **Shopify's objects are the data layer.** `collection`, `product`, `cart`,
  `paginate`, `collection.filters`, the `money` filter. Do not reimplement any of
  them, and do not compute a price, a total, a discount depth or a shipping rate in
  Liquid. The one arithmetic that is allowed is a display-only percentage off, from
  `compare_at_price` and `price` that Shopify already gave you.
- **Every product metafield the theme reads, and what shows without it.** Four of
  the five are undefined on the store, so four slots are rendering placeholders
  right now; `custom.material` is defined and carries a value on the eleven design
  pieces. Define the rest in Settings → Custom data → Products.

  | Metafield | Type | Read by | Blank renders |
  |---|---|---|---|
  | `custom.material` | single line text | `product-card`, `main-product` | **defined — renders data** |
  | `custom.care` | rich text | `product-tabs` → Fabric & care | labelled placeholder |
  | `custom.size_chart` | rich text | `product-tabs` → Size & fit | labelled placeholder inside `.wl-table` |
  | `custom.fit` | rich text | `product-tabs` → Size & fit | labelled placeholder |
  | `custom.shopee_url` | URL | `product-purchase` | **nothing at all** — see below |

  `size_chart` is styled by `.wl-table` in `theme-src/theme.css`, which exists
  because Shopify emits a bare `<table>` and `base.css` styles nothing inside one.
  It scrolls sideways rather than shrinking: five sizes against four measurements
  is ~420px of unbreakable numbers and horizontal *page* scroll is forbidden.

- **The Shopee hand-off is a metafield with a setting as its fallback**, and the
  precedence is deliberate. `custom.shopee_url` per product wins; `settings.shopee_shop_url`
  fills in; with neither, the link is **absent** rather than pointing at a search
  page. A per-product URL lands the shopper on the piece, a shop URL lands them on
  a shop — so the fallback is a courtesy, not the intended state.

  It is a LINK and not a button, and that is a hierarchy decision worth keeping: it
  is a channel choice, not a purchase intent. A third button on the product page
  puts the marketplace at parity with the store's own checkout, on the store's own
  page. It also stays visible on a sold-out product on purpose — the stock data
  came from Shopee as a snapshot, and hiding the link would assert a restock has
  not happened when nothing here knows that.

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
  one, pass it in through a data attribute — `save-button` does for its two states,
  and `quote-form` does for its three field labels (`data-quote-field` carries the
  label the composed WhatsApp message uses). There is no copy in `theme.js` and
  there must not be. This rule was broken once and fixed on 2026-08-31:
  `main-collection.liquid` rendered a hardcoded `'No pieces match these filters.'`
  while `catalogue.no_results` sat in the locale file holding that exact sentence,
  referenced by nothing.

- **The locale namespaces, and what each is for.** `general` · `catalogue` ·
  `product` · `cart` · `home` · `carousel` · `customer` · `gift_card`, plus four
  added for the brief: **`search`** (the field, the prompt, the pluralised result
  count, the nothing-matched line), **`collections`** (the "no collections yet"
  notice), **`quote`** (the three field labels and the no-WhatsApp-number alert)
  and **`contact`** (the native form's labels and its success line).

  `general.opens_new_tab` is the screen-reader suffix every off-site link carries —
  the footer socials and Buy on Shopee. A link that replaces the page without
  saying so is the bug it exists to prevent.
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

- **`Buy now` is that same two-submits pattern**, one form with a second submit
  carrying `name="return_to" value="/checkout"`, so only the button actually
  pressed adds the parameter. It is **not** `{{ form | payment_button }}` — see
  [Platform constraints](#platform-constraints).

- **THE QUOTE FORM IS THE PATTERN TO COPY for anything that hands off to an
  external app**, and it is worth understanding before touching it. It is a real
  `<form method="get">` whose `action` is the studio's `wa.me` URL. The three
  visible fields have **no `name` attribute**, so they are never serialised; the
  only named control is a hidden `text` input. `theme.js` fills that input on
  `submit`, from `data-quote-field` labels in the markup.

  What that buys: with script off, `text` submits empty and WhatsApp opens the
  same chat with nothing typed — the reader is exactly where they were going and
  types the message themselves. With script on they arrive with it composed.
  `required` still validates either way; native validation does not care whether a
  field has a name.

  The alternative — a click handler that builds a URL and navigates — is a control
  that does nothing with script off. **A button that only works with script is a
  dead control; a form that only prefills with script is a form.**

- **Search is a page, not a header overlay.** `header.liquid` used to argue the
  mark should not exist at all ("an icon that does nothing is worse than one
  absence") and the brief asked for it, so the mark is a link to `/search`. An
  overlay would be a second disclosure in a header that already has one, would
  need its own focus trap and escape handling, and could not work with script off —
  which puts the magnifier straight back to doing nothing. Results are restricted
  to products with a hidden `type=product`, because the theme has no card for a
  page or article result.
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
- **There is ONE button: `snippets/button.liquid`.** Four variants — `primary`,
  `secondary`, and `invert` / `invert-outline` for espresso grounds. It renders an
  `<a>` when given `href` and a `<button>` otherwise, which matters: an `<a>` that
  submits and a `<button>` that navigates are both wrong and both look identical.
  Do not retype the class string; that is what this snippet was extracted to stop,
  after it had been copied into three sections and was about to be copied into
  eight more.

  `secondary` is unreadable on espresso — its `text-brand` is rgb(114,94,76) on
  rgb(30,26,22) — which is the same trap `footer.liquid` documents for its link
  colour. Use an `invert` variant on any inverted surface.

- **Two bands of the same colour must not touch.** The home page's B2B band is
  cream and not espresso for exactly this reason: the voices wall directly below it
  is espresso, and two espresso bands adjoining read as one very long dark region
  with a seam in it rather than as two sections. `custom-band` gets its weight from
  the aurora, the photograph and the pair of buttons instead. `why-wear-label` is
  cream *cards on white* for the same reason — the cream band of `how-it-works` is
  directly above it.

- **A placeholder is for a layout that DEPENDS on the missing thing.** That is the
  limit of the rule, and `custom-hero` is the one section that deliberately draws
  no placeholder: an espresso ground with the aurora and the type over it is
  already a finished surface, the way the footer is. An empty photo slot there has
  a design, not a hole, and a grey rectangle labelled "photo" would be scaffolding
  standing in front of something finished. Every other empty slot on the site still
  draws its placeholder at final size.

- **No new icons for a service or a value.** The design direction asks for minimal
  icons and an editorial look; three marks in circles above three headings is the
  layout every services section has. `custom-services` uses the photograph as the
  mark and `how-it-works` uses numerals. Only one mark has been added to
  `icon.liquid` since the port — `search` — and it is flagged there as the single
  exception to "generated from `components/ui/icons.tsx`, never retyped".

- **A derived number is never a typed number.** `how-it-works` zero-pads its step
  number from `forloop.index`, so inserting a step renumbers the row. A step
  numbered by hand goes wrong the first time somebody inserts one in the middle,
  and the block they forget to renumber is the one that ships.

- **British spelling.** "Colourway" is an option name, a locale key and a filter
  label, so the site is British throughout — which is why the B2B page says
  "customisation" where the brief wrote "Customization". One page spelled the other
  way is something a reader notices without being able to say why.

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
re-exported or approximated, **with one exception, `hero-1.webp`, noted below.**
`public/` holds the original exports; `theme/assets/` holds the copies the theme
serves, and for every asset the two are byte-identical. Replace one, replace both:
nothing copies `public/` into `theme/assets/` for you, so a stale original there
is how somebody's change gets quietly reverted later.

| Local | From | Notes |
|---|---|---|
| `public/products/*.webp` (11) | `assets/products/` | The catalogue shots. Square, 639–1024px, named by handle. **Upload these to Shopify with the products** |
| `theme/assets/*.png` (7) | `assets/` | `wordmark`, `stacked`, `mark`, each with a cream variant, plus `wordmark-taupe` |
| `theme/assets/hero-1.webp` | **the studio, not the design** | Slide 1 — the polaroids. 2730x1536, the studio's own higher-resolution render of the same composition, replacing the design's soft 1200x675 export on 2026-08-21. It does **not** carry the wordmark the design's export had across its top |
| `theme/assets/hero-2.webp` | the design's `sf-hero-1` image slot | Slide 2 — the order-notes card. Byte-exact, 1200x675 |
| `app/icon.png`, `app/apple-icon.png` | the monogram | Per the design system's "monogram for favicons" rule. **Still to set as the store's favicon** |

The icon set is not a file anywhere: `snippets/icon.liquid` carries the path data,
generated from `components/ui/icons.tsx`, which took it verbatim from
`assets/icons/*.svg`.

**The hero leads with the photograph, which is not the design's order.** The
design puts the studio's Indonesian order-notes card first (`sf-hero-1`, shipped
as `hero-2.webp`) and the polaroids second (`sf-hero-2`, `hero-1.webp`). **The
theme runs them the other way round, on request, 2026-08-21.** Two reasons, and
they are the ones to re-read before anybody swaps it back: the card is
`text_art`, so it is dropped below `md` and a phone therefore used to open on the
band's bare surface; and a screenful of full-bleed Indonesian type reads as a
notice, which is a great deal to hand a first-time visitor before a photograph.

Since that swap the filenames happen to match their positions again — slide 1 is
`hero-1.webp`, slide 2 is `hero-2.webp`. **Do not rely on it.** Nothing in the
theme reads the number in a filename; the slide order lives in
`theme/templates/index.json` and nowhere else. The archived React band at
`components/home/hero-carousel.tsx` still runs the design's order and is
deliberately not being kept level — see [The Next.js app is an
archive](#the-nextjs-app-is-an-archive).

## Platform constraints

Fixed properties of Shopify in this market — design around them, don't retry them:

- **Shopify Payments is unavailable in Indonesia.** A third-party gateway is
  required, and Shopify adds a transaction fee on top of the gateway fee when
  Shopify Payments is not used.
  - **Therefore `Buy now` cannot be an accelerated checkout button.**
    `{{ form | payment_button }}` renders Shop Pay and the wallet buttons, all of
    which need Shopify Payments. So the brief's `BUY NOW` (§11) is a second submit
    on the add-to-bag form carrying `name="return_to" value="/checkout"` — the
    shopper reaches checkout in one silent hop *through* the cart rather than
    skipping it. Same destination, one extra request, and it is the only version
    available on this store. Do not "upgrade" it to `payment_button`.
- **A fully custom checkout UI requires Shopify Plus.** On lower plans checkout is
  Shopify-hosted. This is why the bag has no shipping selector and no address
  fields, and why its total equals its subtotal.
- **Indonesian couriers (JNE, J&T, SiCepat) are not native to Shopify** — they
  require a RajaOngkir/Biteship app, which quotes rates *during* checkout. The bag
  therefore says "Calculated at checkout" rather than showing a rate it cannot know.
- **A Liquid form cannot carry a file, and neither can a WhatsApp deep link.** Brief
  §9.6 asks the quote form for "Upload Design / Reference jika memungkinkan" and it
  is not possible down either route: `wa.me` takes text only, and Shopify's contact
  form tag accepts no file input. Rather than drop the requirement silently, the
  note under the fields says to send the reference in the chat that just opened. A
  real upload needs the Shopify Forms app, and that **replaces** `quote-form.liquid`
  rather than extending it — the app renders its own markup.

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
dropped the category mosaic while `app/page.tsx` still renders it, and its hero
leads with the polaroids while `components/home/hero-carousel.tsx` still leads
with the order-notes card.

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
| **The studio's WhatsApp number** | **The B2B route's single point of failure.** Blank in Theme settings → Custom & business, deliberately, 2026-08-31. `quote-form.liquid` renders at full size with a disabled submit and an alert saying the number is not set. Nothing else on `/pages/custom` converts until it is filled in |
| **Per-product Shopee URLs** | `custom.shopee_url` is undefined and `shopee_shop_url` is blank, so "Buy on Shopee" does not render at all. The decision taken was per-product URLs with the shop URL as a fallback; start with the eleven design pieces, which are the only ones carrying photography |
| **Contact details** — email, studio address, opening hours | Placeholder blocks on `templates/page.contact.json`, by instruction 2026-08-31. Each renders a labelled placeholder at final size. The address one also waits on the Bandung/Bekasi question below |
| **B2B photography** | None exists. `custom-band` and all three `custom-services` cards draw labelled placeholders at final size, by instruction 2026-08-31. Brief §7 wants "foto actual project Wear Label" and inventing one is out |
| **The category taxonomy, and therefore the collections** | Decided in principle 2026-08-31 — follow the brief, garment in `product_type`, cut moved to tags — and **not yet executed on the store**. Until it is: `/collections` renders its own "no collections yet" notice and `category-mosaic` stays off the home page. See [The catalogue](#the-catalogue) for the two axes that have to be merged |
| **Selected Projects** | **Not built for v1, decided 2026-08-31.** Brief §8 and §9.3 want a portfolio and forbid inflating it; there are no project photographs and no nameable clients, so there is no section rather than an empty one. When there are projects it wants a `project` metaobject (client, category, photographs, short description) so the studio adds them in the admin |
| Social handles | The footer has four label/URL pairs — Instagram, Shopee, TikTok and a spare — and every URL is blank, so no social link renders. Brief §19 names the three |
| The unbuilt footer destinations (The studio, Journal, FAQ, Order tracking, Wishlist, Contact us, Returns & refunds, Size guide, Terms) | Nine of twelve footer entries have no URL and render as plain text, never as a 404 link. Add the URL in the theme editor when the page exists |
| A review system | The design's star rating is still deliberately absent — a fabricated score is the one placeholder that cannot be labelled as one. Real quotations are a separate matter and are live in the voices wall; there is no feed behind them, so new reviews mean editing the section's blocks |
| Whether the studio ships from Bandung or Bekasi | The hero's order-notes card says "Pengiriman dari Kota Bekasi"; the footer note says the studio is in Bandung. Both are live. Nothing picks a side |
| The store's own domain | `kbysza-bk.myshopify.com` until a domain is connected |
| Whether the storefront password comes off | The theme is live; the password is what is still keeping the store private. Taking it off is the actual launch decision now, not publishing |

**Answered, and recorded so it is not reopened:**

- ~~Search~~ — **built, 2026-08-31**, because brief §5 asked for it. The header mark
  is a link to `/search` and `sections/main-search.liquid` is a real page rather than
  an overlay: a page has a URL, works with script off, and does not put a second
  focus trap in a header that already has a disclosure. Results are restricted to
  products because the theme has no card for a page or article result.
- ~~Which pieces are made to order~~ — **none, 2026-08-20. The studio does not offer
  the service.** Every "Start an order" link is off the page and the `/shop` "Made to
  order" filter row that counted zero is gone. **The brief's B2B custom apparel is a
  different service and does not reopen this** — bulk production for an organisation,
  not one garment cut for one shopper. The made-to-order section is no longer in the
  repo at all; `sections/category-mosaic` is, and is unplaced for a data reason
  rather than a promise reason.
- ~~Whether the site is a till or only a credibility surface~~ — **both, 2026-08-31.**
  Brief §19 makes web checkout, payment and shipping Must Have for B2C, and the
  client's own note adds a Shopee hand-off beside it rather than instead of it. The
  gateway and the courier app are still unchosen, so the till is not open yet — but
  the site is no longer *only* a shop window, and PRODUCT.md has been changed to say
  so.
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
