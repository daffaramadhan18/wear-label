---
category: Cart
keywords: [order summary, subtotal, total, checkout, promo code]
---
The bag's summary panel, on the inert aurora.

It shows what Shopify knows and says so about what it does not.

## Notes

- **Shipping is quoted by the courier app during checkout** — Indonesian couriers are
  not native to Shopify — and tax is Shopify's to add, so there is no shipping
  selector and the total equals the subtotal. A rate printed here would be invented,
  and a checkout that then disagreed with it is worse than "Calculated at checkout".
- **Checkout is a redirect** to `cart.checkoutUrl`; a custom checkout UI needs
  Shopify Plus. When there is no url the action is plainly disabled with the reason
  beside it rather than pretending.
- The promo field submits for real and reports that discounts are validated by
  Shopify. It is deliberately not disabled: a dead control reads as broken.

```jsx
<OrderSummary cart={cart} />
```
