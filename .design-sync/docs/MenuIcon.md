---
category: Icons
keywords: [menu icon, hamburger, nav toggle, open menu]
---
The mobile navigation toggle's open state.

24px box, 1.5 stroke, round caps, no fill, drawn in `currentColor` — so it takes
the colour of whatever it sits in. Accepts any SVG prop, including `width` and
`height` to scale it.

## Notes

- Icons in this system are decorative (`aria-hidden`). When an icon is a
  control's only content, the control carries the accessible name — put
  `aria-label` on the button, not the icon.
- Never substitute an emoji for an icon.

```jsx
<button type="button" aria-label="Open menu"><MenuIcon /></button>
```
