"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useRescueAboveViewport } from "./reveal";
import {
  DURATION,
  EASE,
  LEAD_DELAY,
  RISE,
  RISE_LEAD,
  STAGGER,
  STAGGER_LEAD,
  VIEWPORT,
} from "./tokens";

/**
 * Staggered grid reveal — the product grids, and nothing else.
 *
 * The parent carries no visual animation of its own; it only owns the timing, and
 * each `<StaggerItem>` inherits the `hidden`/`shown` state through Motion's
 * variant context. That is what lets the items stay Server Components: the page
 * still maps over products on the server, and only the wrapper is client code.
 */
const PARENT: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: STAGGER } },
};

/** The lead sequence waits a beat for first paint, then arrives line by line. */
const PARENT_LEAD: Variants = {
  hidden: {},
  shown: {
    transition: { staggerChildren: STAGGER_LEAD, delayChildren: LEAD_DELAY },
  },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: RISE },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.enter, ease: EASE.entrance },
  },
};

const ITEM_LEAD: Variants = {
  hidden: { opacity: 0, y: RISE_LEAD },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.lead, ease: EASE.entrance },
  },
};

const PARENTS = { ul: motion.ul, div: motion.div } as const;
const ITEMS = { li: motion.li, div: motion.div, section: motion.section } as const;

export function Stagger({
  as = "ul",
  on = "scroll",
  className = "",
  children,
}: {
  as?: keyof typeof PARENTS;
  /** `mount` for the lead sequence above the fold; `scroll` for grids below it. */
  on?: "mount" | "scroll";
  className?: string;
  children: ReactNode;
}) {
  const Component = PARENTS[as];
  const lead = on === "mount";

  /* Same reload-with-restored-scroll problem as `<Reveal>`: a grid left above the
     viewport would never intersect, so its items would stay at opacity 0. */
  const { measure, forced } = useRescueAboveViewport(!lead);

  return (
    <Component
      ref={measure}
      className={className}
      variants={lead ? PARENT_LEAD : PARENT}
      initial="hidden"
      animate={lead || forced ? "shown" : "hidden"}
      whileInView={lead ? undefined : "shown"}
      viewport={lead ? undefined : VIEWPORT}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  as = "li",
  on = "scroll",
  className = "",
  children,
}: {
  as?: keyof typeof ITEMS;
  /** Must match the parent `<Stagger>`, so item and timing agree on the tier. */
  on?: "mount" | "scroll";
  className?: string;
  children: ReactNode;
}) {
  const Component = ITEMS[as];

  return (
    <Component
      data-reveal
      className={className}
      variants={on === "mount" ? ITEM_LEAD : ITEM}
    >
      {children}
    </Component>
  );
}
