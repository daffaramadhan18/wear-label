import { HeroCarousel } from "wear-label";
import { home, ui } from "@/lib/content/site";

/**
 * The hero — a 600px band with a cream copy card over the photograph, and as many
 * slides as the content module lists.
 *
 * Slides travel sideways rather than crossfading: every slide is parked one band
 * width away on the side it will arrive from, and only the offset changes. The band
 * already clips, so nothing extra hides the parked ones.
 *
 * Rotation rules, in the order they matter:
 *
 *   - It stops on hover and on keyboard focus, so a reader can finish the sentence
 *     they are on and reach the CTA without it moving.
 *   - **A touch stops it for good.** There is no hover on a phone, so the first
 *     touch anywhere on the band — or any use of the arrows or dots — ends rotation
 *     for the rest of the visit.
 *   - `prefers-reduced-motion` turns rotation off entirely rather than shortening
 *     it: an auto-advancing carousel is motion the reader did not ask for.
 *   - Inactive slides are `inert`, so their heading and CTA are out of the tab
 *     order and out of the accessibility tree — not merely invisible tab stops.
 *
 * **The controls are derived from the slide count, not drawn in**: one slide
 * renders as a still band with no arrows and no dots (see `SingleSlide`).
 *
 * The artwork comes from the design's own image slots and is matched to slides by
 * POSITION, not by filename — the two files were named for the slides they first
 * sat on and have since been swapped. A slide with no artwork falls back to the
 * labelled placeholder at the band's exact size.
 *
 * `label` names the region, since the heading changes with the slide.
 */

/** Both slides, as the home page opens. Rotation is live in a real browser. */
export const Default = () => (
  <HeroCarousel slides={home.hero.slides} label={ui.heroLabel} />
);

/** One slide: no arrows, no dots — a still band, because there is nowhere to go. */
export const SingleSlide = () => (
  <HeroCarousel slides={home.hero.slides.slice(0, 1)} label={ui.heroLabel} />
);

/**
 * A third slide beyond the two with artwork. It falls back to the labelled
 * placeholder at the band's full size, and the dots follow the count — so adding a
 * slide is a content change and nothing else.
 */
export const ExtraSlide = () => (
  <HeroCarousel
    slides={[
      ...home.hero.slides,
      {
        eyebrow: "Studio",
        heading: "Sewn in small runs in Bandung",
        body: "Every piece is cut and sewn end to end by one tailor.",
        cta: "About us",
        href: "/about",
      },
    ]}
    label={ui.heroLabel}
  />
);
