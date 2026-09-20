---
category: Icons
keywords: [cart icon, bag, basket, header]
---
The bag mark in the header bar.

Solid, drawn on a 16px box, `currentColor`. The header renders it inside a 44px tap target with the bag count announced by the link's own accessible name — the numeric badge beside it is `aria-hidden`.

## Notes

- Icons are decorative (`aria-hidden`). When an icon is a control's only content,
  the CONTROL carries the accessible name — put the `sr-only` span or `aria-label`
  on the button or link, never on the icon.
- Colour is `currentColor` and size comes from the caller's className. `text-brand`
  plus `size-5` on the parent is the whole styling contract; there is no `color` or
  `size` prop.
- Never substitute an emoji for an icon.

```jsx
<a href="/cart" className="relative inline-flex size-11 items-center justify-center rounded-sm text-ink-body hover:text-brand">
  <CartIcon className="size-5" />
  <span className="sr-only">Bag</span>
</a>
```
