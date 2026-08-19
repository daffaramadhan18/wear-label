---
category: Shop
keywords: [product card, catalogue card, grid item, product tile]
---
The catalogue card: a 3:4 image block, then the name in Playfair, material, price.

The whole card is one link — the name's anchor is stretched over the media — so a
grid gives one tab stop per product and never nests interactive elements.

The design system's card carries an add-to-bag button. There is no cart in this
build, so the card links to the product page instead.

## Props

- `product` — the Shopify `Product` shape: `handle`, `title`, `material`,
  `featuredImage`, `priceRange.minVariantPrice`, `availableForSale`.
- `sizes` — the responsive sizes string the grid uses.
- `headingLevel` — `"h2"` or `"h3"` (default). Set it to whatever keeps the
  page's heading order intact: `"h3"` under a section heading, `"h2"` when the
  card is the top level.

## Notes

- Title, material and price all resolve through `Copy`/`Price`, so an
  unpopulated product renders labelled placeholders rather than blanks.
- Sold-out state is stated in words via an inert `Badge`, never colour alone.
- Hover and keyboard focus both scale the image, via `CardHover`.

```jsx
<div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
  {products.map((p) => (
    <ProductCard key={p.id} product={p} sizes="(min-width: 1024px) 25vw, 50vw" />
  ))}
</div>
```
