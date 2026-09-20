---
category: Home
keywords: [service band, promises, usp, three up, shipping support exchange]
---
The three-up service band: a camel mark in a circle, then the promise and its detail.

Rules top and bottom; it divides horizontally at `md` and stacks with hairline rules
below that.

## Notes

- **The mark is chosen by NAME, not passed as a node.** `icon` is a string that
  selects from the set in `components/ui/icons.tsx` — `"shipping"`, `"support"`,
  `"exchange"`. An unrecognised name falls back to the shipping mark rather than
  rendering an empty circle, so a typo degrades quietly.
- Adding a fourth promise is a content change plus one entry in the component's
  mark map.
- The grid divides evenly on whatever it is given.

```jsx
<ServiceBand services={home.services} />
```
