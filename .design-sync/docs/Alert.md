---
category: Feedback
keywords: [alert, message, error, success, info, inline feedback]
---
Inline message on a warm surface with a 2px rule down the left edge.

## Tones

`success` (sage) · `error` (rust) · `info` (default, warm neutral).

## Notes

- Pass `label` for anything but info. It renders a visually-hidden prefix
  ("Error: ") so the meaning never depends on hue alone — this is the
  accessibility contract of the component, not decoration.
- `tone="error"` also sets `role="alert"`, so it is announced when it appears.
  Do not use it for content that is present on first paint and not urgent.

```jsx
<Alert tone="error" label="Error">
  That size is no longer available.
</Alert>
<Alert tone="info">Orders placed after 2pm ship the next working day.</Alert>
```
