import { AuroraBand, Eyebrow, ButtonLink } from "wear-label";

/**
 * A band with the aurora behind its contents — the wrapper to reach for, rather
 * than placing `Aurora` yourself.
 *
 * It supplies the two things a hand-rolled version gets wrong: `isolate`, which
 * keeps the `soft-light` blend against this band instead of the whole page, and a
 * `w-full` content wrapper, without which a flex parent shrinks the contents to
 * the width of the text.
 *
 * As with `Aurora`, **`tone` has to match the band's own background** — the veil
 * is painted in the surface colour, and a mismatch draws a visible rectangle. Each
 * cell below pairs them.
 *
 * `as` picks the element so the band can be the `section`, `aside` or `footer` it
 * really is; anything else (`aria-labelledby`, `className`) passes straight
 * through.
 */

/** The made-to-order band: the one place the wash runs full width. */
export const Band = () => (
  <AuroraBand tone="canvas" origin="top-right" className="bg-canvas">
    <div className="flex flex-col items-start gap-5 p-10">
      <Eyebrow>Made to order</Eyebrow>
      <h2 className="max-w-[15ch] text-h1 leading-h1">Cut to your measurements</h2>
      <p className="wl-measure text-body leading-body text-ink-body">
        Send us your measurements and choose a colourway. The studio cuts a single
        piece for you and ships it within ten working days.
      </p>
      <ButtonLink href="/shop?made-to-order=1" size="lg" className="mt-2">
        Start an order
      </ButtonLink>
    </div>
  </AuroraBand>
);

/** `as="aside"` on inert, at reduced intensity — the bag's summary panel. */
export const AsAside = () => (
  <div className="max-w-100">
    <AuroraBand
      as="aside"
      tone="inert"
      origin="top-right"
      intensity={0.7}
      className="rounded-sm bg-inert p-9"
    >
      <div className="flex flex-col gap-4">
        <h2 className="font-body text-micro uppercase tracking-label text-ink-subtle">
          Order summary
        </h2>
        <div className="flex items-baseline justify-between border-t border-rule pt-4">
          <span className="font-display text-h2 leading-h2 text-ink">Total</span>
          <span data-numeric className="font-display text-h2 leading-h2 text-ink">
            Rp 483.400
          </span>
        </div>
      </div>
    </AuroraBand>
  </div>
);

/** On the espresso surface, where the stop list inverts with the palette. */
export const Inverted = () => (
  <AuroraBand tone="invert" origin="bottom-left" className="bg-invert">
    <div className="flex flex-col gap-3 p-10 text-ink-invert">
      <Eyebrow className="text-ink-invert-muted">Letters from the studio</Eyebrow>
      <p className="wl-measure text-body leading-body text-ink-invert-muted">
        New colourways, restocks and studio notes. No more than twice a month.
      </p>
    </div>
  </AuroraBand>
);
