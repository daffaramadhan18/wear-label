---
category: Product
keywords: [product tabs, details, fabric and care, shipping, aria tabs]
---
The product page's Details / Fabric & care / Shipping tabs.

**Real ARIA tabs, which means the keyboard contract is real too**: arrow keys move
between tabs, Home and End jump to the ends, and the strip is a single tab stop with
Tab moving on to the panel. A row of buttons that only answers clicks looks like this
and is not this.

## Notes

- Each tab takes a `placeholder` alongside its `body`. A panel whose copy has not
  been written renders the labelled placeholder at body size, so the block keeps its
  height either way.
- The tab strip is built from the array, so the count is a content decision.

```jsx
<ProductTabs
  tabs={[
    { id: "details", label: "Details", body: "", placeholder: "product details" },
    { id: "shipping", label: "Shipping", body: product.shipping, placeholder: "shipping" },
  ]}
/>
```
