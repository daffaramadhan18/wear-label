import type { ReactNode } from "react";

/**
 * The aurora band.
 *
 * A slow gradient wash for low-density bands with no photography — the
 * made-to-order block, the bag summary, the footer. The technique comes from the
 * component the design project shipped in `handoff/`, rewritten as two CSS classes
 * (`.wl-aurora` in `globals.css`) with the stop list in `tokens.css`, so it is
 * recoloured with the palette instead of carrying colours of its own.
 *
 * `tone` has to match the surface underneath: the veil layer is painted in the
 * surface colour, and a mismatch shows up as a visible rectangle. Never place it
 * behind photography or the logotype — the clear-space and contrast rules in the
 * design system apply to whatever sits on top.
 */
const TONES = {
  canvas: { veil: "var(--wl-cream)", stops: "var(--aurora-stops)" },
  muted: { veil: "var(--wl-taupe-100)", stops: "var(--aurora-stops)" },
  inert: { veil: "var(--wl-inert-100)", stops: "var(--aurora-stops)" },
  invert: { veil: "var(--wl-taupe-900)", stops: "var(--aurora-stops-invert)" },
} as const;

/** Which corner the wash fades out from. */
const ORIGINS = {
  "bottom-left": "0% 100%",
  "top-right": "100% 0%",
  "top-left": "20% 0%",
} as const;

export function Aurora({
  tone = "canvas",
  origin = "bottom-left",
  intensity = 1,
  className = "",
}: {
  tone?: keyof typeof TONES;
  origin?: keyof typeof ORIGINS;
  /** 0–1. The design's `auroraIntensity` tweak, as opacity. */
  intensity?: number;
  className?: string;
}) {
  const { veil, stops } = TONES[tone];

  return (
    <div
      aria-hidden="true"
      className={`wl-aurora ${className}`}
      style={
        {
          opacity: intensity,
          "--aurora-veil": veil,
          "--aurora-stops": stops,
          "--aurora-origin": ORIGINS[origin],
        } as React.CSSProperties
      }
    />
  );
}

/**
 * A band with the wash behind its contents. `isolate` is required — it is what
 * keeps `soft-light` blending against this band rather than against the page.
 */
export function AuroraBand({
  tone = "canvas",
  origin = "bottom-left",
  intensity = 1,
  as: Element = "section",
  className = "",
  children,
  ...props
}: {
  tone?: keyof typeof TONES;
  origin?: keyof typeof ORIGINS;
  intensity?: number;
  as?: "section" | "div" | "aside" | "footer";
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Element className={`relative isolate overflow-hidden ${className}`} {...props}>
      <Aurora tone={tone} origin={origin} intensity={intensity} />
      {/* `w-full`: the wrapper is a flex item whenever the band lays its content
          out with flex, and a shrink-to-fit wrapper would take the absolutely
          positioned children inside it down to the width of the text. */}
      <div className="relative z-1 w-full">{children}</div>
    </Element>
  );
}
