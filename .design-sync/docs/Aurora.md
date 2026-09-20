---
category: Structure
keywords: [aurora, gradient, wash, band background, ambient]
---
The aurora wash — a slow gradient for low-density bands that carry no photography.

It is two CSS classes, not inline styles: `.wl-aurora` in `globals.css` assembles
the wash, and the stop lists live in `tokens.css`, so it recolours with the palette
instead of carrying colours of its own. This component only picks a tone, an origin
and an intensity.

## Tones

`canvas` (default) · `muted` · `inert` · `invert`.

## Notes

- **`tone` MUST match the surface underneath.** The veil layer is painted in the
  surface colour, and a mismatch shows up as a visible rectangle — that is the bug
  this effect always has. Pair `tone="inert"` with `bg-inert`, and so on.
- Never place it behind photography or the logotype: the clear-space and contrast
  rules apply to whatever sits on top.
- For a band with content over the wash use `AuroraBand`, which adds the `isolate`
  that keeps the blend on the band rather than the whole page.
- It is `aria-hidden` and absolutely positioned — give the parent `relative` and
  `overflow-hidden`.

```jsx
<div className="relative overflow-hidden bg-inert">
  <Aurora tone="inert" origin="top-right" intensity={0.7} />
</div>
```
