---
category: Typography
keywords: [page heading, h1, page title, hero heading]
---
The `h1` block at the top of a page — heading at the H1 step with an intro below.

Heading is Playfair at the H1 step; the intro is body text in muted ink,
constrained to the readable measure (`--measure`, 64ch).

## Notes

- `id` is required: the page's `Section` points `labelledBy` at it, which is what
  gives the region its accessible name.
- Both strings resolve through `Copy`, so passing `""` renders a correctly-sized
  placeholder rather than collapsing the layout.
- One per page — it renders an `h1`.

```jsx
<PageHeading id="shop-heading" heading={shop.heading} body={shop.body} />
```
