---
category: Shop
keywords: [results toolbar, sort, result count, catalogue toolbar]
---
The row above the catalogue grid: the result count and what is narrowing it, then the sort control.

**Sort is the one facet that stays a form** rather than becoming a set of links — a
`<select>` is the right control for four mutually exclusive orderings.

## Notes

- It is a plain `GET`, so it needs no JavaScript. The hidden fields carry the active
  filters through, and `page` is deliberately NOT among them, because a re-sorted
  catalogue starts again at page one.
- `filterLabel` is what is currently narrowing the catalogue, already in words — the
  page composes that string, so the toolbar never has to know how a facet is
  phrased.

```jsx
<ResultsToolbar query={query} count={11} filterLabel="Everything" />
```
