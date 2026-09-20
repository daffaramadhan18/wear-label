---
category: Actions
keywords: [button, action, cta, add to bag, checkout]
---
The action button. Uppercase label at 0.2em tracking, near-square corners, one primary per screen.

Use `Button` when the action stays on the page and `ButtonLink` when it navigates.

## Variants

| variant | use it for |
|---|---|
| `primary` | the single most important action on the screen |
| `outline` | secondary actions beside a primary one |
| `ghost` | low-emphasis actions — cancel, dismiss |
| `link` | an inline text action, e.g. "Size guide". The one variant that is NOT uppercase |
| `checkout` | the espresso full-bleed action, reserved for the checkout step |

## Sizes

`sm` · `md` (default) · `lg`, plus `full` for a full-width action. Pair `checkout`
with `size="full"` — that is how it appears in the design system.

## Notes

- Only a real `<button>` can be disabled, so `disabled` lives here and not on
  `ButtonLink`. Disabled buttons take the inert fill and drop the press nudge.
- Hover changes the fill; the pressed state nudges 1px down.
- The label is always uppercase (except `link`); do not pass pre-uppercased text.

```jsx
<Button variant="primary">Add to bag</Button>
<Button variant="checkout" size="full">Continue to checkout</Button>
```
