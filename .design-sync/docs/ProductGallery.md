---
category: Product
keywords: [product gallery, thumbnails, image rail, angles]
---
A column of thumbnails beside the main product crop.

Client-side only for the selection.

## Notes

- Thumbnails are **buttons with `aria-pressed`, not links**, because choosing an
  angle is not a navigation; the main image swaps rather than the page scrolling to
  it.
- The rail is a column beside the photograph from `lg` up and a scrolling row
  beneath it below that — 92px of thumbnails alongside would leave the main crop
  about 260px on a phone, and the main crop is the thing being bought.
- **A gallery with one entry hides the rail altogether.**
- `title` is used as the main image's alt text when the image carries none.

```jsx
<ProductGallery images={product.images} title={product.title} />
```
