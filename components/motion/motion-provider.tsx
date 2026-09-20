"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE } from "./tokens";

/**
 * One motion configuration for the whole site.
 *
 * `reducedMotion="user"` is the important part: Motion defaults to ignoring the
 * OS setting, so without this every animation here would run for people who have
 * asked their system for less of it. With it, transform and layout animations are
 * dropped and only the opacity change remains — the content still arrives, it
 * just stops travelling.
 *
 * The default transition is set here too, so a component that omits `transition`
 * still moves on the system's curve rather than Motion's stock spring.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: DURATION.enter, ease: EASE.entrance }}
    >
      {children}
    </MotionConfig>
  );
}
