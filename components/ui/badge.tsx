import type { ReactNode } from "react";

/**
 * Pill badge, per the design system's Product variants section. Pills are
 * reserved for badges and filter chips — everything else stays near-square.
 */
const TONES = {
  brand: "bg-brand text-on-brand",
  /** The catalogue's "New" flag — espresso, the quietest way to shout. */
  invert: "bg-invert text-ink-invert",
  /** A markdown. Rust, and always beside the two prices, never instead of them. */
  sale: "bg-sale text-on-sale",
  promo: "bg-promo-surface text-on-promo-surface",
  sage: "bg-sage-surface text-on-sage-surface",
  outline: "border border-line text-ink-subtle",
  inert: "bg-inert text-on-inert border border-inert-border",
} as const;

export function Badge({
  tone = "outline",
  children,
  className = "",
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3.5 py-1.5 text-micro uppercase tracking-eyebrow ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
