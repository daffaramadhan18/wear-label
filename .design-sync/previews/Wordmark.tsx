import { Wordmark } from "wear-label";

/**
 * The Wear Label logotype. It is drawn artwork and is never set in a typeface —
 * so there is no font, weight or tracking to get right, only the correct file.
 *
 *   horizontal   the default, for headers
 *   stacked      for narrow or square space
 *
 * `onDark` swaps to the cream artwork rather than filtering the image: the taupe
 * logotype on an espresso surface would fail contrast, so the file changes.
 * The link target is "/" and the company name is carried by an adjacent sr-only
 * span, so the alt text is deliberately empty and screen readers do not hear the
 * name twice.
 */

/** Horizontal lockup on cream — how it appears in the site header. */
export const Horizontal = () => (
  <div className="bg-canvas p-6">
    <Wordmark />
  </div>
);

/** Stacked lockup, for narrow or square space. */
export const Stacked = () => (
  <div className="bg-canvas p-6">
    <Wordmark variant="stacked" height={64} />
  </div>
);

/** `onDark` on an espresso surface — the cream artwork, not a filtered one. */
export const OnDark = () => (
  <div className="flex flex-col gap-6 bg-invert p-6">
    <Wordmark onDark />
    <Wordmark onDark variant="stacked" height={64} />
  </div>
);

/** `height` in px; the lockup holds its ratio. */
export const Sizes = () => (
  <div className="flex flex-col items-start gap-5 bg-canvas p-6">
    <Wordmark height={20} />
    <Wordmark height={30} />
    <Wordmark height={48} />
  </div>
);
