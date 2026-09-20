---
category: Navigation
keywords: [breadcrumbs, trail, crumb, navigation, aria-current]
---
The breadcrumb trail, above a product's name.

Ancestors first, current page last.

## Notes

- **Only the LAST entry may omit `href`.** That is what marks it as the current
  page: it renders as plain espresso text carrying `aria-current="page"` rather
  than as a link, so the trail reads as a position and not as a set of
  destinations.
- The `/` separators are `aria-hidden` — a slash is not a word.
- Every intermediate level should be a real catalogue filter, not an invented
  category page.

```jsx
<Breadcrumbs
  trail={[
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Moa Pants" },
  ]}
/>
```
