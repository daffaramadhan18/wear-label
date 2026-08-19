import NextImage from "next/image";
import type { Image } from "@/lib/shopify";

/**
 * Catalogue and editorial imagery.
 *
 * The catalogue photography has not been handed over yet. Per the design system's
 * product card, an image whose `url` is null renders as a tone-filled block with a
 * small uppercase caption at the bottom — at the exact ratio the real photo will
 * occupy, so dropping files into `public/products/` causes no reflow (CLS stays 0).
 *
 * `ratio` overrides the frame the image is cropped into, which is how the design's
 * fixed-height crops are expressed: the source photography is portrait, while a
 * card, a mosaic tile and a bag thumbnail each crop it differently. Without an
 * override the image's own dimensions set the frame. `fill` drops the frame
 * altogether and takes the size of the nearest positioned ancestor, for the bands
 * whose height is set by the layout rather than by the photograph — the hero, the
 * campaign banner, the mosaic tiles.
 */
export function Media({
  image,
  sizes,
  ratio,
  fill = false,
  priority = false,
  className = "",
  label = "Product photo",
}: {
  image: Image;
  sizes: string;
  /** CSS aspect ratio, e.g. `"1 / 1"`. Defaults to the image's own. */
  ratio?: string;
  /** Fill the positioned ancestor instead of holding a ratio. */
  fill?: boolean;
  priority?: boolean;
  className?: string;
  /** Caption shown on the placeholder block. */
  label?: string;
}) {
  const style = fill ? undefined : { aspectRatio: ratio ?? `${image.width} / ${image.height}` };
  const box = fill ? "absolute inset-0 h-full w-full" : "w-full";

  if (!image.url) {
    return (
      <div
        role="img"
        aria-label={image.altText || `${label} placeholder`}
        style={style}
        className={`flex items-end justify-center rounded-sm bg-tone p-4.5 ${box} ${className}`}
      >
        <span className="text-micro uppercase tracking-nav text-white/75">{label}</span>
      </div>
    );
  }

  return (
    <div
      style={style}
      className={`relative overflow-hidden rounded-sm bg-tone ${box} ${className}`}
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
