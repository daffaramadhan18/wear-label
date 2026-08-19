---
category: Product
keywords: [price, money, currency, IDR, tabular figures]
---
A formatted price in espresso ink with tabular figures.

Set at the 15px step. Tabular figures mean a column of prices never shifts width
as the digits change.

## Props

- `price` — `{ amount: string, currencyCode: "IDR" | "USD" } | null`.

Pricing and currency are not decided for this storefront, so `price` is nullable
and a null renders a `Copy` placeholder rather than a made-up number. That is the
current state of the catalogue.

IDR is written with Indonesian grouping and no minor units ("Rp 1.250.000") even
on an English-language site.

```jsx
<Price price={product.priceRange.minVariantPrice} className="text-small" />
```
