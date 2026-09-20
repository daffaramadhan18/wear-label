import { Eyebrow, SectionHeading } from "wear-label";

/**
 * The small uppercase camel label that sits above a heading — 11px at 0.18em
 * tracking in `--color-ink-subtle`, against the heading's espresso.
 *
 * It is a label, not a heading: it never takes a heading level, so it cannot
 * disturb the page's `h1`–`h3` order.
 */

/** On its own. */
export const Default = () => <Eyebrow>Made to order</Eyebrow>;

/** Where it belongs — above a section heading, which is how every band opens. */
export const AboveHeading = () => (
  <div className="flex flex-col gap-3">
    <Eyebrow>New arrivals</Eyebrow>
    <SectionHeading
      id="preview-eyebrow-heading"
      heading="The Dry Season Collection"
      body="Handwoven linen and cotton poplin, cut loose and sewn in small runs."
    />
  </div>
);

/** The labels the storefront actually uses, so the tracking reads at length. */
export const InUse = () => (
  <div className="flex flex-col gap-4">
    <Eyebrow>New arrivals</Eyebrow>
    <Eyebrow>Made to order</Eyebrow>
    <Eyebrow>Limited run</Eyebrow>
    <Eyebrow>Essentials</Eyebrow>
  </div>
);
