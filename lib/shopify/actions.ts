"use server";

import { refresh } from "next/cache";
import { addCartLine, removeCartLine, setCartLineQuantity } from "./cart";
import { NO_NOTICE, type FormNotice } from "./form-state";
import { ui } from "@/lib/content/site";

/**
 * Server Functions for everything that mutates.
 *
 * They live here because `lib/shopify/` is the only place Shopify is touched, and
 * because a cookie can only be written inside a Server Function — never during
 * render. Each one is a thin adapter: read the form, call `./cart`, refresh. No
 * commerce arithmetic, no validation of prices or stock, since both are Shopify's
 * to own.
 *
 * `refresh()` rather than `revalidatePath()`: the bag is request state behind a
 * cookie, not a cached route, so what needs re-reading is the client router's copy
 * of the current tree.
 */

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function count(value: FormDataEntryValue | null, fallback: number): number {
  const parsed = Number(text(value));
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

/**
 * Add to bag. Answers with a notice rather than returning nothing, so the product
 * page can confirm in a live region what the header's badge only shows visually.
 */
export async function addToBag(
  _previous: FormNotice,
  formData: FormData,
): Promise<FormNotice> {
  const variantId = text(formData.get("variantId"));
  if (!variantId) return NO_NOTICE;

  await addCartLine(variantId, Math.max(1, count(formData.get("quantity"), 1)));
  refresh();

  return { status: "ok", message: ui.addedToBag };
}

export async function updateBagLine(formData: FormData): Promise<void> {
  const variantId = text(formData.get("variantId"));
  if (!variantId) return;

  await setCartLineQuantity(variantId, count(formData.get("quantity"), 1));
  refresh();
}

export async function removeBagLine(formData: FormData): Promise<void> {
  const variantId = text(formData.get("variantId"));
  if (!variantId) return;

  await removeCartLine(variantId);
  refresh();
}

/**
 * The two forms whose destination is a Shopify feature that has to be configured
 * in the admin before it can exist here.
 *
 * Discount codes are applied to the Shopify cart (`cartDiscountCodesUpdate`) and
 * validated by Shopify; newsletter consent is a customer record with marketing
 * consent. Neither can be faked convincingly and neither should be: an input that
 * silently swallows what you typed is worse than one that says it is not
 * connected yet. So both submit, and both answer honestly.
 */
export async function subscribeToNewsletter(
  _previous: FormNotice,
  formData: FormData,
): Promise<FormNotice> {
  const email = text(formData.get("email"));
  if (!email) return NO_NOTICE;

  return { status: "unavailable", message: ui.newsletterUnavailable };
}

export async function applyDiscountCode(
  _previous: FormNotice,
  formData: FormData,
): Promise<FormNotice> {
  const code = text(formData.get("code"));
  if (!code) return NO_NOTICE;

  return { status: "unavailable", message: ui.discountUnavailable };
}
