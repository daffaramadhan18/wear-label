import { MadeToOrder } from "wear-label";
import { home } from "@/lib/content/site";

/**
 * The made-to-order band — the one place on the home page where the aurora runs
 * at full width.
 *
 * That is the rule for the effect, not a coincidence: the wash is for low-density
 * bands, never behind a garment or the logotype. Copy and the CTA sit left, the
 * stats run down a ruled column on the right from `lg` up and stack under the copy
 * below that.
 *
 * `id` is required — the band points `aria-labelledby` at its own heading, which
 * is what names the region.
 *
 * The design's second action ("How it works") is deliberately absent: there is no
 * page for it yet, and a button that goes nowhere is worse than one button.
 */

/** The band exactly as the home page renders it. */
export const Default = () => (
  <MadeToOrder
    id="preview-mto"
    eyebrow={home.madeToOrder.eyebrow}
    heading={home.madeToOrder.heading}
    body={home.madeToOrder.body}
    cta={home.madeToOrder.cta}
    href={home.madeToOrder.href}
    stats={home.madeToOrder.stats}
  />
);

/**
 * A single stat. The column is a definition list, so it holds whatever the content
 * module gives it — three is the storefront's choice, not the component's.
 */
export const OneStat = () => (
  <MadeToOrder
    id="preview-mto-one"
    eyebrow={home.madeToOrder.eyebrow}
    heading={home.madeToOrder.heading}
    body={home.madeToOrder.body}
    cta={home.madeToOrder.cta}
    href={home.madeToOrder.href}
    stats={home.madeToOrder.stats.slice(0, 1)}
  />
);
