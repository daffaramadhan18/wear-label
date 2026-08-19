# design-sync notes — wear-label

Repo-specific gotchas for syncing this storefront to claude.ai/design.
Read this before re-running. Project:
`https://claude.ai/design/p/096a4d56-a7d8-49ce-9d7a-4fe26ac82b54`

## The core problem this setup solves

This repo is a Next.js **application**, not a published component library: no
`dist/`, no `.d.ts` tree, no Storybook, `private: true`, and 14 of the 21 synced
components import `next/link`, `next/image` or `next/navigation`. The converter
expects a package. So `.design-sync/setup-pkg.mjs` builds a disposable one under
`.ds-sync/pkg/` (entry, `next` shims, tsc declarations) and nothing in the app's
own `package.json` is bent for tooling.

**Always run `bash .design-sync/prepare.sh` before `package-build.mjs`.** It does
setup → fonts → Tailwind in that order, which matters because `setup-pkg.mjs`
wipes `.ds-sync/pkg/` — anything written there earlier disappears. Out of order
you get `! cssEntry: … not found` / `! extraFonts: … not found` and a silently
unstyled, fontless bundle that still exits 0.

## Gotchas, each of which cost a debugging cycle

- **Two tsconfigs, deliberately.** `tsconfig.json` (for tsc) maps `@/*` and
  `next/*`. `tsconfig.bundle.json` (for the converter, via `cfg.tsconfig`) maps
  **only `next/*`**. Do not add `@/*` to the bundle one: the converter's
  tsconfig-paths plugin runs before esbuild's own tsconfig discovery and tries
  bare `existsSync(stem)` before any extension, so `@/lib/shopify` — a directory
  with an `index.ts` — resolves to the directory and esbuild dies with
  `Cannot read file "lib/shopify": is a directory`. esbuild already resolves
  `@/*` correctly on its own by walking up to the app's tsconfig.
- **The `next/*` alias is load-bearing.** Node resolution walks up from each
  importing file, so `next/link` inside `components/ui/button.tsx` finds the app's
  REAL Next long before this package's `node_modules`. Without the alias the real
  Next gets bundled and every card throws
  `ReferenceError: process is not defined` (`process.env.__NEXT_*`), leaving
  `window.WearLabel` unassigned and all 21 exports missing.
- **Tailwind emits only what it SEES, and this is a design system.** Two separate
  fixes in `setup-pkg.mjs`, both silent when wrong:
  1. `@source` must include `.design-sync/previews/**` — a utility used only in a
     preview (`w-56`, `max-w-xl`) is otherwise never generated, so the class
     lands in the DOM with no rule and the card renders unconstrained.
  2. `@source inline(...)` safelists the whole token vocabulary plus a common
     numeric range, derived from `app/tokens.css` rather than hand-listed. The
     design agent writes NEW markup against these tokens and a rendered design
     receives only `styles.css`; before this, `shadow-md`, `bg-invert-hover`,
     `ease-entrance`, `text-ink-invert-muted` and plain `mt-8` did not exist.
- **`cfg.tokensGlob` does nothing without `cfg.tokensPkg`** (`copyTokens` returns
  early), and it must be a **string** — it is `.split('/')` internally, so an
  array silently no-ops. Hence the `node_modules/wear-label` self-symlink.
- **Fonts come out of `.next`.** `next/font/google` self-hosts Playfair Display
  and Poppins and injects `--font-playfair` / `--font-poppins` at runtime from a
  class on `<html>`. A card has neither, so without the harvest every component
  falls back to a system face — the tokens resolve but the inner variable is
  undefined. `harvest-fonts.mjs` reads `.next/static/chunks/*.css` (production
  only; `.next/dev/` still carries stale Fraunces and Instrument Sans faces from
  earlier iterations of this repo) and runs `npm run build` if that is missing.
- **`.d.ts` extraction drops real API in two ways.** `[DTS_STYLE_SYSTEM]` sees
  >15 CSS-shorthand-named props on `@types/react`'s HTML attributes and filters
  the whole inherited bag, which took `Button`'s `disabled` and `type`; and
  `^on[A-Z]` is filtered as an event handler, which took `Wordmark`'s `onDark`
  boolean. Domain types (`Product`, `Money`, `Image`, `CatalogueQuery`) live in
  `lib/shopify` and are not re-exported, so they emitted as undefined names.
  All of this is why `cfg.dtsPropsFor` covers 8 components — do not delete those
  entries thinking the extractor will now handle them.
- **Group names: the directory wins over frontmatter.** A doc's
  `category:` only applies when no directory group was derived, so
  `components/layout/**` and `components/shop/**` are stuck as `layout` and
  `shop`. Only `components/ui/**` (whose dir is treated as generic) honours the
  frontmatter — that is how `actions`, `feedback`, `icons`, `product`,
  `structure` and `typography` exist. The docs' frontmatter was aligned to what
  is actually achievable; do not "fix" it back.

## Playwright on this machine (WSL2)

The render check could not run at all, then could not screenshot:

