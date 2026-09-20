---
category: Shop
keywords: [filters, facets, sort, checkbox chips, filter rail]
---
The catalogue's filter rail — a plain GET form with native controls, no JavaScript.

11px camel field labels at 0.18em, cream-filled controls with a sand rule, and
pill chips, which this system reserves for badges and chips exactly like these.

Filter state lives in the query string, which `/shop` reads on the server — so the
resulting URL is shareable and back-button friendly, and when Shopify goes live
the same query becomes Storefront API arguments with no change to this UI.

## Props

- `facets` — `{ categories: string[], sizes: string[] }`, the available values.
- `query` — `{ categories: string[], sizes: string[], inStockOnly: boolean, sort }`
  where `sort` is `"featured" | "price-asc" | "price-desc"`.
- `filtered` — whether anything currently narrows the catalogue. When true, a
  "Clear all" link appears beside Apply.

## Notes

- The checkbox inside each chip stays visible rather than being replaced by a
  styled span, so state is never carried by colour alone and the control keeps
  the platform's own semantics.
- It renders a `<form>`; do not nest it inside another form.
