import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/content/site";

/**
 * The Wear Label logotype.
 *
 * The design system is explicit: the logotype is drawn artwork and is never set in
 * a typeface — horizontal lockup in headers, monogram for favicons and labels,
 * stacked lockup for narrow or square spaces.
 *
 * The artwork is imported from the Claude Design project and lives in
 * `public/brand/`. Nothing here draws or reconstructs it:
 *
 *   wordmark.png / wordmark-cream.png   horizontal lockup — the default
 *   stacked.png  / stacked-cream.png    stacked lockup — narrow and square spaces
 *   mark.png     / mark-cream.png       monogram — favicon (see app/icon.png)
 *
 * The `-cream` files are the same artwork in cream, for espresso and taupe
 * surfaces. Taupe artwork on a dark surface would fail contrast, so `onDark`
 * swaps the file rather than filtering the image.
 */

/** Intrinsic pixel size of each exported lockup, so Next can hold the ratio. */
const LOCKUP = {
  horizontal: { width: 350, height: 100 },
  stacked: { width: 200, height: 140 },
} as const;

export function Wordmark({
  className = "",
  onDark = false,
  variant = "horizontal",
  height = 30,
}: {
  className?: string;
  /** Use the cream artwork, for espresso and taupe surfaces. */
  onDark?: boolean;
  /** Horizontal is the default everywhere; stacked is for narrow or square space. */
  variant?: "horizontal" | "stacked";
  /** Rendered height in px; the lockup keeps its ratio. */
  height?: number;
}) {
  const art = LOCKUP[variant];
  const file = `${variant === "stacked" ? "stacked" : "wordmark"}${onDark ? "-cream" : ""}`;

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {/* The alt text is empty and the name is carried by the adjacent sr-only
          span: the lockup reads as the company name, and doubling it up would
          announce "Wear Label Wear Label" to a screen reader. */}
      <span className="sr-only">{brand.name}</span>
      <Image
        src={`/brand/${file}.png`}
        alt=""
        width={art.width}
        height={art.height}
        priority
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
