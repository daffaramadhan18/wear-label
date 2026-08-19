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
 * Slides travel sideways rather than crossfading: every slide is parked one band
 * width away on the side it will arrive from, and only the offset changes. The
 * band already clips, so nothing extra is needed to hide the parked ones.
 *
 * Rotation rules, in the order they matter:
 *
 *   - It stops on hover and on keyboard focus, so a reader can finish the sentence
 *     they are on and can reach the CTA without it moving. That pause is the only
 *     way to stop it, and at a three-second dwell it matters more than it did at
 *     six — the headline and its paragraph are longer than three seconds of
 *     reading for most people.
 *   - `prefers-reduced-motion` turns rotation off entirely rather than merely
 *     shortening it. An auto-advancing carousel is motion the reader did not ask
 *     for, which is exactly what that setting is about.
 *   - Inactive slides are `inert`, so their heading and CTA are out of the tab
 *     order and out of the accessibility tree instead of being invisible tab stops.
 *
 * One slide renders as a still band with no arrows and no dots — the controls are
 * derived from the slide count, not drawn in.
 *
 * The artwork comes from the design's own image slots, exported to `public/home/`
 * and named for the slide they sit on, not for the slot they came from — **the
 * design's order is deliberately reversed here**. It maps slots by position
 * (`slotId: 'sf-hero-' + (i + 1)`), which puts the order-notes card first; the
 * photograph leads instead. So `hero-1.webp` is the design's `sf-hero-2` and
 * `hero-2.webp` is its `sf-hero-1`. Its state file also holds an unused `sf-hero`
 * from an earlier single-slide version; it is neither of these two.
 *
 * A slide with no entry in `HERO_IMAGES` falls back to the labelled placeholder at
 * the band's exact size, so a missing shot never breaks the band.
 */
/** Dwell per slide. The design rotates at 6s; three is what this build asked for. */
const ROTATE_MS = 3000;

/**
 * One entry per slide, in slide order. A null url renders the placeholder.
 *
 * The band is 1440x600 and these are 1200x675, so `Media` crops them to fill —
 * which is what the design does with them too. The cream card sits over the left
 * third, so the crop is what decides how much of a shot survives.
 */
const HERO_IMAGES: Image[] = [
  {
    url: "/home/hero-1.webp",
    altText:
      "Polaroid prints laid out on a linen backdrop — models in cream shirts and wide-leg trousers, photographed against a wood-panelled wall.",
    width: 1200,
    height: 675,
  },
  /*
   * The studio's own order-notes card. It is an image OF text, which is why the
   * alt below carries the whole of that text rather than describing the picture —
   * a screen reader gets nothing from the card itself, and neither does anyone
   * who zooms.
   *
   * Two things in it are the studio's to keep true, because they go live with the
   * page: it ships from Kota Bekasi, while `lib/content/site.ts` says the studio
   * is in Bandung, and the cut-off and complaint windows are delivery terms the
   * catalogue does not otherwise state. Change the card, change the alt with it.
   */
  {
    url: "/home/hero-2.webp",
    altText:
      "Order notes from the studio. 1: Shipping from Kota Bekasi. 2: Payment before 15.00 WIB is dispatched the same day. 3: Orders cannot be cancelled — check the product, colour and size before checkout. 4: Dispatch Monday to Saturday; no dispatch on public holidays. 5: Complaints within 3 days of delivery, with an unboxing video. 6: Instant and same-day delivery available. 7: Models and colours cannot be exchanged.",
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

        /* Where this slide sits, in band widths from the active one. Wrapping to
           the nearer side keeps the last slide from travelling the whole strip
           backwards on the way round to the first. With two slides it never
           wraps; with three or more it is what stops the jump. */
        let offset = slideIndex - index;
        if (offset > slides.length / 2) offset -= slides.length;
        if (offset < -slides.length / 2) offset += slides.length;

        return (
          <div
            key={slide.heading}
            aria-hidden={!active}
            inert={!active}
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${slides.length}`}
            style={{ transform: `translateX(${offset * 100}%)`, zIndex: active ? 2 : 1 }}
            /* No transition under reduced motion: the arrows and dots still work,
               the slide just arrives instead of travelling. */
            className={`absolute inset-0 ${
              reduceMotion ? "" : "transition-transform duration-(--duration-lead) ease-entrance"
            }`}
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
