---
category: Icons
keywords: [chevron right, next, forward, arrow, carousel, disclosure]
---
Next — the hero's forward arrow, and the filter rail's disclosure marker.

Solid, 24px box. Used two ways: as the carousel's forward control, and rotated as the marker on a filter group's disclosure.

## Notes

- Icons are decorative (`aria-hidden`). When an icon is a control's only content,
  the CONTROL carries the accessible name — put the `sr-only` span or `aria-label`
  on the button or link, never on the icon.
- Colour is `currentColor` and size comes from the caller's className. `text-brand`
  plus `size-5` on the parent is the whole styling contract; there is no `color` or
  `size` prop.
- Never substitute an emoji for an icon.

```jsx
<button type="button" aria-label="Next slide" className="inline-flex size-11 items-center justify-center rounded-pill bg-canvas text-ink shadow-sm">
  <ChevronRightIcon className="size-5" />
</button>
```
