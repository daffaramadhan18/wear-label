---
category: Actions
keywords: [link button, anchor, navigate, cta]
---
An anchor styled exactly like Button — use it whenever the action navigates.

Because it is a real link it keeps middle-click, open-in-new-tab and the
browser's own affordances. Takes the same `variant` and `size` as `Button`.

## Notes

- `href` is required. There is no `disabled` state — only a real `<button>` can
  be disabled; if an action can be unavailable, use `Button`.
- The `link` variant is the underlined text action and is not uppercase.

```jsx
<ButtonLink href="/shop" variant="primary">Shop the collection</ButtonLink>
<ButtonLink href="/shop" variant="link">View all</ButtonLink>
```
