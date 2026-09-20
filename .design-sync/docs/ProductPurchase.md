---
category: Product
keywords: [purchase block, size selector, colourway, add to bag, variants]
---
Size, colourway, quantity and add to bag — the one interactive block on the product page.

Shopify holds a variant per combination of option values, so the two grids resolve
to a **single variant id, which is the only thing the form actually posts**. Price,
stock and availability are read from that variant and never computed here.

## Notes

- A combination with no stock does not silently do nothing: the option value is
  disabled and struck through where the whole value is gone, and where the pair is
  the problem the action is disabled and says so in words. **Sold out is never
  communicated by colour alone.**
- `useActionState` is what lets the confirmation land in a live region. The header's
  badge updates from the same round trip, but a reader who cannot see the badge move
  still needs to be told.
- `action` is a Server Function with the `useActionState` signature.

```jsx
<ProductPurchase product={product} action={addToBag} />
```
