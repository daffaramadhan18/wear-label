import { SectionHeading, ButtonLink } from "wear-label";

/**
 * Section header: heading and optional action share one baseline over a section
 * rule, with the body paragraph below at the readable measure.
 *
 * `id` is required so the enclosing Section can point `labelledBy` at it. Use
 * `action` for the section's "view all" style link — it sits flush right and
 * shrinks rather than wrapping.
 */

/** Heading, rule, body. */
export const Default = () => (
  <SectionHeading
    id="preview-section-heading"
    heading="Featured products"
    body="A short section introduction sits here, two lines at the body step."
  />
);

/** With a trailing action on the heading baseline. */
export const WithAction = () => (
  <SectionHeading
    id="preview-section-heading-action"
    heading="Featured products"
    body="A short section introduction sits here, two lines at the body step."
    action={
      <ButtonLink href="/shop" variant="link">
        View all
      </ButtonLink>
    }
  />
);

/** Unwritten copy — placeholders keep the rule and rhythm in place. */
export const Placeholder = () => (
  <SectionHeading id="preview-section-heading-empty" heading="" body="" />
);
