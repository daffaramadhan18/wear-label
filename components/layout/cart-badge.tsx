import { getCartCount } from "@/lib/shopify/cart";
import { ui } from "@/lib/content/site";

/**
 * The count on the header's bag.
 *
 * Its own async component so that reading the bag cookie makes only this subtree
 * dynamic, instead of the header — and so the header can stay a Client Component
 * for its mobile disclosure while the count is still server-rendered. Renders
 * nothing when the bag is empty: an empty bag needs no badge.
 *
 * The number is decorative; the count is announced through the bag link's
 * accessible name, which is why the visible span is `aria-hidden`.
 */
export async function CartBadge() {
  const count = await getCartCount();
  if (count === 0) return null;

  return (
    <>
      <span
        aria-hidden="true"
        data-numeric
        className="absolute right-0.5 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-brand px-1 text-micro leading-none text-on-brand"
      >
        {count}
      </span>
      <span className="sr-only">
        , {count} {count === 1 ? ui.bagCountOne : ui.bagCountMany}
      </span>
    </>
  );
}
