import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CloseIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { Price } from "@/components/ui/price";
import { ui } from "@/lib/content/site";
import { removeBagLine, updateBagLine } from "@/lib/shopify/actions";
import type { CartLine } from "@/lib/shopify";

/**
 * The lines in the bag.
 *
 * No client code at all: each line is one form with three submit buttons, so the
 * quantity buttons post the value they would set (`name="quantity"`, and the two
 * buttons carry different values) and the remove button retargets the same form at
 * a different Server Function through `formAction`. Nested forms are illegal, which
 * is what rules out a form per button.
 *
 * Decrementing stops at one; removing a line is the × and only the ×, so a
 * mis-aimed click on a stepper can never delete something.
 *
 * The column headers only exist on wide screens — below that each line stacks and
 * every value carries its own label, since a bare number in a column with no header
 * is meaningless.
 */
export function CartLines({ lines }: { lines: CartLine[] }) {
  return (
    <div className="flex flex-col">
      <div
        aria-hidden="true"
        className="hidden gap-5 border-b border-rule pb-4 text-micro uppercase tracking-nav text-ink-subtle md:grid md:grid-cols-[2.2fr_1fr_1fr_1fr_2.5rem]"
      >
        <span>{ui.item}</span>
        <span>{ui.price}</span>
        <span>{ui.quantity}</span>
        <span>{ui.lineTotal}</span>
        <span />
      </div>

      <ul>
        {lines.map((line) => (
          <li
            key={line.id}
            className="grid grid-cols-2 items-center gap-5 border-b border-hairline py-6 md:grid-cols-[2.2fr_1fr_1fr_1fr_2.5rem]"
          >
            <div className="col-span-2 flex items-center gap-4.5 md:col-span-1">
              <div className="w-22 shrink-0">
                <Media
                  image={line.product.featuredImage}
                  sizes="88px"
                  ratio="4 / 5"
                  label="Product photo"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/shop/${line.product.handle}`}
                  className="font-display text-h3 leading-h3 text-ink transition-colors duration-(--duration-base) hover:text-brand"
                >
                  {line.product.title}
                </Link>
                <span className="text-caption text-ink-subtle">{line.variantTitle}</span>
                {!line.available ? (
                  <Badge tone="inert" className="mt-1 self-start">
                    {ui.soldOut}
                  </Badge>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-micro uppercase tracking-nav text-ink-subtle md:hidden">
                {ui.price}
              </span>
              <Price price={line.unitPrice} />
            </div>

            <form action={updateBagLine} className="flex flex-col gap-1">
              <input type="hidden" name="variantId" value={line.variantId} />
              <span className="text-micro uppercase tracking-nav text-ink-subtle md:hidden">
                {ui.quantity}
              </span>
              <div className="inline-flex w-fit items-center rounded-xs border border-line bg-canvas">
                <button
                  type="submit"
                  name="quantity"
                  value={line.quantity - 1}
                  disabled={line.quantity <= 1}
                  className="wl-tap h-10 w-9 cursor-pointer text-body text-brand transition-colors duration-(--duration-base) hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-on-inert"
                >
                  −<span className="sr-only">{ui.decrease}</span>
                </button>
                <span data-numeric className="w-9 text-center text-small text-ink">
                  {line.quantity}
                </span>
                <button
                  type="submit"
                  name="quantity"
                  value={line.quantity + 1}
                  className="wl-tap h-10 w-9 cursor-pointer text-body text-brand transition-colors duration-(--duration-base) hover:bg-surface-muted"
                >
                  +<span className="sr-only">{ui.increase}</span>
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-1">
              <span className="text-micro uppercase tracking-nav text-ink-subtle md:hidden">
                {ui.lineTotal}
              </span>
              <Price price={line.lineTotal} className="font-medium" />
            </div>

            {/* Same form as the quantity stepper, retargeted. */}
            <form action={updateBagLine} className="justify-self-end">
              <input type="hidden" name="variantId" value={line.variantId} />
              <button
                type="submit"
                formAction={removeBagLine}
                className="wl-tap inline-flex size-9 cursor-pointer items-center justify-center rounded-xs text-ink-muted transition-colors duration-(--duration-base) hover:bg-surface-muted hover:text-ink"
              >
                <CloseIcon className="size-4" />
                <span className="sr-only">
                  {ui.remove}: {line.product.title}
                </span>
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
