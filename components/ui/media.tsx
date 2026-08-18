import NextImage from "next/image";
import type { Image } from "@/lib/shopify";

/**
 * Renders catalogue/editorial imagery.
 *
 * Photography has not been supplied yet, so an image whose `url` is null renders
 * a token-styled placeholder at the exact aspect ratio the real photo will have.
 * Layout is therefore already final — dropping the files in and setting the url
 * in `lib/shopify/fixtures.ts` causes no reflow (CLS stays at 0).
 *
 * The placeholder keeps the alt text as an accessible name, so the page still
 * describes what belongs there.
 */
export function Media({
  image,
  sizes,
  priority = false,
  className = "",
  shape = "",
}: {
  image: Image;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Extra class for the crop shape, e.g. `wl-arch`. */
  shape?: string;
}) {
  const ratio = `${image.width} / ${image.height}`;

  if (!image.url) {
    return (
      <div
        role="img"
        aria-label={image.altText}
        style={{ aspectRatio: ratio }}
        className={`wl-grain relative w-full overflow-hidden bg-sand ${shape} ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sand via-sand-strong to-clay-fill opacity-70" />
        <div className="absolute inset-0 grid place-items-center p-6">
          <span className="max-w-[24ch] text-center text-caption leading-snug text-ink/70">
            {image.altText}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden bg-sand ${shape} ${className}`}
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
