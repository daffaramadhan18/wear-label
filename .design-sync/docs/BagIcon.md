---
category: Icons
keywords: [bag icon, shopping bag, add to bag, choose size]
---
The choose-size action on a catalogue card.

Solid, 16px box. On a card it sits in a brand-filled square at the bottom right of the crop and goes to the product page — not straight into the bag, because every piece has five sizes and five colourways and a one-click add would have to guess a variant.

## Notes

- Icons are decorative (`aria-hidden`). When an icon is a control's only content,
  the CONTROL carries the accessible name — put the `sr-only` span or `aria-label`
  on the button or link, never on the icon.
- Colour is `currentColor` and size comes from the caller's className. `text-brand`
  plus `size-5` on the parent is the whole styling contract; there is no `color` or
  `size` prop.
- Never substitute an emoji for an icon.

```jsx
<a href="/shop/moa-pants#options" className="wl-tap inline-flex size-9.5 items-center justify-center rounded-xs bg-brand text-on-brand hover:bg-invert">
  <BagIcon className="size-4.5" />
  <span className="sr-only">Choose a size: Moa Pants</span>
</a>
```
