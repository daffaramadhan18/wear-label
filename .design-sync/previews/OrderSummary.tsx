import { OrderSummary } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * The bag's summary panel, on the inert aurora.
 *
 * It shows what Shopify knows and says so about what it does not. Shipping is
 * quoted by the courier app during checkout — Indonesian couriers are not native
 * to Shopify — and tax is Shopify's to add, so there is no shipping selector and
 * the total equals the subtotal. A rate printed here would be invented, and a
 * checkout that then disagreed with it is worse than "Calculated at checkout".
 *
 * Checkout is a redirect to `cart.checkoutUrl`; a custom checkout UI needs Shopify
 * Plus. Until the store is connected there is no url, so the action is plainly
 * disabled with the reason beside it rather than pretending — that is `Default`
 * below, and it is the state the storefront is actually in today.
 *
 * The promo field submits for real and reports that discounts are validated by
 * Shopify. It is deliberately not disabled: a dead control reads as broken.
 */
const line = (handle: string, quantity: number) => {
  const product = products.find((p) => p.handle === handle)!;
  const unit = Number(product.priceRange.minVariantPrice!.amount);

  return {
    id: `line-${handle}`,
    variantId: `${product.id}-m-camel`,
    quantity,
    variantTitle: "M / Camel",
    available: true,
    unitPrice: { amount: String(unit), currencyCode: "IDR" as const },
    lineTotal: { amount: String(unit * quantity), currencyCode: "IDR" as const },
    product: {
      handle: product.handle,
      title: product.title,
      material: product.material,
      featuredImage: product.featuredImage,
    },
  };
};

const cart = (checkoutUrl: string | null) => {
  const lines = [line("basic-linen-cullote", 1), line("moa-pants", 2)];
  const subtotal = lines.reduce((sum, l) => sum + Number(l.lineTotal.amount), 0);
  const amount = { amount: String(subtotal), currencyCode: "IDR" as const };

  return {
    id: "gid://shopify/Cart/1",
    totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    lines,
    cost: { subtotalAmount: amount, totalAmount: amount },
    checkoutUrl,
  };
};

/** Today's state: no store connected, so checkout is disabled and says why. */
export const Default = () => (
  <div className="max-w-100">
    <OrderSummary cart={cart(null)} />
  </div>
);

/** With a store connected, the same panel hands off to Shopify's checkout. */
export const CheckoutReady = () => (
  <div className="max-w-100">
    <OrderSummary cart={cart("https://wearlabel.myshopify.com/checkout")} />
  </div>
);
