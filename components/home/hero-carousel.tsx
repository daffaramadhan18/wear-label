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
 * The photography is not delivered yet, so each slide shows the labelled
 * placeholder at the band's exact size. Add a url to `HERO_IMAGES` (files in
 * `public/home/`) and it becomes the photograph, with no other change.
 */
const ROTATE_MS = 6000;

/** One entry per slide, in slide order. A missing entry renders the placeholder. */
const HERO_IMAGES: Image[] = [
  { url: null, altText: "", width: 1440, height: 600 },
  { url: null, altText: "", width: 1440, height: 600 },
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
