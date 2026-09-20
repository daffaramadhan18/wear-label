import { TestimonialWall } from "wear-label";
import { home } from "@/lib/content/site";

/**
 * "From our customers" — the voices wall.
 *
 * Four vertical tracks on a plane tilted away from the reader, each carrying five
 * reviews twice and travelling exactly one copy per cycle. **The motion is pure
 * CSS** (`.wl-voices-*` in `globals.css`), so this stays a Server Component and the
 * wall costs no renders and no JavaScript.
 *
 * The geometry is measured, not eyeballed: a long 2200px perspective (at 300px the
 * tracks' far ends cross the camera plane), per-track resting offsets so a reversed
 * track does not run out of content, and four different durations — equal ones lock
 * into step within seconds and the wall reads as one sliding block.
 *
 * **The quotations are real Shopee reviews, verbatim.** That is the whole reason
 * this section is allowed where a star rating is not: it reproduces what customers
 * wrote instead of synthesising a score. They are in Indonesian while the site is
 * in English, and they stay that way — translating a quotation turns it into a
 * paraphrase. Never edit, tidy or add one that did not come from the store.
 *
 * Twenty reviews, four columns of five. Change the count and it re-slices, but keep
 * it a multiple of four or the last column runs short. An empty array renders
 * nothing.
 *
 * `prefers-reduced-motion` does not merely pause it — a stopped tilted wall holds
 * most of its reviews outside a stage that clips at 560px, so it flattens to a
 * plain grid instead. Below `md` it lies down into a horizontal snap rail.
 */

/** The wall as the home page renders it: all twenty reviews, four columns. */
export const Default = () => (
  <TestimonialWall heading={home.voices.heading} reviews={home.voices.reviews} />
);

/**
 * Eight reviews — two columns fill, the other two get nothing and are skipped
 * rather than rendered empty.
 */
export const TwoColumns = () => (
  <TestimonialWall
    heading={home.voices.heading}
    reviews={home.voices.reviews.slice(0, 10)}
  />
);
