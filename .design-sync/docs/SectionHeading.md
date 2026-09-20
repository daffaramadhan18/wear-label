---
category: Typography
keywords: [section heading, h2, section title, view all]
---
Section header: heading and optional action on one baseline over a section rule.

The heading is Playfair at the H2 step; the body paragraph sits below at the
readable measure.

## Notes

- `id` is required so the enclosing `Section` can point `labelledBy` at it.
- `action` is for the section's trailing link ("View all"). It sits flush right
  and shrinks rather than wrapping — a `ButtonLink` with `variant="link"` is the
  idiomatic choice.
- Both strings go through `Copy`; `""` renders a placeholder.

```jsx
<SectionHeading
  id="featured-heading"
  heading={featured.heading}
  body={featured.body}
  action={<ButtonLink href="/shop" variant="link">View all</ButtonLink>}
/>
```
