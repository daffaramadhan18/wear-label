"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { Eyebrow } from "@/components/ui/section";
import { ui } from "@/lib/content/site";
import type { Image } from "@/lib/shopify";

/**
 * The hero — the design's 600px band with a cream card over the photograph, and as
 * many slides as `lib/content/site.ts` lists.
 *
 * Rotation rules, in the order they matter:
 *
 *   - It stops on hover and on keyboard focus, so a reader can finish the sentence
 *     they are on and can reach the CTA without it moving.
 *   - `prefers-reduced-motion` turns rotation off entirely rather than merely
 *     shortening it. An auto-advancing carousel is motion the reader did not ask
 *     for, which is exactly what that setting is about.
 *   - Inactive slides are `inert`, so their heading and CTA are out of the tab
 *     order and out of the accessibility tree instead of being invisible tab stops.
 *
 * One slide renders as a still band with no arrows and no dots — the controls are
 * derived from the slide count, not drawn in.
 *
 * The artwork comes from the design's own image slots, exported to `public/home/`.
 * The design maps them by position — `slotId: 'sf-hero-' + (i + 1)` — so slide 1
 * is `sf-hero-1` and slide 2 is `sf-hero-2`. Its state file also holds an unused
 * `sf-hero` from an earlier single-slide version; it is not one of these two.
 *
 * A slide with no entry in `HERO_IMAGES` falls back to the labelled placeholder at
 * the band's exact size, so a missing shot never breaks the band.
 */
const ROTATE_MS = 6000;

/**
 * One entry per slide, in slide order. A null url renders the placeholder.
 *
 * The band is 1440x600 and these are 1200x675, so `Media` crops them to fill —
 * which is what the design does with them too. The cream card sits over the left
 * third, so the crop is what decides how much of a shot survives.
 */
const HERO_IMAGES: Image[] = [
  /*
   * Slide 1 is the studio's own order-notes card, as the design has it. It is an
   * image OF text, which is why the alt below carries the whole of that text
   * rather than describing the picture — a screen reader gets nothing from the
   * card itself, and neither does anyone who zooms.
   *
   * Two things in it are the studio's to keep true, because they go live with the
   * page: it ships from Kota Bekasi, while `lib/content/site.ts` says the studio
   * is in Bandung, and the cut-off and complaint windows are delivery terms the
   * catalogue does not otherwise state. Change the card, change the alt with it.
   */
  {
    url: "/home/hero-1.webp",
    altText:
      "Order notes from the studio. 1: Shipping from Kota Bekasi. 2: Payment before 15.00 WIB is dispatched the same day. 3: Orders cannot be cancelled — check the product, colour and size before checkout. 4: Dispatch Monday to Saturday; no dispatch on public holidays. 5: Complaints within 3 days of delivery, with an unboxing video. 6: Instant and same-day delivery available. 7: Models and colours cannot be exchanged.",
    width: 1200,
    height: 675,
  },
  {
    url: "/home/hero-2.webp",
    altText:
      "Polaroid prints laid out on a linen backdrop — models in cream shirts and wide-leg trousers, photographed against a wood-panelled wall.",
    width: 1200,
    height: 675,
  },
];

interface Slide {
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  href: string;
}

export function HeroCarousel({
  slides,
  label,
}: {
  slides: readonly Slide[];
  /** Names the carousel region, since its heading changes with the slide. */
  label: string;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const many = slides.length > 1;

  useEffect(() => {
    if (!many || paused || reduceMotion) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      ROTATE_MS,
    );

    return () => window.clearInterval(timer);
  }, [many, paused, reduceMotion, slides.length]);

  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="relative h-150 overflow-hidden bg-surface-muted"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, slideIndex) => {
        const active = slideIndex === index;

        return (
          <div
            key={slide.heading}
            aria-hidden={!active}
            inert={!active}
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${slides.length}`}
            style={{ opacity: active ? 1 : 0, zIndex: active ? 2 : 1 }}
            className="absolute inset-0 transition-opacity duration-(--duration-lead) ease-entrance"
          >
            <Media
              image={HERO_IMAGES[slideIndex] ?? { url: null, altText: "", width: 1440, height: 600 }}
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              label="Hero photo"
              className="rounded-none"
            />

            <div className="absolute inset-0 flex items-center">
              <Container>
                <div className="flex max-w-130 flex-col gap-5 bg-canvas/92 p-8 md:px-11 md:py-12">
                  <Eyebrow>{slide.eyebrow}</Eyebrow>
                  {/* Every slide carries an h1. Only the active slide is in the
                      accessibility tree, so the page still has exactly one. */}
                  <h1 className="text-display leading-display tracking-display">
                    {slide.heading}
                  </h1>
                  <p className="text-body leading-body text-ink-muted">{slide.body}</p>
                  <ButtonLink href={slide.href} size="lg" className="self-start">
                    {slide.cta}
                  </ButtonLink>
                </div>
              </Container>
            </div>
          </div>
        );
      })}

      {many ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="absolute left-4 top-1/2 z-10 inline-flex size-13 -translate-y-1/2 cursor-pointer items-center justify-center bg-canvas/90 text-ink transition-colors duration-(--duration-base) hover:bg-canvas md:left-7"
          >
            <ChevronLeftIcon className="size-5.5" />
            <span className="sr-only">{ui.previousSlide}</span>
          </button>

          <button
            type="button"
            onClick={() => go(index + 1)}
            className="absolute right-4 top-1/2 z-10 inline-flex size-13 -translate-y-1/2 cursor-pointer items-center justify-center bg-canvas/90 text-ink transition-colors duration-(--duration-base) hover:bg-canvas md:right-7"
          >
            <ChevronRightIcon className="size-5.5" />
            <span className="sr-only">{ui.nextSlide}</span>
          </button>

          <div className="absolute inset-x-0 bottom-7 z-10 flex justify-center gap-2.5">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.heading}
                type="button"
                onClick={() => go(slideIndex)}
                aria-current={slideIndex === index ? "true" : undefined}
                className={`h-1 cursor-pointer transition-[width,background-color] duration-(--duration-base) ${
                  slideIndex === index ? "w-10 bg-brand" : "w-4.5 bg-ink/35 hover:bg-brand/60"
                }`}
              >
                <span className="sr-only">
                  {ui.goToSlide} {slideIndex + 1}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
