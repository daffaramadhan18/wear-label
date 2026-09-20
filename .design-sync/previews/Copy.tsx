import { Copy } from "wear-label";

/**
 * The placeholder system, and the single most important thing to understand about
 * this design system.
 *
 * Several slots of brand copy are still unwritten — About Us, My Account, the 404,
 * and every product's Details and Fabric & care — so `lib/content/site.ts` holds
 * empty strings for them and every text slot goes through `Copy`.
 *
 * Given a real string it renders **exactly that string and nothing else**. Given an
 * empty one it renders a labelled block sized in `em`, so it inherits the
 * surrounding type size: a heading placeholder is heading-sized, a caption
 * placeholder caption-sized. That is what keeps the page rhythm final before any
 * copy exists, with no layout shift when it arrives.
 *
 * `label` names the missing field, so the block says what belongs there rather than
 * just being grey.
 */

/** With a real value, Copy is invisible — it renders the string, full stop. */
export const WithValue = () => (
  <p className="text-body leading-body text-ink-body">
    <Copy value="Handwoven linen and cotton, sewn in small runs in Bandung." label="tagline" />
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

/** The two side by side — same slot, same size, written or not. */
export const BothStates = () => (
  <div className="flex max-w-lg flex-col gap-6">
    <p className="text-body leading-body text-ink-body">
      <Copy
        value="Ships from Bandung within 1–2 working days. One free size exchange within 14 days; made-to-order pieces are final sale."
        label="shipping"
        lines={2}
      />
    </p>
    <p className="text-body leading-body text-ink-body">
      <Copy value="" label="fabric & care" lines={2} />
    </p>
  </div>
);

/** `inline` puts the bar and label side by side, for short strings in a control. */
export const Inline = () => (
  <p className="text-small text-ink-muted">
    <Copy value="" label="price" inline />
  </p>
);
