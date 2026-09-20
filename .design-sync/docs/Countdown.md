---
category: Home
keywords: [countdown, timer, limited run, days hours minutes]
---
Time left on a limited run — days, hours and minutes in bordered blocks.

The clock is external state, so it is read with `useSyncExternalStore` rather than
copied into state by an effect. That makes the server render well defined:
`getServerSnapshot` returns null, the markup carries no time at all, and a cached
page can never serve a stale countdown.

## Notes

- It **ticks every thirty seconds, not every second**. Minutes are the smallest unit
  shown, so a per-second interval would repaint the same three numbers sixty times
  over.
- It renders NOTHING in three cases, all deliberate: before hydration, when `endsAt`
  is not a parseable date, and once the run has ended. So an expired or unset run
  removes the blocks instead of showing zeroes.
- `endsAt` is an ISO timestamp.

```jsx
<Countdown endsAt="2026-09-01T00:00:00Z" />
```
