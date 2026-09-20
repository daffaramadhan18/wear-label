---
category: Structure
keywords: [container, gutter, max width, measure, wrapper]
---
The page gutter and maximum content width, both tokens.

Max width is `--container-content` (80rem); horizontal padding is
`--spacing-gutter` (clamped 1.5–4rem). Because both are tokens, the whole site's
measure changes from one edit.

## Notes

- `Section` already wraps its children in a `Container`. Do not nest a second one
  inside a `Section` — you will get a double gutter.
- Reach for this directly only for content outside a `Section`, such as site
  chrome.

```jsx
<Container>{children}</Container>
```
