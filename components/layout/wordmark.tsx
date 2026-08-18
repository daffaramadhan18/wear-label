import Link from "next/link";
import { brand } from "@/lib/content/site";

/**
 * Text wordmark. No logo file has been supplied, and inventing one would bake a
 * brand decision into code — so the mark is set in the display face and will be
 * replaced by the real asset when it exists.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline font-display text-lg leading-none tracking-tight transition-colors duration-[var(--duration-fast)] hover:text-ink-accent ${className}`}
    >
      <span className="sr-only">{brand.name} — home</span>
      <span aria-hidden="true">Wear&nbsp;Label</span>
    </Link>
  );
}
