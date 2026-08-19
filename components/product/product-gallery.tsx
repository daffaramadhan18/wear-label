"use client";

import { useState } from "react";
import { Media } from "@/components/ui/media";
import { ui } from "@/lib/content/site";
import type { Image } from "@/lib/shopify";

/**
 * Product gallery — a column of thumbnails beside the main crop.
 *
 * Client-side only for the selection. Thumbnails are buttons with `aria-pressed`,
 * not links, because choosing an angle is not a navigation; and the main image gets
 * the selected shot rather than the page scrolling to it.
 *
 * Only the first angle of each piece has been shot. The remaining slots are the
 * labelled placeholder at the right ratio, so the rail is already its final size and
 * shape — dropping the photographs in changes nothing but the pixels. A gallery
 * with one entry hides the rail altogether.
 *
 * The rail is a column beside the photograph from `lg` up and a scrolling row
 * beneath it below that: 92px of thumbnails alongside leaves the main crop about
 * 260px on a phone, and the main crop is the thing being bought.
 */
export function ProductGallery({ images, title }: { images: Image[]; title: string }) {
  const [index, setIndex] = useState(0);
  const main = images[index] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {images.length > 1 ? (
        <ul
          aria-label={ui.gallery}
          className="wl-rail flex gap-3 overflow-x-auto lg:w-23 lg:shrink-0 lg:flex-col lg:gap-4 lg:overflow-visible"
        >
          {images.map((image, imageIndex) => (
            <li key={imageIndex} className="w-20 shrink-0 lg:w-full">
              <button
                type="button"
                onClick={() => setIndex(imageIndex)}
                aria-pressed={imageIndex === index}
                className={`block w-full cursor-pointer overflow-hidden rounded-xs border transition-colors duration-(--duration-base) ${
                  imageIndex === index ? "border-brand" : "border-border hover:border-line"
                }`}
              >
                <Media
                  image={image}
                  sizes="(min-width: 1024px) 92px, 80px"
                  ratio="4 / 5"
                  label="Angle"
                  className="rounded-none"
                />
                <span className="sr-only">
                  {ui.showImage} {imageIndex + 1}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="min-w-0 flex-1">
        <Media
          image={{ ...main, altText: main.altText || (main.url ? title : "") }}
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
          label="Product photo"
        />
      </div>
    </div>
  );
}
