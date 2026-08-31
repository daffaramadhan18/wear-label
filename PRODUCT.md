# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: Indonesian women, roughly 20s–30s, buying everyday linen and cotton
trousers.** Confirmed 2026-08-20.

What they actually decide on is documented in their own words — twenty verbatim
Shopee reviews in `theme/sections/voices-wall.liquid` — extracted from
`lib/content/site.ts` and asserted verbatim against it — the only first-party
customer evidence this project holds:

- **Fit against a stated body.** Almost every review names a height and weight
  before it names a size ("BB 38/155", "TB 167 cm, BB 60"). Fit is the purchase
  decision, not a detail after it.
- **Whether the fabric is sheer.** "Ga nerawang" recurs, and is decisive — it is
  what makes a white culotte wearable, and it is raised unprompted by hijab
  wearers.
- **Heat.** "Adem", "ga panas", "ga gatel" — Bandung/Jakarta climate is the use
  case.
- **Bodies that change.** Several reviews are from customers six and eight months
  pregnant reporting that a piece still fits.
- **Studio responsiveness and dispatch speed.** "Admin ramah", "responsif",
  same-day arrival. The person answering is part of the product.
- **Repeat purchase is normal.** Second and third pairs, "5 koleksi cerra pants".

**Second primary, added 2026-08-31 by the client's website brief:** the person who
buys custom apparel for an organisation. Brief §4 names them — companies,
hospitals, universities and schools, organisations, communities, event organisers
and institutions — buying custom uniforms, corporate apparel, merchandise, event
apparel and community apparel.

They are a different buyer making a different decision and it is worth being blunt
about how little the retail evidence above transfers to them:

- **They do not decide from a product page.** There is no price, no size and no
  stock — the specification and the quantity are what a price is quoted against.
  So the B2B route's whole job is to make the *process* legible, which is why
  brief §9.4 spends five steps on it.
- **They do not check out.** Brief §16 is explicit: no ecommerce checkout on this
  route, straight to WhatsApp. A B2B enquiry is a conversation.
- **What they need to believe is capability, not scale.** The portfolio is small
  and the brief forbids pretending otherwise. So the argument is years of garment
  development, understanding of material and cutting and fit, and an end-to-end
  process — all of which are true today and none of which need a client count.
- **They arrive not knowing this business exists.** Every previous version of this
  site only sold trousers. That is the gap the home page's custom band closes, and
  it is why the hero carries a second CTA on every slide.

**Secondary, served by the same pages:** an outside reader in English — press, a
boutique, diaspora, a curious browser. Never at either primary buyer's expense.

**Not a target:** wholesale or reseller buyers. Nothing in this project is built
for a stockist. **That is not the same as the B2B audience above** and the
distinction is load-bearing: a stockist buys finished Wear Label pieces to resell
under Wear Label's name, and there is no trade price list, no MOQ and no line
sheet anywhere in this project. An organisation commissioning uniforms is buying
production, not inventory. If a request starts with "wholesale pricing" or "become
a reseller", it is still out of scope.

## Product Purpose

Wear Label's own web presence: company profile, the full catalogue, and a
storefront. An apparel label in Bandung, Indonesia.

**It is now a till as well as a credibility surface. Revised 2026-08-31**, and the
2026-08-20 position — "credibility, not conversion; the Shopee marketplace remains
the till" — no longer holds on its own. The client's brief makes homepage, shop,
product, cart, checkout, payment and shipping all Must Have for v1 (§19), and the
client's own note puts web checkout and a Shopee hand-off side by side rather than
one instead of the other: a shopper can buy here, or be sent to the piece on
Shopee, and both are first-class.

What has NOT changed is why the credibility half exists. Shopee is still where
every piece of customer proof came from and still where a large share of buyers
will prefer to transact, so the hand-off is a feature and not a fallback.

Three consequences that should govern future decisions:

- **An unfinished checkout IS a launch blocker now.** It was not before. Nothing
  in the theme is missing — the gap is a payment gateway and a courier app, both
  Shopify configuration, both still unchosen. Shopify Payments does not exist in
  Indonesia, so this is a real procurement decision and not a switch.
- An unclear or unbelievable brand story is **still** a launch blocker. About Us,
  the fit story and the customer evidence carry weight the checkout never will.
