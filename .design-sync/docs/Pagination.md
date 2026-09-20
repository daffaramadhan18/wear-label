---
category: Shop
keywords: [pagination, paging, page links, aria-current]
---
Catalogue paging — links, so a page is a real URL.

Each link is built by `catalogueHref`, which flips the page and preserves every
other facet, so the back button works and a result set is shareable.

## Notes

- The current page is **not** a link: it carries `aria-current="page"`, which is
  what tells a screen reader where it is. The camel fill is not doing that job
  alone, and the trailing "Page n of m" says the same thing in words.
- **A single page of results renders nothing** — no lone disabled "1".

```jsx
<Pagination query={query} page={2} pageCount={4} />
```
