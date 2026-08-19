import type { ReactNode } from "react";

/**
 * The floating-paths wash.
 *
 * Thirty-six bezier strands with a dash travelling along each one, behind
 * whatever is passed as children. A sibling to `Aurora` — same job (a slow wash
 * for a low-density band with no photography), different technique — so the same
 * rules apply: never behind photography or the logotype, and whatever sits on top
 * still answers to the contrast rules in the design system.
 *
 * The curve formula and the two ramps (stroke width, stroke opacity) are the
 * source component's artwork, kept to the number. They are geometry rather than
 * design values, which is why they are written here as attributes and not lifted
 * into `tokens.css` — the same reasoning as the measured tilt angles on the voices
 * wall.
 *
 * Deviations from the component as supplied, all deliberate:
 *
 * 1. **CSS animation, not `motion.path`.** The strands are decoration on a loop,
 *    which in this repo is a CSS job — the Instagram strip, the voices wall and
 *    the aurora all animate without a client island, and this makes four. The
 *    original mounts 36 `motion.path` elements, so it also has to be a Client
 *    Component; this one renders on the server and ships no JavaScript. The dash
 *    mechanics live in `.wl-paths` in `globals.css`, the loop lengths in
 *    `tokens.css`.
 * 2. **`Math.random()` is gone.** It was called during render, so the server and
 *    the client each picked different durations — a hydration mismatch on every
 *    one of the 36 paths. The variance it was there for is now a fixed spread of
 *    four loop lengths and a negative delay per strand, which desynchronises them
 *    the same way and survives a re-render.
 * 3. **`text-slate-950 dark:text-white` → a tone token.** No component here
 *    carries a hardcoded colour, and the site has no dark mode for `dark:` to
 *    answer to. The strands are `currentColor`, and `tone` picks which token
 *    supplies it.
 * 4. **`preserveAspectRatio="slice"`.** The default (`meet`) letterboxes the
 *    viewBox, so in any container taller than 696:316 the strands stop partway
 *    down and the rest is blank — visible as an empty band, since this is a
 *    background. `slice` scales to cover and crops instead.
 * 5. **The `color` field is dropped.** It computed an `rgba()` per path that
 *    nothing read; the strokes have always been `currentColor`.
 * 6. **No `cn()`.** This repo has no `clsx`/`tailwind-merge` helper and no
 *    `lib/utils.ts`; className is composed the way `aurora.tsx` composes it.
 */

/** Which token supplies `currentColor` for the strands. */
const TONES = {
  /** Brand taupe on a white or cream band. */
  brand: "text-brand",
  /** Lighter, for a wash that stays well under its content. */
  subtle: "text-tone",
  /** Cream, for an espresso band. */
  invert: "text-ink-invert",
} as const;

/** One per strand, cycled — four lengths, so the 36 never lock into step. */
const DURATIONS = [
  "var(--duration-paths-a)",
  "var(--duration-paths-b)",
  "var(--duration-paths-c)",
  "var(--duration-paths-d)",
] as const;

/**
 * Seconds of negative delay added per strand, so each one starts already
 * mid-flight. Without it all 36 dashes leave the gate together and the first pass
 * reads as a single wave crossing the band, which is the effect this is not.
 */
const DELAY_STEP = 1.7;

const PATH_COUNT = 36;

export function FloatingPathsBackground({
  position = 1,
  tone = "brand",
  children,
  className = "",
}: {
  /** Horizontal skew of the bundle. ±1 are the source component's two settings. */
  position?: number;
  tone?: keyof typeof TONES;
  className?: string;
  children?: ReactNode;
}) {
  const paths = Array.from({ length: PATH_COUNT }, (_, i) => {
    const shift = i * 5 * position;
    const drop = i * 6;

    return {
      id: i,
      d: `M-${380 - shift} -${189 + drop}C-${380 - shift} -${189 + drop} -${
        312 - shift
      } ${216 - drop} ${152 - shift} ${343 - drop}C${616 - shift} ${470 - drop} ${
        684 - shift
      } ${875 - drop} ${684 - shift} ${875 - drop}`,
      width: 0.5 + i * 0.03,
      /* The source ramp reaches 1.15 by the last strand; opacity stops at 1. */
      opacity: Math.min(1, 0.1 + i * 0.03),
      duration: DURATIONS[i % DURATIONS.length],
      delay: `-${(i * DELAY_STEP).toFixed(1)}s`,
    };
  });

  return (
    <div className={`relative w-full ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className={`wl-paths h-full w-full ${TONES[tone]}`}
          viewBox="0 0 696 316"
          /* Cover, don't letterbox — see the header note. */
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          focusable="false"
        >
          {paths.map((path) => (
            <path
              key={path.id}
              d={path.d}
              /* Normalises the dash units in `.wl-paths` to fractions of the
                 curve, which is what lets one keyframe drive all 36. */
              pathLength="1"
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={path.opacity}
              style={
                {
                  "--path-duration": path.duration,
                  "--path-delay": path.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </svg>
      </div>
      {/* The wash is absolutely positioned and the strands therefore paint after
          static in-flow content, so the content needs a positioned layer of its own
          or the curves draw over the text sitting on them. `w-full` for the reason
          `AuroraBand` gives: this wrapper is a flex item whenever the band lays its
          content out with flex, and a shrink-to-fit wrapper would take it down to
          the width of the text. */}
      <div className="relative z-1 w-full">{children}</div>
    </div>
  );
}
