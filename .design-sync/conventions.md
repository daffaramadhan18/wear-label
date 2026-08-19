# Building with Wear Label

A fashion storefront system: warm taupe and cream, editorial Playfair headings
over a Poppins interface, near-square corners, and almost no colour. Restraint is
the brand — if a screen looks busy, it is wrong.

## Setup

**There is no provider and no root wrapper.** Import the stylesheet and render
components straight from `window.WearLabel`. `styles.css` carries the tokens, the
base layer, the compiled component CSS and the self-hosted Playfair Display and
Poppins faces, so nothing else needs loading and no font link is required.

`h1` and `h2` are already Playfair via the base layer — do not add `font-display`
to them. `h3` and body text are already Poppins.

## Styling: Tailwind v4 semantic utilities only

Every colour, size, space and radius is a **semantic token utility**. Never write
a hex value, a px font-size, or a raw Tailwind palette class (`bg-stone-100`,
`text-gray-500`) — none of the default palette exists here. Use these families:

| family | names |
|---|---|
| surfaces | `bg-canvas` `bg-surface` `bg-surface-muted` `bg-tone` `bg-invert` `bg-invert-hover` |
| text | `text-ink` `text-ink-body` `text-ink-muted` `text-ink-subtle` `text-ink-invert` `text-ink-invert-muted` |
| brand action | `bg-brand` `bg-brand-hover` `text-brand` `text-on-brand` |
| lines | `border-hairline` `border-border` `border-rule` `border-line` `ring-focus` |
| feedback | `bg-success-surface` `text-on-success-surface` `bg-error-surface` `text-on-error-surface` `text-error` `bg-info-surface` `text-on-info-surface` `bg-promo-surface` `text-on-promo-surface` `bg-sage-surface` `text-on-sage-surface` |
| markdown | `bg-sale` `text-on-sale` — a marked-down price, never the error ramp by name |
| inert / disabled | `bg-disabled` `text-on-disabled` `bg-inert` `text-on-inert` `border-inert-border` |
| type scale | `text-display` `text-h1` `text-h2` `text-h3` `text-card` `text-body` `text-small` `text-caption` `text-label` `text-micro` |
| line height | `leading-display` `leading-h1` `leading-h2` `leading-h3` `leading-card` `leading-body` `leading-snug` |
| tracking | `tracking-display` `tracking-h2` `tracking-label` `tracking-nav` `tracking-eyebrow` `tracking-wide` |
| families | `font-display` (Playfair) `font-body` (Poppins) |
| spacing | `py-section` `px-gutter` `gap-block` `gap-block-lg` `max-w-content` |
| radius | `rounded-xs` `rounded-sm` `rounded-pill` |
| elevation | `shadow-sm` `shadow-md` `shadow-lg` — warm-toned, never neutral grey |
| easing | `ease-entrance` `ease-exit` |

Plain layout utilities (`flex`, `grid`, `items-center`, `w-full`, numeric
`gap-6`/`mt-8`) are fine and expected. `wl-measure` caps text at the readable
measure.

## Five rules that are easy to get wrong

1. **Text comes from the content module, and empty is a real state.** The
   storefront's approved copy now lives in the app's `lib/content/site.ts`; the
   slots still undecided (About Us, My Account, 404, per-product details and
   fabric care) are `""`. Every such slot takes
   `<Copy value={x} label="heading" />`, which renders the string when it exists
   and a correctly-sized labelled placeholder when it does not — that is what
   keeps layouts final before the remaining copy arrives. Never hardcode
   marketing copy — invent nothing.
2. **Pills only for badges and filter chips.** `rounded-pill` belongs to `Badge`
   and chips. Everything else is `rounded-sm` or `rounded-xs`; corners stay
   near-square.
3. **`Section` already includes `Container`.** Nesting a second `Container`
   inside a `Section` double-gutters the page.
4. **Never let colour alone carry meaning.** Sold-out says "Sold out"; `Alert`
   takes a `label` for its visually-hidden tone prefix.
5. **One primary button per screen.** `Button variant="primary"`; everything else
   is `outline`, `ghost` or `link`.

## Where the truth is

- `styles.css` — the whole compiled cascade (base layer, component CSS, the
  self-hosted faces). This is what a rendered design actually loads.
- `tokens/tokens.css` — the annotated token source: every ramp, the measured
  contrast ratios, and the three AA exceptions the brand system accepts.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage, props and
  gotchas. Read it before using a component; groups are `actions`, `feedback`,
  `icons`, `layout`, `product`, `shop`, `structure`, `typography`.

**This system currently lags the app it came from.** The storefront build added
components that are not synced yet — the aurora band, breadcrumbs, the hero
carousel, the bag rows and summary, pagination, the results toolbar, the product
gallery and purchase block, the save button. Composing a screen here will not
find them; see `.design-sync/NOTES.md` before assuming a gap is deliberate.

## Idiomatic screen

```jsx
const { Section, SectionHeading, ProductCard, ButtonLink } = window.WearLabel;

<Section tone="muted" labelledBy="featured">
  <SectionHeading
    id="featured"
    heading={heading}
    body={body}
    action={<ButtonLink href="/shop" variant="link">View all</ButtonLink>}
  />
  <div className="mt-block grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
    {products.map((p) => (
      <ProductCard key={p.id} product={p} sizes="(min-width: 1024px) 25vw, 50vw" />
    ))}
  </div>
</Section>
```
