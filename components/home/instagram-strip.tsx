import { Media } from "@/components/ui/media";
import type { Image } from "@/lib/shopify";

/**
 * The Instagram strip: one row of square crops, scrolling.
 *
 * The track holds the run twice and travels exactly -50%, so the loop is seamless
 * (`globals.css`). It runs continuously — hovering does not stop it — and
 * `prefers-reduced-motion` stops it altogether, which is why the rail is
 * `overflow-x-auto` rather than `hidden`: with the animation off, the strip has to
 * stay reachable by scrolling. The scrollbar itself is hidden, so that fallback
 * costs the design nothing.
 *
 * The images are the catalogue's own, since the studio's posts are not wired up
 * here. There are no links on them for the same reason — a post needs a permalink,
 * and inventing one would send readers nowhere.
 */
export function InstagramStrip({
  heading,
  images,
}: {
  heading: string;
  images: Image[];
}) {
  if (images.length === 0) return null;

  /* Two runs, so `translateX(-50%)` lands exactly where it started. */
  const run = [...images, ...images];

  return (
    <section aria-labelledby="instagram-heading" className="flex flex-col gap-7 py-section">
      <h2 id="instagram-heading" className="px-gutter text-center font-body text-h2 leading-h2">
        {heading}
      </h2>

      <div className="wl-marquee wl-rail overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
        <ul className="wl-marquee-track">
          {run.map((image, index) => (
            <li key={index} className="w-58 shrink-0" aria-hidden={index >= images.length}>
              <Media
                image={image}
                sizes="232px"
                ratio="1 / 1"
                label="Studio post"
                className="rounded-none"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
