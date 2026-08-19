# Wear Label

Company profile + product catalogue + commerce storefront for **Wear Label**. Custom
Next.js frontend on top of Shopify as the commerce engine.

See [`CLAUDE.md`](./CLAUDE.md) for the architecture, the responsibility split between
this repo and Shopify admin, and the list of decisions that are still open.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

---

## Scope

Six routes, built from the approved storefront design.

| Route | What it is |
| --- | --- |
| `/` | Home — hero carousel, limited-run band, new arrivals, category mosaic, service band, made-to-order band, Instagram strip |
| `/shop` | Catalogue — campaign banner, promo bands, filter rail (category, size, colourway, availability), sort, 3-up grid, paging |
| `/shop/[handle]` | Product — gallery, size + colourway pickers, quantity, add to bag, Details/Fabric&care/Shipping tabs, related row |
| `/cart` | Bag — lines with quantity and remove, order summary, hand-off to Shopify checkout |
| `/about` | About Us — company profile (copy not written) |
| `/account` | My Account — route + layout only, no auth (see below) |

Plus `app/not-found.tsx` for anything else. Every route renders dynamically, because
the header reads the bag cookie.

**The bag is real; checkout is Shopify's.** Add to bag, quantity, remove and the
header count all work. Checkout is a redirect to `cart.checkoutUrl` — a custom
checkout UI needs Shopify Plus — so the action is visibly disabled with the reason
beside it until a store is connected.

**No auth on `/account`.** Whether customer accounts are used at all (versus guest
checkout) is undecided, and customer records live in Shopify either way — so the page
reserves the route and the layout without committing to an approach. For the same
reason "Save for later" is `localStorage` only and never leaves the browser.

---

## Where the content comes from

Two files in Claude Design project `bf11a0f4-4b1c-400b-802c-b9c9c2d66673`, both
derived from the client's `BRAND GUIDELINE.pdf` and `Katalog Baju` upload:

- **`Wear Label Design System.html`** → `app/tokens.css` and the component vocabulary.
- **`Wear Label Storefront.dc.html`** → the routes, the copy in
  [`lib/content/site.ts`](./lib/content/site.ts), and the catalogue in
  [`lib/shopify/fixtures.ts`](./lib/shopify/fixtures.ts) (11 pieces: names,
  materials, IDR prices, 20% markdowns, new / made-to-order tags, and 5 sizes ×
  5 colourways = 25 variants each).

### What is still blank, and why

Nothing is invented in code. Where a decision has not been made, the slot is empty
and renders a labelled placeholder — [`components/ui/copy.tsx`](./components/ui/copy.tsx)
sizes the block in `em`, so a heading placeholder is heading-sized and a caption
placeholder caption-sized. **The layout is therefore already the final one:** filling
in the string replaces the block with text, with no component change and no layout
shift. Images behave the same way — a null `url` renders a labelled box at the real
aspect ratio (CLS stays 0).

| Blank | Where |
| --- | --- |
| Catalogue photography — 11 `.webp` files | [`public/products/README.md`](./public/products/README.md) lists the filenames and the single flag to flip |
| Hero and shop-banner photography | `HERO_IMAGES` in `components/home/hero-carousel.tsx`, `BANNER` in `app/shop/page.tsx` |
| Per-product Details and Fabric & care copy | `description` / `care` in `fixtures.ts`. The design reused one generic paragraph for all eleven pieces; it states a wrong inseam and a wrong fabric on most of them |
| About Us, My Account and 404 copy | `lib/content/site.ts` |
| Limited-run end date | `home.promo.endsAt` — empty, so the countdown hides. The component is real |
| Social handles, and nine unbuilt footer destinations | `footer.socials` and `footer.columns` — an entry with no `href` renders as plain text, never as a 404 link |

