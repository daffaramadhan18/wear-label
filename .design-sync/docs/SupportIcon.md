---
category: Icons
keywords: [support icon, help, headset, customer service]
---
The studio-support mark in the service band.

Solid, 48px box. Selected by the name `"support"` in the content module.

## Notes

- Icons are decorative (`aria-hidden`). When an icon is a control's only content,
  the CONTROL carries the accessible name — put the `sr-only` span or `aria-label`
  on the button or link, never on the icon.
- Colour is `currentColor` and size comes from the caller's className. `text-brand`
  plus `size-5` on the parent is the whole styling contract; there is no `color` or
  `size` prop.
- Never substitute an emoji for an icon.

```jsx
<span className="inline-flex size-13 items-center justify-center rounded-pill bg-inert text-brand">
  <SupportIcon className="size-7.5" />
</span>
```
