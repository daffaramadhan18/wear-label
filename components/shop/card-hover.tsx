"use client";

import { motion, type Variants } from "motion/react";
import { useState, type ReactNode } from "react";
import { DURATION, EASE } from "../motion/tokens";

/**
 * The product card's hover state.
 *
 * Split into a shell and a media wrapper so the card itself stays a Server
 * Component: `<CardHover>` owns the state, `<CardMedia>` reads it through
 * Motion's variant context, and everything in between is server-rendered.
 *
 * The card is one stretched link, so the pointer and the keyboard land on
 * different elements — hover fires on the article, focus fires on the anchor
 * inside it. Both are folded into one `active` flag, which is why this listens
 * for `onFocus`/`onBlur` (React's focus events bubble) rather than using Motion's
 * `whileHover` alone. A keyboard user tabbing through the grid sees exactly what
 * a mouse user sees.
 */
const MEDIA: Variants = {
  rest: { scale: 1 },
  active: { scale: 1.03 },
};

export function CardHover({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState(false);

  return (
    <motion.article
      className={className}
      initial="rest"
      animate={active ? "active" : "rest"}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {children}
    </motion.article>
  );
}

export function CardMedia({ children }: { children: ReactNode }) {
  return (
    /* The clip lives on a static parent: scaling an element that clips itself
       would animate the crop along with the image. */
    <div className="overflow-hidden rounded-sm">
      <motion.div
        variants={MEDIA}
        transition={{ duration: DURATION.enter, ease: EASE.entrance }}
      >
        {children}
      </motion.div>
    </div>
  );
}
