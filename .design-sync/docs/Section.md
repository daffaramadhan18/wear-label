---
category: Structure
keywords: [section, band, vertical rhythm, spacing, region]
---
Vertical rhythm plus an optional background band. Wraps its children in a Container.

Padding is one token (`--spacing-section`, 80–96px), so the page's cadence is
tuned in one place.

## Tones

- `canvas` (default) — cream, the page background.
- `muted` — the alternating band, so consecutive sections stay distinguishable.

## Notes

- It renders a `<section>`. Pair `labelledBy` with the `id` of the
  `SectionHeading` or `PageHeading` inside it so the region gets an accessible
  name.
- Already includes `Container` — do not add another.

```jsx
<Section tone="muted" labelledBy="featured-heading">
  <SectionHeading id="featured-heading" heading={h} body={b} />
</Section>
```
