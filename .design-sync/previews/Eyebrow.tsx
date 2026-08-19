import { Eyebrow, SectionHeading } from "wear-label";

/** The small uppercase camel label that sits above a heading. */
export const Default = () => <Eyebrow>New arrivals</Eyebrow>;

/**
 * Where it belongs — above a section heading, at 0.18em tracking in camel
 * (--color-ink-subtle) against the heading's espresso.
 */
export const AboveHeading = () => (
  <div className="flex flex-col gap-3">
    <Eyebrow>The collection</Eyebrow>
    <SectionHeading
      id="preview-eyebrow-heading"
      heading="Featured products"
      body="A short section introduction sits here, two lines at the body step."
    />
  </div>
);