Deliberately absent rather than blank: the design's star rating (no review system —
fabricated social proof is the one placeholder that cannot be labelled as one), its
search mark (no search), its "Up to 40% off" tile (the catalogue's markdowns are 20%)
and its shipping selector (Indonesian couriers quote rates inside Shopify's checkout).

---

## Data layer

All Shopify access goes through **[`lib/shopify/`](./lib/shopify)**; components never
call the Storefront API and never import GraphQL documents.

| File | Role |
| --- | --- |
| `index.ts` | Catalogue barrel — `getAllProducts`, `getFeaturedProducts`, `getProductByHandle`, `getRelatedProducts` |
| `cart.ts` | The bag. Imported directly, not via the barrel: it reads a cookie, so it is server-only |
| `actions.ts` | `"use server"` — the only thing that writes the bag cookie, plus the discount and newsletter forms |
| `form-state.ts` | The `FormNotice` shape both sides of the boundary need (a `"use server"` module may only export async functions) |
| `types.ts` | Storefront API shapes — `Money`, `Image`, `Product`, variants with `selectedOptions`, tags for the merchandising flags |
| `fixtures.ts` | Typed mock catalogue — deleted when the store goes live |
| `catalogue.ts` | Filter, sort, facets, paging and URL building. In-memory today, Storefront query arguments later |
| `money.ts` | `Intl` money formatting and the markdown percentage |
| `env.ts` | What "live" means, and the loud guard for the paths not written yet |

Every function is async, so going live is an environment change:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...   # public Headless-channel token
```

Until the live client is written, setting those variables throws a clear error rather
than silently serving mock data from a deployment configured to be real.

**The bag lives in one cookie.** In production that cookie holds the Shopify `cartId`
and every function in `cart.ts` becomes a Cart API call. Until then the same cookie
holds the mock bag itself, which is why the only price arithmetic in the repo is in
that file — it is precisely the part Shopify's `cart.cost` replaces.

**Filter state lives entirely in the URL.** `/shop` is a Server Component that reads
`searchParams`. Each filter is a *link* that flips one facet and preserves the rest,
so filtering needs no JavaScript and no submit step; sort is a plain `GET` form. The
client islands are the header's mobile disclosure, the hero carousel, the product
gallery, the purchase block, the product tabs, the save button, the notice forms and
the motion wrappers — nothing else.

---

## Design system

Ported from the **Wear Label Design System** (`Wear Label Design System.html` in the
Claude Design project above). Colour, type, radius, spacing, shadow and motion values
come from that document.

Everything resolves through **[`app/tokens.css`](./app/tokens.css)** — one file, two
layers:

- `:root` holds the brand primitives (`--wl-*`): taupe ramp 100–900, blush ramp, sage
  ramp, the three rule weights, rust for errors and markdowns, inert fills for
  disabled and unavailable states, plus the aurora gradient stops. Never referenced
  from JSX.
- `@theme` holds semantic tokens, which Tailwind v4 turns into utilities
  (`bg-canvas`, `text-ink-subtle`, `bg-sale`, `font-display`, `text-display`,
  `tracking-label`, `rounded-sm`, `py-section`).

| From the system | Here |
| --- | --- |
| Label Taupe `#725E4C`, Camel, Sand, Cream, Espresso | `--color-brand`, `--color-ink-subtle`, `--color-line`, `--color-canvas`, `--color-ink` |
| Playfair Display (editorial) + Poppins (interface) | `next/font/google`, self-hosted, `--font-display` / `--font-body` |
| Display 64 · H1 44 · H2 30 · H3 20 · Body 16 · Small 14 · Label 12 · Micro 11 | `--text-display` … `--text-micro` (fluid at the display end) |
| Radius 0 / 3 / pill — pills only for badges and filter chips | `--radius-sm: 3px`, `--radius-pill` |
| 8pt spacing, sections 80–96 | `--spacing-*`, `--spacing-section` |
| Warm-toned shadows, never neutral grey | `--shadow-sm/md/lg` |
| Buttons: uppercase 0.2em, one primary per screen | [`components/ui/button.tsx`](./components/ui/button.tsx) — `primary`, `outline`, `ghost`, `link`, `checkout` × `sm`/`md`/`lg`/`full` |
| Badges, alerts, product card, breadcrumb, size chips, filter chips | `components/ui/*`, `components/shop/*`, `components/product/*` |

No component contains a hardcoded colour, font, radius, spacing or duration.

### Three things to know

**The logotype is artwork, not type.** The system is explicit that the logotype is
drawn lettering and is never reset in a typeface. All seven files are imported from
the design project into `public/brand/`, and `components/layout/wordmark.tsx` renders
them with `next/image`:

| File | Use |
| --- | --- |
| `wordmark.png` / `wordmark-cream.png` | Horizontal lockup — the default everywhere |
| `stacked.png` / `stacked-cream.png` | Stacked lockup — narrow or square space |
| `mark.png` / `mark-cream.png` | Monogram — favicon, care labels, avatars |
| `wordmark-taupe.png` | Flat single-colour horizontal lockup |

The `-cream` variants are for espresso and taupe surfaces; `onDark` swaps the file
rather than filtering the image. `app/icon.png` and `app/apple-icon.png` are the
monogram composited onto cream `#FBF4EF`, replacing the stock Next.js favicon.

**The aurora is CSS, not a component library.** The design project shipped a React
aurora in `handoff/`; it is reimplemented as two classes in `globals.css` driven by
`--aurora-*` tokens, so it recolours with the palette. It runs behind the
made-to-order band, the bag summary and the footer — never behind photography or the
logotype. `prefers-reduced-motion` stops it and the Instagram marquee, which is why
that strip is `overflow-x: auto` rather than `hidden`.

**Three contrast pairs in the system fall short of WCAG 2.2 AA.** They are
implemented as specified — the brand system is the authority — and annotated at the
top of `tokens.css`:

| Pair | Ratio | Needed | Note |
| --- | --- | --- | --- |
| Camel `#9C8166` on cream | 3.36:1 | 4.5:1 small text | Used for 11–12px labels. One-line fix: point `--color-ink-subtle` at `#5F4E3C` (7.30:1) |
| Focus ring `#C9AF97` on cream | 1.92:1 | 3:1 | Ring colour kept; `globals.css` adds a 1px taupe inner edge (5.64:1) so it is perceivable |
| Hairlines `#DFD0C4` / `#EDDFD6` | 1.38:1 / 1.30:1 | 3:1 non-text | That near-invisible rule is the look; controls stay legible by their fill |

Disabled controls (`#B4A493` on `#EDE3DA`) are exempt from contrast minimums.

Accessibility baseline otherwise: single `h1` per page with no skipped levels, 44px
minimum control height, visible focus never removed, sticky-header scroll padding so
focused targets are never obscured, real ARIA tabs with arrow-key support, inactive
carousel slides `inert`, and **colour never carrying meaning alone** — sold out says
"Sold out", an applied filter link carries `aria-current`, a toggle carries
`aria-pressed`.

---

## Repo layout

```
app/                   Routes, root layout, tokens.css + globals.css
components/ui/         Primitives — copy (placeholder), button, badge, alert, media,
                       price, section, container, breadcrumbs, icons, aurora,
                       save-button, notice-form
components/layout/     Announcement bar, header, cart badge, footer, wordmark
components/home/       Hero carousel, promo band, countdown, category mosaic,
                       service band, made-to-order, Instagram strip
components/shop/       Product card, catalogue filters, results toolbar, pagination,
                       shop promos, card hover
components/product/    Gallery, purchase block, tabs
components/cart/       Bag lines, order summary
components/motion/     Reveal, Stagger, page transition, motion tokens
lib/content/           Site copy — the single content module
lib/shopify/           The only place Shopify is touched
public/brand/          Logotype artwork — wordmark, stacked and monogram lockups
public/products/       Catalogue photography — MISSING, see its README.md
public/home/           Editorial photography — empty
.design-sync/          Config for syncing components to claude.ai/design
```
