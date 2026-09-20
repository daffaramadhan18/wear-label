---
category: Icons
keywords: [person icon, account, profile, user, header]
---
The account mark, beside the bag in the header bar.

Solid, 16px box, `currentColor`. Same 44px tap target as the bag, and the link carries the name.

## Notes

- Icons are decorative (`aria-hidden`). When an icon is a control's only content,
  the CONTROL carries the accessible name — put the `sr-only` span or `aria-label`
  on the button or link, never on the icon.
- Colour is `currentColor` and size comes from the caller's className. `text-brand`
  plus `size-5` on the parent is the whole styling contract; there is no `color` or
  `size` prop.
- Never substitute an emoji for an icon.

```jsx
<a href="/account" className="inline-flex size-11 items-center justify-center rounded-sm text-ink-body hover:text-brand">
  <PersonIcon className="size-5" />
  <span className="sr-only">My Account</span>
</a>
```
