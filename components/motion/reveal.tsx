"use client";

import { motion, type Variants } from "motion/react";
import { useCallback, useState, type ReactNode } from "react";
import { DURATION, EASE, LEAD_DELAY, RISE, RISE_LEAD, VIEWPORT } from "./tokens";

/**
 * A block that arrives rather than simply being there.
 *
 * Two triggers, because a page has two kinds of block:
 *
 * - `on="mount"` — the lead block, above the fold. It animates as soon as it
 *   hydrates, travels 20px over 600ms after a short beat, and is the only motion
 *   on that screen. Scroll-triggering it would be a bug: an element that is
 *   already in view has nothing to enter.
 * - `on="scroll"` (default) — everything below the fold, revealed once on entry.
 *
 * Children are passed in as props, so whatever is wrapped stays a Server
 * Component; this file is the only part that ships to the browser.
 *
 * `data-reveal` is the hook for the no-JavaScript fallback in `globals.css`.
 * Motion writes `opacity: 0` into the server-rendered HTML, so without that rule a
 * reader whose script never runs would get a blank page.
 */
const ELEMENTS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
} as const;

export function Reveal({
  as = "div",
  on = "scroll",
  delay = 0,
  className = "",
  children,
}: {
  as?: keyof typeof ELEMENTS;
  on?: "mount" | "scroll";
  /** Seconds. Use to order two or three blocks; anything more is choreography. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const Component = ELEMENTS[as];
  const lead = on === "mount";

  const variants: Variants = {
    hidden: { opacity: 0, y: lead ? RISE_LEAD : RISE },
    shown: {
      opacity: 1,
      y: 0,
      transition: {
        duration: lead ? DURATION.lead : DURATION.enter,
        ease: EASE.entrance,
        delay: (lead ? LEAD_DELAY : 0) + delay,
      },
    },
  };

  const { measure, forced } = useRescueAboveViewport(!lead);

  return (
    <Component
      data-reveal
      ref={measure}
      className={className}
      variants={variants}
      initial="hidden"
      /* `whileInView` outranks `animate` while it is active, so the rescue below
         can force the shown state without fighting the scroll trigger. */
      animate={lead || forced ? "shown" : "hidden"}
      whileInView={lead ? undefined : "shown"}
      viewport={lead ? undefined : VIEWPORT}
    >
      {children}
    </Component>
  );
}

/**
 * Reveals that will never be scrolled into view.
 *
 * Browsers restore scroll position on reload, so a reader who refreshes halfway
 * down the page leaves everything above them outside the viewport. Those blocks
 * never intersect, and with `once: true` they sit at `opacity: 0` until the reader
 * happens to scroll back up — which, on the block containing the page heading,
 * looks exactly like a broken page.
 *
 * So at mount: anything already above the viewport is shown immediately. It is not
 * arriving, it is already behind us.
 */
export function useRescueAboveViewport(enabled: boolean) {
  const [forced, setForced] = useState(false);

  /* Measured in the ref callback rather than an effect: the callback runs during
     commit, when the node is attached and its position is already meaningful. */
  const measure = useCallback(
    (node: HTMLElement | null) => {
      if (!enabled || !node) return;
      if (node.getBoundingClientRect().bottom < 0) setForced(true);
    },
    [enabled],
  );

  return { measure, forced };
}
