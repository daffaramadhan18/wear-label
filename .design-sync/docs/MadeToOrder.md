---
category: Home
keywords: [made to order, bespoke, aurora band, stats]
---
The made-to-order band — the one place on the home page where the aurora runs at full width.

That is the rule for the effect, not a coincidence: the wash is for low-density
bands, never behind a garment or the logotype. Copy and the CTA sit left; the stats
run down a ruled column on the right from `lg` up and stack under the copy below
that.

## Notes

- `id` is required — the band points `aria-labelledby` at its own heading, which is
  what names the region.
- `stats` is a definition list, so it holds whatever the content module gives it;
  three is the storefront's choice, not the component's.
- The design's second action ("How it works") is deliberately absent: there is no
  page for it yet, and a button that goes nowhere is worse than one button.

```jsx
<MadeToOrder id="mto" eyebrow="Made to order" heading="Cut to your measurements" body={body} cta="Start an order" href="/shop?made-to-order=1" stats={stats} />
```
