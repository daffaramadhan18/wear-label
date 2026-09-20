import { SectionHeading, ButtonLink } from "wear-label";
import { home } from "@/lib/content/site";

/**
 * Section header: heading and optional action share one baseline over a section
 * rule, with the body paragraph below at the readable measure.
 *
 * `id` is required so the enclosing `Section` can point `labelledBy` at it. Use
 * `action` for the section's view-all style link — it sits flush right and shrinks
 * rather than wrapping.
 */

/** The home page's New arrivals band, with its real view-all action. */
export const WithAction = () => (
  <SectionHeading
    id="preview-section-arrivals"
    heading={home.arrivals.heading}
    body=""
    action={
      <ButtonLink href={home.arrivals.href} variant="link">
        {home.arrivals.cta}
      </ButtonLink>
    }
  />
);

/** Heading, rule, body — no action. */
export const Default = () => (
  <SectionHeading
    id="preview-section-heading"
    heading="From our customers"
    body="Twenty reviews, reproduced exactly as they were written."
  />
);

/** Unwritten copy — the placeholders keep the rule and the rhythm in place. */
export const Placeholder = () => (
  <SectionHeading id="preview-section-empty" heading="" body="" />
);
