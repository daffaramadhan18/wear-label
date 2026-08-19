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
 *   - **A touch stops it for good.** There is no hover on a phone, so the pause
 *     above does not exist there; the first touch anywhere on the band, or any use
 *     of the arrows or dots, ends the rotation for the rest of the visit. A reader
 *     who has taken hold of the carousel has said what they want, and a slide that
 *     slid back out from under a thumb is worse than one that stopped.
 *   - `prefers-reduced-motion` turns rotation off entirely rather than merely
 *     shortening it. An auto-advancing carousel is motion the reader did not ask
 *     for, which is exactly what that setting is about.
 *   - Inactive slides are `inert`, so their heading and CTA are out of the tab
 *     order and out of the accessibility tree instead of being invisible tab stops.
 *
 * One slide renders as a still band with no arrows and no dots — the controls are
 * derived from the slide count, not drawn in.
 *
 * **Narrow screens.** The band is 600px at `md` and up, and `70svh` below it (`svh`,
 * not `vh`, so hiding the browser's URL bar does not resize the hero mid-scroll).
 * The copy card fills the width there, which the design's controls do not allow for:
 * arrows parked at the band's left and right edges land on the heading and the CTA.
 * So below `md` the arrows and the dots gather into one row under the card, and the
 * wrapper that holds them becomes `display: contents` at `md` — one set of markup,
 * with each control positioned exactly as the design draws it on a wide screen.
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

/** A hero shot, plus the one thing the band needs to know about it. */
type HeroImage = Image & {
  /**
   * The artwork is an image OF text, so it cannot be cropped. Set here, it is
   * dropped below `md` and the band's own surface shows instead — see slide 2.
   */
  textArt?: boolean;
};

/**
 * One entry per slide, in slide order. A null url renders the placeholder.
 *
 * The band is 1440x600 and these are 1200x675, so `Media` crops them to fill —
 * which is what the design does with them too. The cream card sits over the left
 * third, so the crop is what decides how much of a shot survives.
 */
const HERO_IMAGES: HeroImage[] = [
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
   *
   * `textArt` is why it is not shown below `md`. The band is taller than it is
   * wide there, so `object-cover` keeps under half the card's width — and every
   * slice of a card that is nothing but full-bleed type is mid-sentence
   * Indonesian behind the copy panel, which reads as a mistake. The words are all
   * in the alt text and the slide keeps its own heading and CTA, so nothing is
   * lost by letting the band's surface show instead of a fragment.
   */
  {
    url: "/home/hero-2.webp",
    textArt: true,
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
  /* Hover-pause has no touch equivalent, so a touch ends the rotation outright
     rather than pausing it for as long as a finger is down. */
  const [stopped, setStopped] = useState(false);
  const many = slides.length > 1;

  useEffect(() => {
    if (!many || paused || stopped || reduceMotion) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      ROTATE_MS,
    );

    return () => window.clearInterval(timer);
  }, [many, paused, stopped, reduceMotion, slides.length]);

  const go = (next: number) => {
    setStopped(true);
    setIndex((next + slides.length) % slides.length);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="relative h-[70svh] min-h-112 overflow-hidden bg-surface-muted md:h-150"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setStopped(true)}
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
            <div
              className={`absolute inset-0 ${
                HERO_IMAGES[slideIndex]?.textArt ? "hidden md:block" : ""
              }`}
            >
              <Media
                image={
                  HERO_IMAGES[slideIndex] ?? { url: null, altText: "", width: 1440, height: 600 }
                }
                fill
                priority={slideIndex === 0}
                sizes="100vw"
                label="Hero photo"
                className="rounded-none"
              />
            </div>

            {/* The bottom padding is the room the mobile control row sits in; at
                `md` the arrows move to the sides and the card recentres, and with
                one slide there is no row to leave room for. */}
            <div
              className={`absolute inset-0 flex items-center md:pb-0 ${many ? "pb-16" : ""}`}
            >
              <Container>
                <div className="flex max-w-130 flex-col gap-4 bg-canvas/92 p-6 md:gap-5 md:px-11 md:py-12">
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
        /* One row under the card on a phone; at `md` the wrapper stops being a box
           at all (`contents`) and its three children take the positions the design
           draws — arrows against the band's edges, dots along its bottom. */
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-3 md:contents">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="z-10 inline-flex size-13 shrink-0 cursor-pointer items-center justify-center bg-canvas/90 text-ink transition-colors duration-(--duration-base) hover:bg-canvas md:absolute md:left-7 md:top-1/2 md:-translate-y-1/2"
          >
            <ChevronLeftIcon className="size-5.5" />
            <span className="sr-only">{ui.previousSlide}</span>
          </button>

          <div className="z-10 flex items-center justify-center md:absolute md:inset-x-0 md:bottom-7">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.heading}
                type="button"
                onClick={() => go(slideIndex)}
                aria-current={slideIndex === index ? "true" : undefined}
                /* The bar is the artwork; `.wl-tap` is the 44px target around it,
                   so the design keeps its 4px rule and a thumb still lands. */
                className="wl-tap inline-flex h-11 cursor-pointer items-center px-3 md:px-1.25"
              >
                <span
                  className={`h-1 transition-[width,background-color] duration-(--duration-base) ${
                    slideIndex === index ? "w-10 bg-brand" : "w-4.5 bg-ink/35 hover:bg-brand/60"
                  }`}
                />
                <span className="sr-only">
                  {ui.goToSlide} {slideIndex + 1}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            className="z-10 inline-flex size-13 shrink-0 cursor-pointer items-center justify-center bg-canvas/90 text-ink transition-colors duration-(--duration-base) hover:bg-canvas md:absolute md:right-7 md:top-1/2 md:-translate-y-1/2"
          >
            <ChevronRightIcon className="size-5.5" />
            <span className="sr-only">{ui.nextSlide}</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
