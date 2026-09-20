---
category: Actions
keywords: [save button, wishlist, save for later, localStorage, aria-pressed]
---
Save for later — a browser-local wishlist toggle.

**Browser-local, deliberately.** Whether the storefront has customer accounts at all
is still an open decision, and a wishlist that outlives the browser is a customer
record — which belongs in Shopify, not here. So this keeps a list of product handles
in `localStorage` and nothing else: no request, no account, nothing to migrate but
the key name if the decision goes the other way.

## Notes

- The list is read with `useSyncExternalStore`, not copied into state by an effect.
  That makes the server render defined, keeps every button for the same handle in
  step, and picks up a change from another tab through the `storage` event.
- `aria-pressed` carries the state and an `sr-only` span names it — the camel fill
  is never doing that job alone.
- `title` is the product name, so the control's accessible name says what it saves.

```jsx
<SaveButton handle="moa-pants" title="Moa Pants" className="wl-tap size-9.5 rounded-xs bg-canvas/95" />
```
