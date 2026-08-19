# Wear Label

Company profile + product catalogue storefront for **Wear Label**. Custom Next.js
frontend on top of Shopify as the commerce engine.

See [`CLAUDE.md`](./CLAUDE.md) for the architecture and the responsibility split
between this repo and Shopify admin.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

---

## Scope

Four pages, nothing else. Everything a brand storefront usually accumulates
(lookbook, collections, craft/materials pages, testimonials, newsletter,
announcement bar, cart, legal and help pages) is deliberately absent.

| Route | What it is |
| --- | --- |
| `/` | Home — hero + four products, leading into the shop |
| `/shop` | Catalogue with filters (category, size, availability) and sort |
| `/shop/[handle]` | Product detail — image, name, price, sizes, description |
| `/about` | About Us — company profile |
| `/account` | My Account — route + layout only, no auth (see below) |

Plus `app/not-found.tsx` for anything else.

**No cart, no checkout, no add-to-cart.** Cart and checkout belong to Shopify and
are not part of this build.

**No auth on `/account`.** Whether customer accounts are used at all (versus guest
checkout) is undecided, and customer records live in Shopify either way — so the
page reserves the route and the layout without committing to an approach.

---

## All copy is intentionally empty

Brand voice, tone, product names and pricing are not decided, so nothing is
invented in code.

- **[`lib/content/site.ts`](./lib/content/site.ts)** — every marketing string is
  `""`. Interface chrome that is not brand copy (*Filters*, *Apply*, *Sort*,
  *Sold out*, the four nav labels) is spelled out in the `ui` and `nav` exports.
- **[`lib/shopify/fixtures.ts`](./lib/shopify/fixtures.ts)** — product titles,
  descriptions, image URLs and prices are empty or null. Only two fields carry
  values, because the filter UI is unusable without them: `productType`
  (`Category 1`…, numbered stand-ins) and the `Size` values (XS–XL).

Wherever text belongs, [`components/ui/copy.tsx`](./components/ui/copy.tsx)
renders a labelled placeholder block sized in `em`, so a heading placeholder is
heading-sized and a caption placeholder caption-sized. The layout is therefore
already the final one: **filling in the two files above replaces every block with
text, with no component change and no layout shift.** Images behave the same way —
a null `url` renders a labelled box at the real aspect ratio (CLS stays 0).

---

## Data layer

All Shopify access goes through **[`lib/shopify/`](./lib/shopify)**; components
never call the Storefront API and never import GraphQL documents.

| File | Role |
| --- | --- |
| `index.ts` | The only entry point. `getAllProducts`, `getFeaturedProducts`, `getProductByHandle` |
| `types.ts` | Storefront API shapes, with nullable image url + price while catalogue data is pending |
| `fixtures.ts` | Typed mock catalogue — deleted when the store goes live |
| `catalogue.ts` | Filter/sort/facets. In-memory today, Storefront query arguments later |
| `money.ts` | `Intl` money formatting |

Every function is async, so going live is an environment change:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...   # public Headless-channel token
```

Until the live client is written, setting those variables throws a clear error
rather than silently serving mock data from a deployment configured to be real.

**Filter state lives entirely in the URL.** `/shop` is a Server Component that
reads `searchParams`; the filter form is a plain `GET` form with native controls —
no `"use client"`, no JavaScript, shareable and back-button friendly. The only
client component in the app is the header's mobile menu disclosure.

---

## Design system

Ported from the **Wear Label Design System** (Claude Design project
`bf11a0f4-4b1c-400b-802c-b9c9c2d66673`, `Wear Label Design System.html`). Colour,
type, radius, spacing, shadow and motion values come from that document.

Everything resolves through **[`app/tokens.css`](./app/tokens.css)** — one file,
two layers:

- `:root` holds the brand primitives (`--wl-*`): taupe ramp 100–900, blush ramp,
  sage ramp, the three rule weights, rust for errors, inert fills for disabled and
  unavailable states. Never referenced from JSX.
- `@theme` holds semantic tokens, which Tailwind v4 turns into utilities
  (`bg-canvas`, `text-ink-subtle`, `font-display`, `text-display`, `tracking-label`,
  `rounded-sm`, `py-section`).

| From the system | Here |
| --- | --- |
| Label Taupe `#725E4C`, Camel, Sand, Cream, Espresso | `--color-brand`, `--color-ink-subtle`, `--color-line`, `--color-canvas`, `--color-ink` |
| Playfair Display (editorial) + Poppins (interface) | `next/font/google`, self-hosted, `--font-display` / `--font-body` |
| Display 64 · H1 44 · H2 30 · H3 20 · Body 16 · Small 14 · Label 12 · Micro 11 | `--text-display` … `--text-micro` (fluid at the display end) |
| Radius 0 / 3 / pill — pills only for badges and filter chips | `--radius-sm: 3px`, `--radius-pill` |
| 8pt spacing, sections 80–96 | `--spacing-*`, `--spacing-section` |
| Warm-toned shadows, never neutral grey | `--shadow-sm/md/lg` |
| Buttons: uppercase 0.2em, one primary per screen | [`components/ui/button.tsx`](./components/ui/button.tsx) — `primary`, `outline`, `ghost`, `link`, `checkout` × `sm`/`md`/`lg`/`full` |
| Badges, alerts, product card, breadcrumb, size chips, filter chips | `components/ui/badge.tsx`, `alert.tsx`, `components/shop/*`, `app/shop/[handle]/page.tsx` |

No component contains a hardcoded colour, font, radius, spacing or duration.

### Two things to know

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
focused targets are never obscured, sold-out state stated in words rather than by
colour alone.

---

## Repo layout

```
app/               Routes, root layout, tokens.css + globals.css
components/ui/     Primitives — copy (placeholder), button, badge, alert, media, price, section, container, icons
components/layout/ Header, footer, wordmark
components/shop/   Product card, catalogue filters
lib/content/       Site copy (empty)
lib/shopify/       The only place Shopify is touched
public/brand/      Logotype artwork — wordmark, stacked and monogram lockups
public/            Static assets (home/, products/ — empty until photography exists)
```
