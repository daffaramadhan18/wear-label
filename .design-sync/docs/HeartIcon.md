---
category: Icons
keywords: [heart icon, save, wishlist, favourite, saved]
---
Save for later, on a catalogue card and the product page.

Solid, 24px box. `SaveButton` wraps it and owns the state — reach for that rather than this mark plus your own toggle, so `aria-pressed` and the `localStorage` list come with it.

## Notes

- Icons are decorative (`aria-hidden`). When an icon is a control's only content,
  the CONTROL carries the accessible name — put the `sr-only` span or `aria-label`
  on the button or link, never on the icon.
- Colour is `currentColor` and size comes from the caller's className. `text-brand`
  plus `size-5` on the parent is the whole styling contract; there is no `color` or
  `size` prop.
- Never substitute an emoji for an icon.

```jsx
<span className="text-brand"><HeartIcon className="size-4.5" /></span>
```
