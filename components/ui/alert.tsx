import type { ReactNode } from "react";

/**
 * Inline message, per the design system's Feedback section: a warm surface with a
 * 2px rule down the left edge. Tone is carried by text as well as colour, so the
 * meaning never depends on hue alone — pass a `label` for anything but info.
 */
const TONES = {
  success: "bg-success-surface text-on-success-surface border-success-line",
  error: "bg-error-surface text-on-error-surface border-error",
  info: "bg-info-surface text-on-info-surface border-info-line",
} as const;

export function Alert({
  tone = "info",
  label,
  children,
  className = "",
}: {
  tone?: keyof typeof TONES;
  /** Visually hidden prefix naming the tone, e.g. "Error". */
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={`rounded-sm border-l-2 px-5 py-4.5 text-small leading-snug ${TONES[tone]} ${className}`}
    >
      {label ? <span className="sr-only">{label}: </span> : null}
      {children}
    </p>
  );
}
