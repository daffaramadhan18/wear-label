import { Copy } from "wear-label";

/**
 * The placeholder system, and the single most important thing to understand about
 * this design system.
 *
 * Brand copy has not been written, so lib/content/site.ts holds empty strings and
 * every text slot goes through Copy. Given a real string it renders exactly that
 * string and nothing else. Given an empty one it renders a labelled block sized in
 * `em`, so it inherits the surrounding type size — a heading placeholder is
 * heading-sized, a caption placeholder caption-sized. That is what keeps the page
 * rhythm final before any copy exists, with no layout shift when it arrives.
 */

/** With a real value, Copy is invisible — it renders the string, full stop. */
export const WithValue = () => (
  <p className="text-body leading-body text-ink-body">
    <Copy value="Handwoven linen" label="material" />
  </p>
);

/** Empty value → labelled block. Multi-line widths cycle so it reads as prose. */
export const Placeholder = () => (
  <div className="flex max-w-lg flex-col gap-8">
    <h2 className="text-h2 leading-h2">
      <Copy value="" label="heading" />
    </h2>
    <p className="text-body leading-body">
      <Copy value="" label="intro" lines={3} />
    </p>
  </div>
);

/** `inline` puts the bar and label side by side, for short strings in a control. */
export const Inline = () => (
  <p className="text-small text-ink-muted">
    <Copy value="" label="price" inline />
  </p>
);
