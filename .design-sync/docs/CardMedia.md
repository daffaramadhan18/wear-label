---
category: Shop
keywords: [card media, image wrapper, hover scale, clip]
---
The image wrapper inside a product card — scales the image when the card is active.

Must sit inside `CardHover`, whose state it reads through Motion's variant
context. Outside one it renders the image at rest and simply never animates.

The clip lives on a static parent, so the crop stays put while the image scales
underneath it — scaling an element that clips itself would animate the crop too.

```jsx
<CardMedia><Media image={product.featuredImage} sizes="25vw" /></CardMedia>
```
