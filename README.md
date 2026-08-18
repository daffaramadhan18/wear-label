# Wear Label

Company profile + product catalogue + commerce storefront for **Wear Label**, a
slow-fashion apparel house in Bandung, Indonesia. Custom Next.js frontend on top
of Shopify as the commerce engine.

See [`CLAUDE.md`](./CLAUDE.md) for the architecture and the responsibility split
between this repo and Shopify admin.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

---

## What is built

**Phase 1 — landing page.** Complete and verified: `npm run build`, `npm run
lint` and `tsc --noEmit` all pass clean.

| Section | Component |
| --- | --- |
| Announcement strip | `components/layout/announcement-bar.tsx` |
| Header + mobile menu | `components/layout/site-header.tsx` |
| Hero | `components/home/hero.tsx` |
| Trust strip | `components/home/values.tsx` |
| Featured products | `components/home/featured-collection.tsx` |
| Brand story | `components/home/story.tsx` |
| Materials | `components/home/materials.tsx` |
| Craft process | `components/home/process.tsx` |
| Collections | `components/home/collections.tsx` |
| Lookbook grid | `components/home/lookbook.tsx` |
| Wearer notes | `components/home/notes.tsx` |
| Newsletter | `components/home/newsletter.tsx` |
| Footer | `components/layout/site-footer.tsx` |

Plus a branded `app/not-found.tsx`, `app/robots.ts` and `app/sitemap.ts`.

**Not built yet:** `/shop`, `/collections/*`, `/lookbook`, `/cart` and the
content pages linked from the footer. The landing page links to them and the 404
page catches them until they exist.

---

## Design system

Direction: **muted earthy / handmade warmth** — terracotta, sand, warm clay and
olive over soft cream, with a faint grain texture and organic radii.

Every design value lives in **[`app/tokens.css`](./app/tokens.css)** — one file,
two layers:

- `:root` holds raw brand primitives (`--wl-*`). Never referenced from JSX.
- `@theme` holds semantic tokens, which Tailwind v4 turns into utilities
  (`bg-canvas`, `text-ink-muted`, `font-display`, `py-section`, `rounded-lg`).

Replacing the palette is one edit to that file. No component contains a
hardcoded colour, font, radius, spacing or duration.

**Type:** Fraunces (display, variable, `SOFT` + `opsz` axes) + Instrument Sans
(body, variable), both self-hosted via `next/font` — no runtime request to
Google, no layout shift.

**Contrast:** every foreground/background pair in use is verified against WCAG
2.2 AA and the ratio is noted inline in the token file. Two constraints worth
knowing before you edit colours:

- `--wl-terracotta-400` (`#c67b5c`) is a **fill only** — 2.9:1 on cream, so it
  must never carry text or a control boundary on a light surface. Use
  `text-ink-accent` for terracotta-coloured text.
- `--color-hairline` is decorative. Control boundaries (inputs, outline buttons)
  use `--color-line`, which clears 3:1.
- The focus ring is surface-dependent. Clay is only 2.6:1 on the dark band, so
  any dark surface must carry the `wl-on-dark` class, which re-points
  `--color-focus` at `--color-focus-invert` (9.8:1). Add it to any new dark
  section or the focus indicator will be invisible there.

Interactive states are token-driven too: hover *and* a distinct pressed state
(`--color-primary-active` / `--color-secondary-active`) so touch users, who never
see hover, still get confirmation. Press feedback is colour, never a transform,
so it cannot shift layout.

The header is sticky, so `html` carries `scroll-padding-top` derived from
`--header-height`. Anything scrolled to by an anchor or by keyboard focus clears
the header instead of landing underneath it (WCAG 2.2 AA, Focus Not Obscured). If
the header's height changes, update `--header-height`.

**Motion:** subtle tier, **zero JavaScript**. Scroll reveals use CSS
scroll-driven animations (`animation-timeline: view()`). Browsers without support
render the final state, so content is always visible to users, crawlers and
no-JS clients — there is no hidden-by-default state. Everything is wrapped in
`prefers-reduced-motion: no-preference`.

