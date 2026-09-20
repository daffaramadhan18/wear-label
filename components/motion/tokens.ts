/**
 * Motion tokens — the JavaScript half of the pair.
 *
 * Every value here mirrors a custom property in `app/tokens.css`; CSS-driven
 * micro-transitions (hover colour, focus rings) keep reading the variables, and
 * Motion — which needs real numbers, not `var()` strings — reads these. Change a
 * value in one place and change it in the other: they are one token, written
 * twice because two runtimes need it.
 *
 * The scale follows the system's own rhythm: colour moves in 160ms, transform in
 * 120ms, and anything that enters the viewport takes 400ms. Exits are ~65% of the
 * enter duration, so dismissing never feels slower than summoning.
 */
import type { Easing } from "motion/react";

export const DURATION = {
  /** --duration-fast: transform, press feedback */
  fast: 0.12,
  /** --duration-base: colour and border transitions */
  base: 0.16,
  /** --duration-exit: anything leaving the screen */
  exit: 0.26,
  /** --duration-enter: reveals and disclosures */
  enter: 0.4,
  /** --duration-lead: the one reveal a reader is actually watching for */
  lead: 0.6,
} as const;

/**
 * Deceleration on the way in, acceleration on the way out. The entrance curve is
 * a long expo tail — it settles rather than stops, which suits an editorial page
 * better than a spring's overshoot.
 */
export const EASE: Record<"entrance" | "exit", Easing> = {
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
};

/** Per-item delay in a staggered list. Kept small — a 12-card grid must not take
 *  half a second to finish arriving. */
export const STAGGER = 0.045;

/**
 * The lead sequence is slower per item than a grid. Four lines of a hero read as
 * one gesture at 70ms apart; at 45ms they arrive as a single flicker, which is the
 * thing this pacing exists to avoid.
 */
export const STAGGER_LEAD = 0.07;

/** Reveal offset. Small enough to read as a fade with weight, not as a slide. */
export const RISE = 12;

/**
 * The lead reveal — the hero — travels further and slower than the rest. It runs
 * against a still page rather than against a scroll, so it has to carry the motion
 * on its own; at 12px/400ms it finished before the reader had finished arriving.
 */
export const RISE_LEAD = 20;

/**
 * A beat before the lead reveal starts, so it plays *after* first paint instead of
 * during it. Motion that coincides with the page appearing is not perceived as
 * motion at all.
 */
export const LEAD_DELAY = 0.12;

/**
 * Reveals fire once, slightly before the element is fully in view, so the motion
 * has finished by the time the reader's eye arrives.
 */
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
