import { ServiceBand } from "wear-label";
import { home } from "@/lib/content/site";

/**
 * The three-up service band: rules top and bottom, a camel mark in a circle, then
 * the promise and its detail.
 *
 * The mark is chosen by NAME, not passed as a node — `icon` is a string that
 * selects from the set in `components/ui/icons.tsx` ("shipping", "support",
 * "exchange"). An unrecognised name falls back to the shipping mark rather than
 * rendering an empty circle, so a typo in the content module degrades quietly.
 *
 * It divides horizontally at `md` and stacks with hairline rules below that.
 *
 * The band is currently OFF the home page — the component and its copy both stay,
 * so restoring it is one block in `app/page.tsx`.
 */

/** The three promises as the storefront states them. */
export const Default = () => <ServiceBand services={home.services} />;

/**
 * Two promises rather than three. The grid divides evenly on whatever it is
 * given, so dropping one is a content change and nothing else.
 */
export const TwoUp = () => <ServiceBand services={home.services.slice(0, 2)} />;
