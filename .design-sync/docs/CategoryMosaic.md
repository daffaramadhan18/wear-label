---
category: Home
keywords: [category mosaic, tiles, category grid, shop by category]
---
One tall tile and four small ones, each a real catalogue filter.

The label sits ON the photograph, so it carries its own surface: a solid chip on the
small tiles, a heavier plate on the tall one. It never relies on the crop staying
dark enough to read against, and the small tiles alternate espresso and camel so two
adjacent chips never merge.

## Notes

- It is a `nav`, not a heading block — `label` names the region, because a set of
  links is not a section with a title.
- `images` is positional: feature first, then one per tile. A missing entry falls
  back to the labelled placeholder at the right ratio, so the mosaic keeps its shape
  while shots are outstanding.
- Every destination should be a live catalogue filter.

```jsx
<CategoryMosaic label="Shop by category" feature={home.mosaic.feature} tiles={home.mosaic.tiles} images={images} />
```
