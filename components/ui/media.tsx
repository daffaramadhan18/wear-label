import NextImage from "next/image";
import type { Image } from "@/lib/shopify";

/**
 * Renders catalogue and editorial imagery.
 *
 * No photography exists yet, so an image whose `url` is null renders a labelled
 * placeholder at the exact aspect ratio the real photo will have. Layout is
 * therefore already final — dropping files into `public/` and setting the url in
 * `lib/shopify/` causes no reflow (CLS stays at 0).
 */
export function Media({
  image,
  sizes,
  priority = false,
  className = "",
  label = "image",
}: {
  image: Image;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Field name shown on the placeholder. */
  label?: string;
}) {
  const ratio = `${image.width} / ${image.height}`;

  if (!image.url) {
    return (
      <div
        role="img"
        aria-label={image.altText || `${label} placeholder`}
        style={{ aspectRatio: ratio }}
        className={`grid w-full place-items-center rounded-md border border-dashed border-line bg-sand ${className}`}
      >
        <span className="text-eyebrow uppercase tracking-eyebrow text-ink-muted">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden rounded-md bg-sand ${className}`}
    >
      <NextImage
        src={image.url}
        alt={image.altText}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="object-cover"
      />
    </div>
  );
}