1. `libnspr4`, `libnss3`, `libasound2` are absent system-wide, so Chromium would
   not start. `.ds-sync/pwlibs/` holds them, extracted **without root** via
   `apt-get download` + `dpkg-deb -x`.
2. Screenshots then hung for 30s and timed out under the default GPU path.
   `--disable-gpu --disable-software-rasterizer --in-process-gpu` fixes it.

Both are wrapped in `.ds-sync/chromium-wrapper.sh`, used via
`DS_CHROMIUM_PATH=.ds-sync/chromium-wrapper.sh` — no converter script is forked.
**The proper fix is `sudo apt-get install -y libnss3 libnspr4 libasound2t64`**,
after which the wrapper and `pwlibs/` can both be deleted. Both live in the
gitignored `.ds-sync/`, so a fresh clone or another machine must redo this.

## Preview copy — now out of date in a specific way

When these previews were authored, `lib/content/site.ts` was deliberately empty,
so they use plainly illustrative strings — "Linen shirt", "Shop all", "Featured
products" — chosen from the repo's own examples rather than invented as brand
voice. **That premise has changed:** the storefront design was imported and the
content module now carries approved copy, and `fixtures.ts` carries the real
eleven-piece catalogue with real names, materials and IDR prices.

So on the next authoring pass, replace the illustrative strings with the real
ones from those two modules — a preview showing "Linen shirt" next to a design
system whose catalogue says "Basic Linen Culotte" reads as a second, competing
source of truth. Keep the both-states-side-by-side pattern for the slots that are
still legitimately empty (About Us, My Account, 404, per-product details and
fabric care): there the placeholder IS the current behaviour.

## Re-sync risks — what can silently go stale

- **`.next` must exist and be current.** Fonts are harvested from a production
  build. If `app/layout.tsx` changes its font configuration and `.next` is stale,
  the sync ships the OLD faces without complaint. Re-run `npm run build` first
  when type has changed. `harvest-fonts.mjs` throws if a configured family has no
  `@font-face` at all, but cannot detect a merely outdated one.
- **The scratch package is machine-local and absolute-pathed.** `.ds-sync/pkg/`
  is gitignored and its generated `index.ts` and declarations embed absolute
  `/home/daffa/wear-label/...` paths. Always regenerate via `prepare.sh` rather
  than copying the directory between machines or clones.
- **Component scope lives in one place, and it is behind.** The `SURFACE` map in
  `.design-sync/setup-pkg.mjs` is the only list of what syncs. Adding a component
  to `components/` does **not** add it to the design system — add it to `SURFACE`
  too, or it is silently absent. `components/motion/*` (Reveal, Stagger,
  PageTransition, MotionProvider) is deliberately excluded: scroll- and
  route-triggered animation plumbing that cannot render statically.

  **`SURFACE` still lists exactly the 21 components it listed before the
  storefront import.** Missing, and each needing a preview as well as a map entry: `Aurora`/`AuroraBand`,
  `Breadcrumbs`, `SaveButton`, `NoticeForm`, `AnnouncementBar`, `CartBadge`,
  `HeroCarousel`, `PromoBand`, `Countdown`, `CategoryMosaic`, `ServiceBand`,
  `MadeToOrder`, `InstagramStrip`, `ResultsToolbar`, `Pagination`, `ShopPromos`,
  `ProductGallery`, `ProductPurchase`, `ProductTabs`, `CartLines`,
  `OrderSummary`. Several are `"use client"` with `useActionState` or a Server
  Function prop, so expect the shims in `setup-pkg.mjs` to need extending before
  they will bundle — that is the real work in closing this gap, not the map entry.
  The prop docs in `cfg.dtsPropsFor` for `Price`, `Media`, `ProductCard`,
  `CatalogueFilters` and `SiteHeader` were refreshed at import time and are current.
- **The `next` shims drift with Next.** They cover only what these components
  use: `Link`, `Image` (with `fill`), and `usePathname`. A component that starts
  using `useSearchParams` for real behaviour, `next/form`, or image `loader` will
  need the shim extended in `setup-pkg.mjs`.
- **Brand PNGs are inlined by value.** `public/brand/*.png` are baked into the
  `next/image` shim as data URIs at setup time, because `public/` is not part of
  the upload layout. New or re-exported artwork only reaches previews after a
  `prepare.sh` re-run.
- **`cardMode: "column"` is set for 14 components** in `cfg.overrides` purely for
  presentation — their stories need full card width and clip in a narrow grid
  cell. It is excluded from the grade key, so changing it does not re-grade.
- **Partially verified:** hover, focus and open/closed states cannot be captured
  in a still card. `CardHover`/`CardMedia` previews show the rest position, and
  `SiteHeader` renders its desktop nav with pathname `"/"` (the shim's fixed
  value) — its mobile panel and Escape handling are unexercised by the render
  check.
- **Toolchain assumptions:** Node 24, Tailwind 4.3.3 (pinned in `.ds-sync/`, must
  match the app's `tailwindcss` major), esbuild + ts-morph + `@types/react` from
  the app's own copy (a second `@types/react` makes every ref-carrying prop
  unassignable — "two different types with this name exist").