Light mode only, by decision. Tokens are semantic, so a dark theme is a token
addition rather than a component rewrite.

---

## Data layer

All Shopify access goes through **`lib/shopify/`** and nothing else. Components
call `getFeaturedProducts()` / `getCollections()` — they never see GraphQL.

Today those resolve from typed fixtures in `lib/shopify/fixtures.ts`. Types
mirror real Storefront API shapes (`Money.amount` as a string, `priceRange
.minVariantPrice`, `handle`), and every accessor is `async`, so swapping in a
live client needs no call-site changes.

Going live is an environment change:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...   # public Headless-channel token
NEXT_PUBLIC_SITE_URL=https://wearlabel.example   # used by metadata/sitemap
```

If those Shopify variables are set while the live client is still unimplemented,
`lib/shopify/` throws with instructions rather than silently serving mock data
from a production deployment.

Marketing and company-profile copy lives in `lib/content/site.ts` — one typed
module, ready to move to Shopify Metaobjects or a CMS without touching
components. **The copy in there is placeholder.**

---

## Photography

No photography has been supplied, so every image renders a token-styled
placeholder at the exact aspect ratio the real photo will have. Layout is already
final — dropping files in causes no reflow (CLS stays 0).

To go live with imagery, add the file and set the `url` next to the matching
comment marker:

| File | Ratio | Set url in |
| --- | --- | --- |
| `public/home/hero.jpg` | 1200×1400 | `app/page.tsx` → `HERO_IMAGE` |
| `public/home/workshop.jpg` | 1200×1500 | `app/page.tsx` → `STORY_IMAGE` |
| `public/products/tenun-overshirt.jpg` | 1200×1500 | `lib/shopify/fixtures.ts` |
| `public/products/kalim-linen-shirt.jpg` | 1200×1500 | `lib/shopify/fixtures.ts` |
| `public/products/sore-wide-trouser.jpg` | 1200×1500 | `lib/shopify/fixtures.ts` |
| `public/products/ombak-knit-tee.jpg` | 1200×1500 | `lib/shopify/fixtures.ts` |
| `public/products/rimba-field-jacket.jpg` | 1200×1500 | `lib/shopify/fixtures.ts` |
| `public/products/pagi-cotton-dress.jpg` | 1200×1500 | `lib/shopify/fixtures.ts` |
| `public/collections/dry-season.jpg` | 1600×1067 | `lib/shopify/fixtures.ts` |
| `public/collections/everyday-weave.jpg` | 1600×1067 | `lib/shopify/fixtures.ts` |
| `public/collections/the-last-lot.jpg` | 1600×1067 | `lib/shopify/fixtures.ts` |
| `public/lookbook/01.jpg` | 1200×1500 | `components/home/lookbook.tsx` |
| `public/lookbook/02.jpg` | 1200×900 | `components/home/lookbook.tsx` |
| `public/lookbook/03.jpg` | 1200×900 | `components/home/lookbook.tsx` |
| `public/lookbook/04.jpg` | 1200×1500 | `components/home/lookbook.tsx` |

There is also no logo file. The wordmark in `components/layout/wordmark.tsx` is
set in the display face rather than a placeholder graphic, because inventing a
logo would bake a brand decision into code.

Once real photos land, an Open Graph image should be added — the metadata in
`app/layout.tsx` is otherwise complete.

---

## Known gap

`lib/content/newsletter.ts` is a **stub**. It resolves successfully so the
designed happy path is testable, and warns in the console. Wire it to a real list
provider before launch.

---

## Still undecided

Per `CLAUDE.md`, these are open and must not be guessed at in code:

- Real brand copy, product names and photography (everything shipped is placeholder)
- Whether company-profile content stays in-repo or moves to a CMS / Metaobjects
- Whether customer accounts are needed, or guest checkout is sufficient
- Which payment gateway (Shopify Payments is unavailable in Indonesia)
