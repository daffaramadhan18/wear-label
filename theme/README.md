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

**Done — the shell.**

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
| `assets/theme.js` | `components/motion/{reveal,stagger}.tsx` + the header disclosure |

**Not done.** Every template renders `sections/main-stub.liquid`, which draws a
labelled placeholder at final size — the same rule the content module uses for
unwritten copy, so the shell around it is reviewable now. Delete the stub from a
template the moment that template's real main section lands.

Still to port: the home page's seven blocks, the catalogue, the product page, the
bag, and the remaining marks in `snippets/icon.liquid`.

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
