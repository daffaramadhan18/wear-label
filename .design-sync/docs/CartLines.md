---
category: Cart
keywords: [cart lines, bag lines, quantity stepper, remove, order items]
---
The lines in the bag — image, name, variant, price, quantity stepper and remove.

**No client code at all.** Each line is ONE form with three submit buttons: the
quantity buttons post the value they would set (same `name="quantity"`, different
values) and the remove button retargets that same form at a different Server Function
through `formAction`.

## Notes

- **Nested forms are illegal, which is what rules out a form per button.** Do not
  "fix" this into one.
- Decrementing stops at one; removing a line is the × and only the ×, so a mis-aimed
  click on a stepper can never delete something.
- The column headers exist only from `md` up. Below that each line stacks and every
  value carries its own label — a bare number in a column with no header is
  meaningless.
- A line whose variant is no longer purchasable keeps its row and says "Sold out" in
  words rather than vanishing from under the reader.

```jsx
<CartLines lines={cart.lines} />
```
