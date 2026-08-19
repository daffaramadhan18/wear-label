---
category: Layout
keywords: [wordmark, logo, logotype, brand mark, monogram]
---
The Wear Label logotype — drawn artwork, never set in a typeface.

There is no font, weight or tracking to get right here, only the correct file.

## Props

- `variant` — `"horizontal"` (default, for headers) or `"stacked"` (narrow or
  square space).
- `onDark` — swaps to the cream artwork. This changes the FILE rather than
  filtering the image, because the taupe logotype on an espresso surface would
  fail contrast.
- `height` — rendered height in px; the lockup holds its ratio.

## Notes

- It links to "/" and the company name is carried by an adjacent visually-hidden
  span, so the image's alt text is deliberately empty — a screen reader hears the
  name once, not twice.
- Never reconstruct the logotype in type, and never recolour it with CSS filters;
  use `onDark` for dark surfaces.

```jsx
<Wordmark />
<Wordmark onDark variant="stacked" height={64} />
```