- **The B2B route has its own single blocker, and it is one field.** With no
  WhatsApp number in theme settings, `/pages/custom` cannot convert at all — the
  quote form renders and its submit is disabled. Everything else on that page is
  built.

## Positioning

Small-run linen and cotton trousers cut for real Indonesian bodies, sewn in
Bandung by a studio that answers — and the same studio taking custom apparel
production for organisations.

Brief §3 states the positioning as one line: **Wear Label — Ready-to-Wear &
Custom Apparel.** The overall impression stays a modern women's fashion brand;
the custom side has to be discoverable from the first screen without competing
with it. That is the balance every home-page change has to hold.

The part a neighbouring brand cannot truthfully copy is the **fit record**: two
dozen customers stating their measurements and reporting how a piece sat. The
brand competes on fit confidence and fabric honesty — non-sheer, cool, drapes —
at Rp 159.000–199.000, not on catalogue breadth and not on discount depth.

## Operating Context

- **Channels.** Shopee (primary sales channel and the source of all customer
  proof), Instagram (the home-page strip; the studio's own posts are not wired
  up, so the strip runs the catalogue's photographs and carries no links),
  WhatsApp (fit advice — `home.services` states "Fit advice over WhatsApp"), and
  this site.
- **Where the studio is.** Site copy says Bandung; the hero's order-notes card,
  which is the studio's own artwork, says dispatch from Kota Bekasi. Both are
  live on the home page and nothing in the project picks a side. **Open.**
- **Order rituals, reproduced from the studio's own notes card** (transcribed in
  the first hero slide's alt text, `theme/templates/index.json`): payment before
  15.00 WIB dispatches the
  same day; orders cannot be cancelled after checkout; dispatch Monday–Saturday,
  none on public holidays; complaints within 3 days of delivery and only with an
  unboxing video; instant and same-day delivery available; model and colour
  cannot be exchanged. These are the studio's real terms and they partly
  contradict the site's own copy (see Capabilities).
- **Stated store policy in site copy.** Ships from Bandung within 1–2 working
  days; one free size exchange within 14 days; free shipping over Rp 750.000.
- **Couriers.** JNE, J&T and SiCepat are quoted during checkout by a
  RajaOngkir/Biteship app, never in the bag.

## Capabilities and Constraints

**The catalogue.** Eleven pieces — culottes and trousers, Rp 159.000–199.000 —
with real names, materials, prices, four markdowns and three New flags. Sizes
XS–XL × five colourways (Cream, Camel, Taupe, Sage, Espresso) = 25 variants each.
Categories are derived, not authored: Wide leg 8, Culottes 2, Straight cut 1.

**Commerce lives in Shopify; this repo is presentation only.** Fixed market
constraints, not retryable:

- Shopify Payments is unavailable in Indonesia — a third-party gateway is
  required and Shopify adds its own transaction fee on top.
- A custom checkout UI requires Shopify Plus, so checkout is Shopify-hosted.
  That is why the bag has no shipping selector, no address fields, and a total
  that equals its subtotal.
- Discount codes are validated by Shopify.
- Indonesian couriers quote rates during checkout, so no rate can be shown
  before it.

**Made to order is not a service the studio runs.** Confirmed 2026-08-20. No piece
carries the tag, so the catalogue facet counts zero, which is correct.

The site used to promise it anyway. That has been taken out: the made-to-order band
and its three stats are off the home page, the hero's second slide points at the
customer voices instead of "Start an order", and the bag's summary note and the
product Shipping tab no longer state a made-to-order policy. The band is kept for
the day the service exists, marked as not to be placed.

**No surface refers to it any more.** The last one did — the catalogue's "Made to
order" availability filter, which matched nothing and survived only because removing
it meant touching the old `QUERY_KEYS` URL contract. The rebuild onto Shopify closed
it by itself: storefront filters exist only if somebody creates them in Search and
Discovery, and nobody will create that one.

**Language.** English interface, single locale, no i18n layer. Confirmed
2026-08-20 as settled, not an artifact. Quoted material keeps the language it was
written in: the customer reviews stay Indonesian, untranslated and unedited. This
applies to quotations only, never to the site's own voice.

**Never invent commerce data.** No fabricated stock number, shipping rate, review
count, star rating, countdown or discount depth — not as placeholder polish
either. Where a number cannot be known the interface says where it comes from
("Calculated at checkout") or the block hides itself.

**Not built, deliberately.** No search. No authentication (`/account` reserves
the route; "Save for later" is `localStorage` only). No review feed behind the
voices wall — new reviews mean editing the content module.

**Explicitly undecided.** Which payment gateway, or whether checkout becomes real
at all. Whether customer accounts exist or guest checkout is enough. Bandung
versus Bekasi. Shop-banner photography. Per-product Details and Fabric & care
copy. About Us, My Account and 404 copy. Social handles. Nine footer destinations
with no page behind them. Whether there is a limited run, and when it ends.

## Brand Commitments

- **Name: Wear Label.** The logotype is drawn artwork in `public/brand/` and is
  never set in a typeface; it swaps to a cream file on dark surfaces rather than
  being filtered.
- **The design system is the authority** for colour, type, spacing, radius,
  shadow and motion — Claude Design project `bf11a0f4-4b1c-400b-802c-b9c9c2d66673`,
  ported into `app/tokens.css`. Where the brand palette and a contrast preference
  disagree, the brand system wins: four pairs fall short of WCAG AA and are
  implemented as specified with their measured ratios annotated.
- **White page, cream bands.** Cream fills what sits on the page, never the shell.
- **Customer quotations are inviolable.** Never edited, tidied, translated, or
  added to from anything but the store.
- **Brand voice is not settled yet.** About Us, My Account and 404 hold empty
  strings on purpose, and render labelled placeholders at final size rather than
  filler. An empty string is a valid state in this project.

## Evidence on Hand

Real, and reusable:

- **Twenty verbatim Shopee reviews** — `theme/sections/voices-wall.liquid`, with
  `lib/content/site.ts` as the archived source they are asserted against. The only
  customer proof that exists. They carry the fit
  record, the sheerness question, the heat claim and the studio's
  responsiveness — everything a testimonial would otherwise have to invent.
- **Eleven client garment photographs** — `public/products/*.webp`, square, one
  per handle.
- **Seven logotype files** — `public/brand/`: wordmark, stacked and monogram,
  each with a cream variant, plus a taupe wordmark.
- **Two hero images** — `public/home/hero-{1,2}.webp`, from the design's own
  slots. One is the studio's Indonesian order-notes card.
- **Prices, materials, markdowns and New flags** — the client's own catalogue.
- **The studio's order terms** — transcribed from its own notes artwork.

Absent, and not to be fabricated: star ratings or review counts, stock levels,
shipping rates, any discount depth beyond the catalogue's own 20% markdowns,
social handles, Instagram post imagery or permalinks, shop-banner photography,
About Us history, founder or team facts, production volumes, and any made-to-order
proof.

## Product Principles

1. **Fit confidence is the product.** Anything that helps a buyer predict how a
   piece will sit on her particular body outranks expression, and outranks
   catalogue polish.
2. **Credibility before conversion.** While Shopee is the till, this site earns
   trust. Judge a change by whether it makes the brand more believable, not by
   whether it shortens a funnel.
3. **Only promise what the studio can honour.** A service the studio does not run
   and a rate it cannot know are the same failure.
4. **Quote customers; never synthesise them.** Reproducing what someone wrote is
   allowed. Averaging it into a score is not.
5. **A labelled placeholder beats invented content.** Unknown copy and missing
   photography render at final size and say what they are, so the layout is
   already finished when the truth arrives.

## Accessibility & Inclusion

Product-specific needs, established from the customer evidence rather than from a
checklist:

- **Sizing information must be text.** Buyers decide from measurements; anything
  conveyed only by an illustration or a swatch fails the primary job.
- **Colour never carries meaning alone** — "Sold out" says so, an applied filter
  carries `aria-current`, a toggle carries `aria-pressed`.
- **Thumb-first controls**, 44px minimum: this audience arrives from a
  marketplace app on a phone.
- **`prefers-reduced-motion` must leave content reachable**, not merely paused —
  a frozen marquee that holds its content off-stage is a regression, not a
  concession.
- **Four brand-palette contrast pairs fall short of WCAG 2.2 AA.** Implemented as
  the brand specifies, each annotated with its measured ratio and a one-line
  remedy at the top of `app/tokens.css`.
