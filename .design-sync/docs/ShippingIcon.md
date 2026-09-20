---
category: Icons
keywords: [shipping icon, delivery, free shipping, truck, service]
---
The free-shipping mark in the service band.

Solid, drawn on a 48px box so it holds detail at the band's 30px render. `ServiceBand` selects it by the NAME `"shipping"` from the content module rather than taking it as a node.

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
  <ShippingIcon className="size-7.5" />
</span>
```
