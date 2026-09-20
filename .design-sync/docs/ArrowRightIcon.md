---
category: Icons
keywords: [arrow right, view all, continue, cta arrow]
---
The trailing arrow on a section's view-all action.

Solid, 24px box. It goes AFTER the label inside the button, so the label is still what is read first.

## Notes

- Icons are decorative (`aria-hidden`). When an icon is a control's only content,
  the CONTROL carries the accessible name — put the `sr-only` span or `aria-label`
  on the button or link, never on the icon.
- Colour is `currentColor` and size comes from the caller's className. `text-brand`
  plus `size-5` on the parent is the whole styling contract; there is no `color` or
  `size` prop.
- Never substitute an emoji for an icon.

```jsx
<ButtonLink href="/shop" variant="outline" size="lg">
  View all
  <ArrowRightIcon className="size-5" />
</ButtonLink>
```
