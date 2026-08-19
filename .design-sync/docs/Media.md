---
category: Product
keywords: [media, image, photo, placeholder, aspect ratio]
---
Catalogue and editorial imagery, with a placeholder that holds the exact ratio.

`image.url` is nullable. A null renders a tone-filled block with a small
uppercase caption at the bottom, at the exact aspect ratio the real photograph
will occupy — so dropping files in and setting the url causes no reflow (CLS
stays 0). Every product in the current fixtures is in this state.

## Props

- `image` — `{ url: string | null, altText: string, width: number, height: number }`.
  `width`/`height` are the intrinsic pixel size and are what set the ratio.
- `sizes` — required. The responsive sizes string the layout actually uses; a
  real image renders through `next/image` with `fill`.
- `label` — caption on the placeholder block, naming what belongs there.
- `priority` — set for above-the-fold imagery only.

```jsx
<Media
  image={product.featuredImage}
  sizes="(min-width: 1024px) 25vw, 50vw"
  label="Product photo"
/>
```
