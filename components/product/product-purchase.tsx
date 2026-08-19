"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/ui/save-button";
import { ui } from "@/lib/content/site";
import { NO_NOTICE, type FormNotice } from "@/lib/shopify/form-state";
import type { Product, ProductOptionValue } from "@/lib/shopify";

/**
 * Size, colourway, quantity, add to bag.
 *
 * The one interactive block on the product page, and the only client code in it.
 * Shopify holds a variant per combination of option values, so the two grids
 * resolve to a single variant id, which is the only thing the form actually posts —
 * price, stock and availability are all read from that variant and never computed
 * here.
 *
 * A combination with no stock does not silently do nothing: the option value is
 * disabled and struck through where the whole value is gone, and where the pair is
 * the problem the action is disabled and says so in words. Sold out is never
 * communicated by colour alone.
 *
 * `useActionState` is what lets the confirmation land in a live region. The header's
 * badge updates from the same round trip, but a reader who cannot see the badge move
 * still needs to be told.
 */
const MAX_QUANTITY = 10;

function firstAvailable(values: ProductOptionValue[]): string {
  return (values.find((value) => value.available) ?? values[0])?.name ?? "";
}

function optionValues(product: Product, name: string): ProductOptionValue[] {
  return product.options.find((option) => option.name === name)?.values ?? [];
}

export function ProductPurchase({
  product,
  action,
}: {
  product: Product;
  action: (previous: FormNotice, formData: FormData) => Promise<FormNotice>;
}) {
  const sizes = optionValues(product, "Size");
  const colours = optionValues(product, "Colourway");

  const [size, setSize] = useState(() => firstAvailable(sizes));
  const [colour, setColour] = useState(() => firstAvailable(colours));
  const [quantity, setQuantity] = useState(1);
  const [notice, formAction] = useActionState(action, NO_NOTICE);

  const variant = product.variants.find((entry) =>
    entry.selectedOptions.every(
      (option) =>
        (option.name !== "Size" || option.value === size) &&
        (option.name !== "Colourway" || option.value === colour),
    ),
  );

  const purchasable = Boolean(variant?.availableForSale);

  return (
    <form action={formAction} id="options" className="flex flex-col gap-5.5">
      <input type="hidden" name="variantId" value={variant?.id ?? ""} />
      <input type="hidden" name="quantity" value={quantity} />

      <fieldset className="flex flex-col gap-3 border-t border-hairline pt-5.5">
        <legend className="text-micro uppercase tracking-nav text-ink-subtle">{ui.size}</legend>
        <div className="flex flex-wrap gap-2.5">
          {sizes.map((value) => (
            <button
              key={value.name}
              type="button"
              onClick={() => setSize(value.name)}
              disabled={!value.available}
              aria-pressed={value.name === size}
              className={`inline-flex h-11.5 min-w-13.5 cursor-pointer items-center justify-center rounded-xs border px-3 text-caption tracking-wide transition-colors duration-(--duration-base) disabled:cursor-not-allowed disabled:border-inert-border disabled:bg-inert disabled:text-on-inert disabled:line-through ${
                value.name === size
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-canvas text-ink-body hover:border-brand hover:text-brand"
              }`}
            >
              {value.name}
              {!value.available ? <span className="sr-only"> — {ui.soldOut}</span> : null}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <legend className="text-micro uppercase tracking-nav text-ink-subtle">
            {ui.colourway}
          </legend>
          <span className="text-caption text-ink-muted">{colour}</span>
        </div>
        <div className="flex flex-wrap gap-3.5">
          {colours.map((value) => (
            <button
              key={value.name}
              type="button"
              onClick={() => setColour(value.name)}
              disabled={!value.available}
              aria-pressed={value.name === colour}
              title={value.name}
              style={{ backgroundColor: value.swatch }}
              className={`size-10 cursor-pointer rounded-pill border border-line transition-shadow duration-(--duration-base) disabled:cursor-not-allowed disabled:opacity-40 ${
                value.name === colour ? "ring-2 ring-brand ring-offset-2" : "hover:ring-1 hover:ring-line"
              }`}
            >
              <span className="sr-only">
                {value.name}
                {!value.available ? ` — ${ui.soldOut}` : ""}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-stretch gap-3.5">
        <div className="inline-flex items-center rounded-xs border border-line bg-canvas">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            className="h-14 w-12 cursor-pointer text-h3 text-brand transition-colors duration-(--duration-base) hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-on-inert"
          >
            −<span className="sr-only">{ui.decrease}</span>
          </button>
          <output
            data-numeric
            aria-label={ui.quantity}
            className="w-13 text-center text-body text-ink"
          >
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
            disabled={quantity >= MAX_QUANTITY}
            className="h-14 w-12 cursor-pointer text-h3 text-brand transition-colors duration-(--duration-base) hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-on-inert"
          >
            +<span className="sr-only">{ui.increase}</span>
          </button>
        </div>

        <Button type="submit" size="lg" disabled={!purchasable} className="flex-1">
          {ui.addToBag}
        </Button>

        <SaveButton
          handle={product.handle}
          title={product.title}
          className="size-14 rounded-xs border border-ink-subtle hover:bg-inert"
        />
      </div>

      {/* Present from first render, so the confirmation is an update to a region
          that already exists rather than a new one appearing. */}
      <p aria-live="polite" className="min-h-5 text-caption text-ink-muted">
        {purchasable ? notice.message : ui.unavailableVariant}
      </p>
    </form>
  );
}
