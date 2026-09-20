import { ProductPurchase } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * Size, colourway, quantity, add to bag — the one interactive block on the product
 * page, and the only client code in it.
 *
 * Shopify holds a variant per combination of option values, so the two grids
 * resolve to a **single variant id, which is the only thing the form actually
 * posts**. Price, stock and availability are read from that variant and never
 * computed here.
 *
 * A combination with no stock does not silently do nothing: the option value is
 * disabled and struck through where the whole value is gone, and where the pair is
 * the problem the action is disabled and says so in words. Sold out is never
 * communicated by colour alone — see `SoldOutSize`, where the unavailable sizes
 * carry a strike as well as the muted fill.
 *
 * `useActionState` is what lets the confirmation land in a live region. The
 * header's badge updates from the same round trip, but a reader who cannot see the
 * badge move still needs to be told.
 *
 * `action` is a Server Function with the `useActionState` signature. The cells pass
 * a plain async function so the card renders without a server; in the app it is
 * `addToBag` from `lib/shopify/actions.ts`.
 */
const noop = async () => ({ status: "idle" as const, message: "" });
const moa = products.find((p) => p.handle === "moa-pants")!;

/** The real block: five sizes, five colourways, every combination in stock. */
export const Default = () => (
  <div className="max-w-110">
    <ProductPurchase product={moa} action={noop} />
  </div>
);

/**
 * Two sizes gone. They are disabled AND struck through, so the state survives
 * without colour — and the grid keeps its shape rather than dropping the values.
 */
export const SoldOutSize = () => (
  <div className="max-w-110">
    <ProductPurchase
      product={{
        ...moa,
        options: moa.options.map((option) =>
          option.name === "Size"
            ? {
                ...option,
                values: option.values.map((value) => ({
                  ...value,
                  available: !["XS", "XL"].includes(value.name),
                })),
              }
            : option,
        ),
        variants: moa.variants.map((variant) => ({
          ...variant,
          availableForSale: !variant.title.startsWith("XS") && !variant.title.startsWith("XL"),
        })),
      }}
      action={noop}
    />
  </div>
);

/** A piece with no stock at all — the action is disabled and states why. */
export const SoldOut = () => (
  <div className="max-w-110">
    <ProductPurchase
      product={{
        ...moa,
        availableForSale: false,
        variants: moa.variants.map((variant) => ({ ...variant, availableForSale: false })),
      }}
      action={noop}
    />
  </div>
);
