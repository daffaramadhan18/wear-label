@AGENTS.md

# CLAUDE.md

## Project

Company profile + product catalogue + commerce storefront for **Wear Label**, a
fashion/apparel brand. Custom Next.js frontend on top of Shopify as the commerce
engine.

**Status: pre-implementation.** No application code exists yet. This document
defines only the fixed architecture and conventions. Anything client-specific or
still undecided is deliberately absent — do not invent it here; ask.

## Architecture

```
Customer
   |
Next.js (App Router)  <- we build this
   |
Shopify Storefront API (GraphQL)
   |
Shopify                <- configured in admin, not in code
   |-- products, variants, inventory
   |-- cart, orders, customers
   |-- checkout, payment, shipping, discounts
```

### Responsibility boundary

This repo is **presentation only**. No commerce logic lives here.

| In this repo | In Shopify admin |
|---|---|
| Pages, components, layout | Products, variants, pricing, stock |
| Navigation, filtering, search UI | Cart and order state |
| Company profile content | Checkout, payment gateway |
| Cart UI (state lives in Shopify) | Customer records |
| Design tokens, theming | Shipping rates, couriers |
| SEO, OG tags, analytics | Discounts, vouchers |

If a task appears to require writing cart, order, inventory, or payment logic,
stop — it belongs in Shopify configuration instead.

## Stack

- **Next.js** (App Router) + TypeScript — Server Components by default
- **Shopify Storefront API** via public access token (Headless channel / custom app)
- **Shopify Cart API** — cart lives in Shopify; we persist only `cartId` in a cookie
- **Tailwind CSS** + CSS-variable design tokens
- **Vercel** for deployment, GitHub for source

Do **not** reach for Hydrogen — it is Remix-based. With Next.js we call the
Storefront API directly. `@shopify/hydrogen-react` may be used for cart and
Money formatting helpers only.

## Repo layout

```
app/            App Router routes, layouts, global styles
components/     Presentational components (empty — nothing built yet)
lib/shopify/    The only place Shopify is touched (empty — nothing built yet)
public/         Static assets
```

Commands: `npm run dev`, `npm run build`, `npm start`, `npm run lint`.

## Conventions

- **All Shopify access goes through `lib/shopify/`.** Components never call the
  Storefront API directly and never import GraphQL documents. This keeps the data
  layer swappable and lets the frontend be built before a store exists.
- **Fixtures until live.** `lib/shopify/` returns typed mock data until real
  credentials are available. Going live must be an env-var change, never a
  component change.
- **One token file.** Every color, font, radius, and spacing value resolves to a
  CSS variable defined in a single tokens file. No hardcoded design values in
  components — the palette must be replaceable in one edit.
- **Server Components by default.** Add `"use client"` only for genuine
  interactivity.
- **Checkout is a redirect.** Hand off to `cart.checkoutUrl`. Do not build a
  custom checkout UI (see Platform constraints).
- **Site language: English.** Single locale, no i18n layer.

## Platform constraints

Fixed properties of Shopify in this market — design around them, don't retry them:

- **Shopify Payments is unavailable in Indonesia.** A third-party gateway is
  required, and Shopify adds a transaction fee on top of the gateway fee when
  Shopify Payments is not used.
- **A fully custom checkout UI requires Shopify Plus.** On lower plans checkout is
  Shopify-hosted.
- **Indonesian couriers (JNE, J&T, SiCepat) are not native to Shopify** — they
  require a RajaOngkir/Biteship app.

## Not decided here

The following are open and must not be assumed in code or filled in by guessing:

- Brand identity, palette, typography, tone
- Content source for company profile copy (in-repo vs CMS vs Shopify Metaobjects)
- Whether customer accounts are needed, or guest checkout is sufficient
- Currency and target market
- Whether checkout uses a real payment gateway at all

When work touches any of these, ask rather than pick a default.
