import type { Metadata } from "next";
import { CartLines } from "@/components/cart/cart-lines";
import { OrderSummary } from "@/components/cart/order-summary";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cart as cartCopy, nav, ui } from "@/lib/content/site";
import { getCart } from "@/lib/shopify/cart";

/**
 * The bag.
 *
 * Presentation over Shopify's cart, and nothing more: the lines, the subtotal and the
 * hand-off. Quantity and removal post to Server Functions in `lib/shopify/actions`,
 * which is also the only place that touches the cart cookie. Nothing on this page
 * computes a price, a shipping rate or a total.
 *
 * An empty bag is a state, not an error, so it gets the design's own block and a way
 * back into the catalogue rather than an empty table.
 */

export const metadata: Metadata = { title: cartCopy.heading };

export default async function CartPage() {
  const cart = await getCart();
  const lines = cart?.lines ?? [];

  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs
        trail={[{ label: nav.primary[0].label, href: "/" }, { label: cartCopy.heading }]}
        className="mb-block"
      />

      <h1 className="text-h1 leading-h1">{cartCopy.heading}</h1>

      {cart && lines.length > 0 ? (
        /*
         * Three children rather than a summary beside a stacked column, so the
         * order can differ by width: on a phone the summary follows the lines
         * directly, ahead of "Continue shopping", which would otherwise put
         * checkout at the very bottom of a long page. The explicit row and column
         * placement from `lg` up reproduces the design's two-column layout
         * exactly.
         */
        <div className="mt-block-lg grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-x-12 lg:gap-y-8">
          <div className="lg:col-start-1 lg:row-start-1">
            <CartLines lines={lines} />
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <OrderSummary cart={cart} />
          </div>

          <ButtonLink
            href="/shop"
            variant="outline"
            className="self-start lg:col-start-1 lg:row-start-2"
          >
            {ui.continueShopping}
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 py-section text-center">
          <p className="font-display text-h2 leading-h2 text-ink">{cartCopy.empty.heading}</p>
          <p className="text-small text-ink-muted">{cartCopy.empty.body}</p>
          <ButtonLink href="/shop" size="lg" className="mt-2">
            {cartCopy.empty.cta}
          </ButtonLink>
        </div>
      )}
    </Container>
  );
}
