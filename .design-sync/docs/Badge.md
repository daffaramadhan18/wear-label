---
category: Feedback
keywords: [badge, pill, tag, label, sold out, promo]
---
Pill badge for short status and category labels.

Pills are reserved for badges and filter chips — every other surface in this
system stays near-square, so reaching for a pill elsewhere breaks the look.

## Tones

`outline` (default) · `brand` · `promo` · `sage` · `inert`.

Use `inert` for unavailability ("Sold out") and `promo` for the blush
promotional surface.

## Notes

- The text carries the meaning. Never rely on the tone alone to say "sold out".
- On a product card, place it over the top-left of the media block.

```jsx
<Badge tone="promo">Final reduction</Badge>
<Badge tone="inert">Sold out</Badge>
```
