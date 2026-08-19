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

Every design value lives in **[`app/tokens.css`](./app/tokens.css)** — one file,
two layers:

- `:root` holds raw primitives (`--wl-*`). Never referenced from JSX.
- `@theme` holds semantic tokens, which Tailwind v4 turns into utilities
  (`bg-canvas`, `text-ink-muted`, `font-display`, `py-section`, `rounded-pill`).

No component contains a hardcoded colour, font, radius, spacing or duration, so
replacing the palette or the type pairing is one edit to that file. Brand identity
is undecided; what is there is a quiet warm-neutral set, sized to be replaced
wholesale. Foreground/background pairs are annotated with their WCAG 2.2 AA
contrast ratios — re-verify a pair if you change its value.

Accessibility baseline: single `h1` per page with no skipped levels, 44px minimum
control height, visible focus never removed, sticky-header scroll padding so
focused targets are never obscured, sold-out state stated in words rather than by
colour alone.

---

## Repo layout

```
app/               Routes, root layout, tokens.css + globals.css
components/ui/     Primitives — copy (placeholder), button, media, price, section, container, icons
components/layout/ Header, footer, wordmark
components/shop/   Product card, catalogue filters
lib/content/       Site copy (empty)
lib/shopify/       The only place Shopify is touched
public/            Static assets (home/, products/ — empty until photography exists)
```
