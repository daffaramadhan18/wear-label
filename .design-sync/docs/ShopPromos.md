---
category: Shop
keywords: [shop promos, campaign bands, promo tiles, banner pair]
---
The two bands under the catalogue banner: a photograph with a label plate, and a copy block with the garment at its edge.

**Both are single links** — the whole band is the target, not just the words on it.

## Notes

- `promos` is POSITIONAL: index 0 gets the plate treatment over a full-bleed crop,
  index 1 the copy block on the muted surface. The two are styled differently on
  purpose, so the pair reads as a composition rather than two of the same tile.
- A band whose `eyebrow` or `cta` is empty simply renders without it; the layout is
  the same either way.
- An empty array renders nothing, and a missing image falls back to the labelled
  placeholder.

```jsx
<ShopPromos promos={shop.promos} images={images} />
```
