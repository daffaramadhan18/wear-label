import NextImage from "next/image";
import type { Image } from "@/lib/shopify";

/**
 * Catalogue and editorial imagery.
 *
 * No photography exists yet. Per the design system's product card, an image whose
 * `url` is null renders as a tone-filled block with a small uppercase caption at
 * the bottom — at the exact aspect ratio the real photo will have, so dropping
 * files into `public/` and setting the url in `lib/shopify/` causes no reflow
 * (CLS stays 0).
 */
export function Media({
  image,
  sizes,
  priority = false,
  className = "",
  label = "Product photo",
}: {
  image: Image;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Caption shown on the placeholder block. */
  label?: string;
}) {
  const ratio = `${image.width} / ${image.height}`;

  if (!image.url) {
    return (
      <div
        role="img"
        aria-label={image.altText || `${label} placeholder`}
        style={{ aspectRatio: ratio }}
        className={`flex w-full items-end justify-center rounded-sm bg-tone p-4.5 ${className}`}
      >
        <span className="text-micro uppercase tracking-nav text-white/75">{label}</span>
      </div>
    );
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden rounded-sm bg-tone ${className}`}
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
