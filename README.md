# Wear Label

Company profile, product catalogue and storefront for **Wear Label** — an apparel
brand in Bandung, Indonesia. A custom Next.js frontend on top of Shopify as the
commerce engine.

```bash
npm install
npm run dev      # http://localhost:3000
```

| | |
|---|---|
| **Stack** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion |
| **Commerce** | Shopify Storefront + Cart API — *not connected yet*, typed fixtures stand in |
| **Deploy** | Vercel, source on GitHub |
| **Design** | Ported from two Claude Design documents — see [Design](#design) |

[`CLAUDE.md`](./CLAUDE.md) is the working document: architecture, conventions, the
data-layer API, the catalogue table and every decision that has been made or
deliberately deferred. This file is the tour.

---

## What is built

Six routes. Every screen in the approved design exists and works.

| Route | What it is |
|---|---|
| `/` | Hero carousel, new arrivals, customer voices wall, category mosaic, service band, Instagram strip |
| `/shop` | Catalogue — campaign banner, promo tiles, filter rail (category · size · colourway · made-to-order), sort, 3-up grid, paging |
| `/shop/[handle]` | Product — gallery, size and colourway, quantity, add to bag, tabs, related pieces |
| `/cart` | Bag — lines, quantity, removal, order summary, hand-off to Shopify checkout |
| `/about` | About Us — company profile |
| `/account` | My Account — route and layout only, no auth |

Plus a branded 404. One component from the design (`promo-band`) is built and kept but
not placed on the home page — putting it back is an edit to `app/page.tsx` alone.

`made-to-order` is built and kept but must **not** be put back: the studio does not
offer that service, so every line of that band is a promise nobody can keep. The
mosaic and the service band moved below the voices wall to fill the slot it held.
[`PRODUCT.md`](./PRODUCT.md) records the decision and the customer evidence behind it.

**41 components, 13 of them client-side.** Everything else is server-rendered,
including every product card body, the whole filter rail, every row of the bag and
both marquees.

---

## What is *not* built, and why

Three gaps, all deliberate. None of them is a TODO you should fill in by guessing.

**1. Shopify is not connected.** There are no credentials, so there is no GraphQL
client. `lib/shopify/` returns typed fixtures shaped exactly like Storefront API
responses. Going live is an environment change:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...   # public Headless-channel token
```

Set those two and every read throws a loud `notImplemented` error instead of quietly
serving mock data from a deployment that was configured to be real. That is the
signal to write the client — inside `lib/shopify/`, nowhere else.

**2. Marketing copy is empty.** Brand voice is not settled, so every non-product
string in [`lib/content/site.ts`](./lib/content/site.ts) is `""`, as are the
per-product `description` and `care` fields.

An empty string is a **valid state**, not a bug: `components/ui/copy.tsx` renders a
labelled placeholder block sized in `em`, so a heading placeholder is heading-sized
and a caption placeholder caption-sized. The layout is already the final one —
filling in that module replaces every block with text, with no component change and
no layout shift. Images behave the same way: a null `url` renders a labelled box at
the real aspect ratio, so CLS stays 0 either way.

**3. Roughly a dozen decisions.** Payment gateway, whether accounts exist, which
pieces are made to order, whether the studio ships from Bandung or Bekasi, and so on.
All of them are listed in CLAUDE.md's *Still open* table with what the code does
meanwhile.

### The rule that shapes all of it

**Never invent commerce data.** No fabricated shipping rate, review count, stock
number, countdown or discount depth — not even as placeholder polish. Where a number
cannot be known the UI says where it comes from ("Calculated at checkout") or the
block hides itself. That is why the design's star rating and its "Up to 40% off" tile
are absent, and why no piece is flagged made-to-order.

Quoting a customer is not inventing one: the voices wall carries twenty real Shopee
reviews verbatim, in Indonesian, because reproducing what someone wrote is not the
same as synthesising a score.

---

## The catalogue is real

Eleven pieces, from the client's own catalogue via the design project: real names,
materials, prices, four markdowns, three new flags, and one square garment photograph
each in `public/products/`, named by handle.

| | |
|---|---|
| Pieces | 11 — culottes and trousers, Rp 159.000 – Rp 199.000 |
| Sizes | XS · S · M · L · XL |
| Colourways | Cream · Camel · Taupe · Sage · Espresso |
| Variants | 25 per piece (size × colourway) |
| Categories | Wide leg 8 · Culottes 2 · Straight cut 1 |

The full table is in CLAUDE.md. Two honest caveats: **stock is not modelled** (every
variant reads as available — the sold-out states are built and wait for Shopify), and
**`productType` is derived**, from each piece's name where the name states the cut and
from its garment shot where it does not, because Shopify product types do not exist
yet.

---

## Data layer

All Shopify access goes through **[`lib/shopify/`](./lib/shopify)**. Components never
call the Storefront API and never import GraphQL documents.

| File | Role |
|---|---|
| `index.ts` | The barrel — `getAllProducts`, `getFeaturedProducts`, `getProductByHandle`, `getRelatedProducts` |
| `types.ts` | Storefront API shapes. `Image.url` is nullable for the slots with no photography yet |
| `fixtures.ts` | The catalogue. Deleted when the store goes live |
| `catalogue.ts` | Filtering, sorting, facets, paging, `catalogueHref` |
| `vocabulary.ts` | `TAGS` and `COLOURWAYS` — the strings the data layer and the UI must agree on |
| `cart.ts` | The bag. Server-only: it reads a cookie |
| `actions.ts` | Server Functions — the only thing that writes the cart cookie |
| `env.ts` · `money.ts` · `form-state.ts` | Live-mode guard · `Intl` money formatting · form result type |

Two patterns worth knowing before you touch a page:

**The URL is the state.** Every catalogue filter is a *link* that flips one facet and
preserves the rest; sort is a plain `GET` form. No client-side filtering, no state to
keep in step with the URL, and the result is shareable and back-button friendly. Once
the store is live the same query becomes Storefront API arguments.

**The bag lives in a cookie, then in Shopify.** `cart.ts` holds lines in `wl_cart`
until Shopify holds them, and it is the only place any price arithmetic is allowed —
because it is the part `cart.cost` replaces. Writes happen in Server Functions, never
during render, because a cookie cannot be set while rendering.

---

## Design

Ported from two documents in the Claude Design project
[`bf11a0f4`](https://claude.ai/design/p/bf11a0f4-4b1c-400b-802c-b9c9c2d66673), both
derived from the client's brand guideline and catalogue upload:

- **`Wear Label Design System.html`** — the authority for colour, type, radius,
  spacing, shadow and motion. Ported into [`app/tokens.css`](./app/tokens.css).
- **`Wear Label Storefront.dc.html`** — the approved screens (home, shop, product,
  bag). Ported into the routes and components.

### Tokens

One file, two layers. `:root` holds the brand primitives (`--wl-*`, never referenced
from JSX); `@theme` holds the semantic tokens Tailwind turns into utilities.

| | |
|---|---|
| Palette | Taupe ramp 100–900 (`#725E4C` brand · `#9C8166` camel · `#DFD0C4` sand · `#1E1A16` espresso), blush and sage ramps, three rule weights, rust for errors |
| Shell | **White page, cream bands.** Cream fills things *on* the page — the hero panel, chips, inputs, review cards. Paint the shell cream and all of those flatten into it |
| Type | Playfair Display (editorial) + Poppins (interface), self-hosted via `next/font`. Display 64 · H1 44 · H2 30 · H3 20 · Body 16 · Small 14 · Label 12 · Micro 11 |
| Geometry | Radius 0 / 3px / pill — pills only for badges and chips. 8pt spacing, sections 80–96px, 1240px measure, 76px sticky header |
| Elevation | Warm-toned shadows only, never neutral grey |

No component contains a hardcoded colour, font, radius, spacing or duration, so the
palette is replaceable in one edit. Motion values are mirrored in
`components/motion/tokens.ts`, because Motion needs numbers rather than `var()`
strings — change one, change the other.

### Assets

Everything in `public/` came out of the design project byte-exact: 11 catalogue
photographs, 7 logotype files (`wordmark`, `stacked`, `mark`, each with a cream
variant), the two hero slides, and the monogram as the favicon. The logotype is drawn
artwork and is **never** set in a typeface — `components/layout/wordmark.tsx` renders
the file, and swaps to the cream artwork on dark surfaces rather than filtering it.

The icon set lives inline in `components/ui/icons.tsx`, with path data copied verbatim
from the design's SVGs.

### Accessibility

Part of the design, not a pass afterwards: one `h1` per page with no skipped levels,
44px minimum control height, focus never removed, sticky-header scroll padding so a
focused target is never obscured, and **colour never carries meaning alone** — sold
out says "Sold out", an applied filter carries `aria-current`, a toggle carries
`aria-pressed`.

Four contrast pairs in the brand palette fall short of WCAG 2.2 AA. They are
implemented as specified — the brand system is the authority — and each one is
annotated with its measured ratio and its one-line remedy at the top of
`app/tokens.css`. The focus ring is the one place the design was extended rather than
followed: its camel ring is 1.92:1 on cream, so a 1px brand-taupe inner edge was added
to keep the indicator perceivable.

### Motion, and the performance rules behind it

Reveals and staggered grids use Motion; the three continuous background loops (aurora
wash, Instagram marquee, voices wall) are pure CSS and cost no JavaScript.

Two rounds of visible stutter produced three rules, and they are not negotiable:

1. **A continuous loop animates `transform` or `opacity`, nothing else.** Anything
   else repaints on the main thread every frame. A 36-strand line-art wash was deleted
   for exactly this, and the aurora translates an oversized layer rather than sliding
   a background. `background-attachment: fixed` is banned outright.
2. **Never wrap a 3D scene or a blended layer in something that animates opacity.** It
   becomes a stacking context, which flattens `preserve-3d` and makes `mix-blend-mode`
   blend against the wrapper instead of the page — a hard edge on the voices wall and
   a visible rectangle on the aurora band.
3. **Skip what is off screen.** `content-visibility: auto` on the heavy scenes, scoped
   to the breakpoint where their height is known.

`prefers-reduced-motion` does more than pause: the Instagram strip becomes a
scrollable rail and the voices wall drops its tilt and duplicates to become a plain
grid, because a frozen tilted wall holds most of its reviews outside the stage.

---

## Platform constraints

Fixed properties of Shopify in this market. Design around them; do not retry them.

- **Shopify Payments is unavailable in Indonesia.** A third-party gateway is required,
  and Shopify adds a transaction fee on top of the gateway's when Payments is not used.
- **A custom checkout UI requires Shopify Plus.** Below that, checkout is
  Shopify-hosted — which is why the bag has no shipping selector and no address
  fields, and why its total equals its subtotal.
- **JNE, J&T and SiCepat are not native to Shopify.** They need a RajaOngkir/Biteship
  app that quotes rates *during* checkout, so the bag says "Calculated at checkout"
  rather than showing a rate it cannot know.
- **Discount codes are validated by Shopify**, so the promo field reports that it is
  not connected yet instead of pretending to apply anything.

---

## Repo layout

```
app/                Routes, root layout, tokens.css + globals.css
components/ui/      Primitives — button, badge, alert, media, price, copy, section,
                    container, breadcrumbs, icons, aurora, save-button, notice-form
components/layout/  Announcement bar, header, cart badge, footer, wordmark
components/home/    Hero carousel, promo band, countdown, category mosaic,
                    service band, made-to-order, Instagram strip, testimonial wall
components/shop/    Product card, catalogue filters, results toolbar, pagination,
                    shop promos, card hover
components/product/ Gallery, purchase block, tabs
components/cart/    Bag lines, order summary
components/motion/  Reveal, Stagger, page transition, motion tokens
lib/content/        Site copy — one module
lib/shopify/        The only place Shopify is touched
public/brand/       Logotype artwork
public/products/    Catalogue photography
public/home/        Hero artwork
.design-sync/       Config for syncing components to claude.ai/design
graphify-out/       Generated knowledge graph (gitignored)
```

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm start          # serve the build
npm run lint       # eslint
npx tsc --noEmit   # types only
npx next typegen   # regenerate route types after adding a route
graphify update .  # refresh the code graph after changing code
```

## Working on this repo

Verify before you commit (`tsc --noEmit`, `lint`, `build`), commit straight onto
`main`, push. No feature branches, no uncommitted leftovers, nothing unpushed. Commit
messages carry the reasoning, not just the change — the next person's first question
is always "why is it like this". The long form is in CLAUDE.md under *Working
agreement*.
