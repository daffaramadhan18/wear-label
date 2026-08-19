import { AuroraBand } from "@/components/ui/aurora";
import { Button, ButtonLink } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { cart as cartCopy, ui } from "@/lib/content/site";
import { applyDiscountCode } from "@/lib/shopify/actions";
import { NoticeForm } from "@/components/ui/notice-form";
import type { Cart } from "@/lib/shopify";

/**
 * The bag's summary panel.
 *
 * It shows what Shopify knows and says so about what it does not. Shipping is quoted
 * by the courier app during checkout — Indonesian couriers are not native to Shopify
 * — and tax is Shopify's to add, so there is no shipping selector here and the total
 * is the subtotal. Putting a rate on this page would mean inventing one, and a
 * checkout that then disagreed with it is worse than a line that says "calculated at
 * checkout".
 *
 * Checkout itself is a redirect to `cart.checkoutUrl`, because a custom checkout UI
 * needs Shopify Plus and this is not that. Until the store is connected there is no
 * url, so the action is plainly disabled with the reason next to it rather than
 * pretending.
 */
export function OrderSummary({ cart }: { cart: Cart }) {
  const { summary } = cartCopy;

  return (
    <AuroraBand
      as="aside"
      tone="inert"
      origin="top-right"
      intensity={0.7}
      className="rounded-sm bg-inert p-9"
      aria-labelledby="summary-heading"
    >
      <div className="flex flex-col gap-5">
        <h2
          id="summary-heading"
          className="font-body text-micro uppercase tracking-label text-ink-subtle"
        >
          {summary.heading}
        </h2>

        <div className="flex items-baseline justify-between gap-4 text-small text-ink-body">
          <span>{summary.subtotal}</span>
          <Price price={cart.cost.subtotalAmount} />
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-5 text-small text-ink-body">
          <span>{summary.shipping}</span>
          <span className="text-caption text-ink-muted">{summary.shippingNote}</span>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-5">
          <span className="font-display text-h2 leading-h2 text-ink">{summary.total}</span>
          <Price price={cart.cost.totalAmount} size="display" />
        </div>

        {cart.checkoutUrl ? (
          <ButtonLink href={cart.checkoutUrl} variant="checkout" size="full">
            {summary.cta}
          </ButtonLink>
        ) : (
          <>
            <Button variant="checkout" size="full" disabled>
              {summary.cta}
            </Button>
            <p className="text-caption leading-snug text-ink-muted">{ui.checkoutUnavailable}</p>
          </>
        )}

        <NoticeForm
          action={applyDiscountCode}
          label={ui.promoCode}
          noticeClassName="text-ink-muted"
        >
          <div className="flex flex-wrap gap-2.5">
            <label htmlFor="promo-code" className="sr-only">
              {ui.promoCode}
            </label>
            <input
              id="promo-code"
              type="text"
              name="code"
              autoComplete="off"
              placeholder={ui.promoCode}
              className="min-h-12 min-w-0 flex-1 rounded-sm border border-line bg-canvas px-4 text-small text-ink placeholder:text-ink-subtle focus:border-brand"
            />
            <button
              type="submit"
              className="min-h-12 cursor-pointer rounded-sm border border-line px-5 text-micro uppercase tracking-nav text-ink-muted transition-colors duration-(--duration-base) hover:border-brand hover:text-brand"
            >
              {ui.apply}
            </button>
          </div>
        </NoticeForm>

        <p className="text-caption leading-snug text-ink-subtle">{summary.note}</p>
      </div>
    </AuroraBand>
  );
}
