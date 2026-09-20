---
category: Shop
keywords: [card hover, hover state, focus state, product card shell]
---
Supplies a product card's article element and its hover/focus state.

This is the only client component in the card. It owns the active flag;
`CardMedia` reads it through Motion's variant context and scales the image to
1.03.

Why both hover and focus: the card is one stretched link, so a pointer lands on
the article and a keyboard lands on the anchor inside it. Both fold into one flag,
so a keyboard user tabbing the grid sees exactly what a mouse user sees.

## Notes

- Prefer `ProductCard`, which composes this for you. Reach for `CardHover`
  directly only when building a different kind of card.
- Everything between `CardHover` and `CardMedia` stays server-rendered.

```jsx
<CardHover className="relative flex flex-col gap-3.5">
  <CardMedia><Media image={img} sizes="25vw" /></CardMedia>
  {/* name, material, price */}
</CardHover>
```
