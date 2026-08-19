"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { DURATION, EASE } from "./tokens";

/**
 * Route-change crossfade.
 *
 * Opacity only, and deliberately so: a transform on this wrapper would create a
 * containing block for everything inside it, which would break the catalogue's
 * `position: sticky` filter column. The fade is short — long page transitions
 * read as latency, not polish.
 *
 * The first render is exempt. On first load the page has already been painted by
 * the server, and fading it in from nothing would throw away that head start (and
 * fight the hero's own reveal). Only navigations animate.
 *
 * There is no exit animation. App Router unmounts the old route before the new
 * one commits, so an exit needs the "frozen router" workaround — a stale copy of
 * the previous tree held in context. That trades correctness for a fade; the
 * crossfade below gets most of the effect and none of the risk.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /* Has the reader navigated yet? Adjusted during render rather than in an
     effect — the same pattern the header uses — so the very first paint already
     knows not to animate, with no second render pass to get there. */
  const [renderedPath, setRenderedPath] = useState(pathname);
  const [navigated, setNavigated] = useState(false);

  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setNavigated(true);
  }

  return (
    <motion.div
      key={pathname}
      initial={navigated ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.exit, ease: EASE.entrance }}
    >
      {children}
    </motion.div>
  );
}
