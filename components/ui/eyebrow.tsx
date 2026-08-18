import type { ReactNode } from "react";

/** Small tracked label above a heading. Uses ink-accent, which is contrast-safe. */
export function Eyebrow({
  children,
  tone = "accent",
  className = "",
}: {
  children: ReactNode;
  tone?: "accent" | "muted" | "invert";
  className?: string;
}) {
  const tones = {
    accent: "text-ink-accent",
    muted: "text-ink-muted",
    invert: "text-ink-invert-muted",
  } as const;

  return (
    <p
      className={`text-eyebrow font-medium uppercase tracking-eyebrow ${tones[tone]} ${className}`}
    >
      {children}
    </p>
  );
}
