---
category: Icons
keywords: [chevron left, previous, back, arrow, carousel]
---
Previous — the hero carousel's backward arrow.

Solid, 24px box. The hero parks it as a cream disc on the band's left edge; the control around it carries the label.

## Notes

- Icons are decorative (`aria-hidden`). When an icon is a control's only content,
  the CONTROL carries the accessible name — put the `sr-only` span or `aria-label`
  on the button or link, never on the icon.
- Colour is `currentColor` and size comes from the caller's className. `text-brand`
  plus `size-5` on the parent is the whole styling contract; there is no `color` or
  `size` prop.
- Never substitute an emoji for an icon.

```jsx
<button type="button" aria-label="Previous slide" className="inline-flex size-11 items-center justify-center rounded-pill bg-canvas text-ink shadow-sm">
  <ChevronLeftIcon className="size-5" />
</button>
```
