import { CartLines } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * The lines in the bag.
 *
 * **No client code at all.** Each line is ONE form with three submit buttons: the
 * quantity buttons post the value they would set (same `name="quantity"`, different
 * values) and the remove button retargets that same form at a different Server
 * Function through `formAction`. Nested forms are illegal, which is what rules out
 * a form per button — do not "fix" this into one.
 *
 * Decrementing stops at one; removing a line is the × and only the ×, so a
 * mis-aimed click on a stepper can never delete something.
 *
 * The column headers exist only from `md` up. Below that each line stacks and every
 * value carries its own label — a bare number in a column with no header is
 * meaningless.
 *
 * A line whose variant is no longer purchasable keeps its row and says "Sold out"
 * in words rather than vanishing from under the reader.
 */
const line = (handle: string, quantity: number, available = true) => {
  const product = products.find((p) => p.handle === handle)!;
  const unit = Number(product.priceRange.minVariantPrice!.amount);

  return {
    id: `line-${handle}`,
    variantId: `${product.id}-m-camel`,
    quantity,
    variantTitle: "M / Camel",
    available,
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

/** A bag with two pieces, one of them at quantity two. */
export const Default = () => (
  <CartLines lines={[line("basic-linen-cullote", 1), line("moa-pants", 2)]} />
);

/** One line, at quantity one — the decrement stops here rather than removing it. */
export const SingleLine = () => <CartLines lines={[line("taka-flare-pants", 1)]} />;

/**
 * A line that has gone out of stock since it was added. It keeps its row and states
 * it in words, so nothing disappears from under the reader.
 */
export const WithSoldOutLine = () => (
  <CartLines
    lines={[
      line("cerra-loose-pants", 1),
      line("milly-stripe-pants", 1, false),
      line("dalia-wide-pants", 3),
    ]}
  />
);
