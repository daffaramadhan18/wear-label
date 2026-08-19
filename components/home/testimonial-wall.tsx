import { Container } from "@/components/ui/container";

/**
 * "From our customers" — the voices wall, between New arrivals and the mosaic.
 *
 * Four vertical tracks on a plane tilted away from the reader, each carrying five
 * reviews twice and travelling exactly one copy per cycle. The motion is pure CSS
 * (`.wl-voices-*` in `globals.css`), so this stays a Server Component and the wall
 * costs no renders.
 *
 * The geometry below was measured against the design, not eyeballed:
 *
 * - **Perspective stays long (2200px).** The tracks are ~2,700px tall. At the
 *   reference component's 300px their far ends cross the camera plane, cards
 *   project up to 26x, and most of the reviews never appear on screen.
 * - **The offsets desynchronise the tracks.** A reversed track rests at -50% at
 *   t=0, so without one it runs out of content before the bottom of the stage.
 *   They are tuned to the 560px stage height and travel with it.
 * - **Durations are four different lengths** (`--duration-voices-*`). Equal ones
 *   lock into step within seconds and the wall reads as a single sliding block.
 *
 * The cards are cream and the fades are white, matching the page shell. Both
 * halves of that pair matter: cream cards on a cream page vanish, and cream fades
 * over a white page draw a visible rectangle — the second was the first bug
 * reported against this section in the design. If the shell in `globals.css` ever
 * moves off white, `bg-canvas` here and `from-surface` on the four fades swap.
 *
 * Deviations from the component the design shipped in `handoff/`, both deliberate:
 *
 * 1. **No `Marquee` primitive.** The handoff imports a generic shadcn marquee that
 *    needs `cn()`, and brings `role="marquee"` and `tabIndex={0}` with it — a
 *    focusable element with nothing to do once focused. The strip in
 *    `instagram-strip.tsx` already establishes how this repo loops a track, so the
 *    two copies are written out here the same way.
 * 2. **13.5px and 13px are rounded to the 14px step.** The design's type scale
 *    stops at Small 14 · Label 12 · Micro 11; those two sizes are off it, and the
 *    hierarchy they carry is colour, not size. Same for 1.62 line height, which is
 *    `--leading-snug` at 1.6.
 *
 * `prefers-reduced-motion` does not merely pause this: a stopped wall would hold
 * most of its reviews outside a stage that clips at 560px. It flattens to a plain
 * grid instead — see the note in `globals.css`.
 *
 * Below `md` the same thing happens on its side: the plane is ~1300px wide and the
 * edge fades eat 30% each, so a 375px screen shows about 150px of one card. The
 * wall lies down into a horizontal snap rail carrying all twenty reviews upright —
 * again in `globals.css`, which is why the tilt and the fades are both something
 * CSS can take off from outside this file.
 */

type Review = { user: string; body: string };

/**
 * Slice, travel time and resting offset per column. Five reviews each, in
 * catalogue order — the design does not group them by theme.
 */
const COLUMNS = [
  { duration: "var(--duration-voices-a)", offset: "380px", reverse: false },
  { duration: "var(--duration-voices-b)", offset: "300px", reverse: true },
  { duration: "var(--duration-voices-c)", offset: "440px", reverse: false },
  { duration: "var(--duration-voices-d)", offset: "340px", reverse: true },
] as const;

const PER_COLUMN = 5;

function ReviewCard({ user, body }: Review) {
  return (
    /* Locked to 300x250 with the quote clamped, per the design's "same size for
       all": ragged cards on a tilted plane read as a mistake rather than a wall. */
    <figure className="flex h-62.5 w-75 shrink-0 flex-col gap-3.5 overflow-hidden border border-brand/13 bg-canvas p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-avatar font-display text-small text-on-avatar"
        >
          {user[0].toUpperCase()}
        </span>
        <figcaption className="text-caption tracking-[0.02em] text-ink">{user}</figcaption>
      </div>
      <blockquote className="line-clamp-6 text-caption leading-snug text-ink-body">
        {body}
      </blockquote>
    </figure>
  );
}

export function TestimonialWall({
  heading,
  reviews,
}: {
  heading: string;
  reviews: readonly Review[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="voices-heading" className="flex flex-col gap-10 pt-section">
      <Container className="flex flex-col items-center gap-3">
        <h2 id="voices-heading" className="text-center text-h1 leading-h1">
          {heading}
        </h2>
        {/* The same short rule that sits under New arrivals. Decorative, so a div
            rather than an <hr>: there is no section break here. */}
        <div aria-hidden="true" className="h-0.75 w-16 rounded-pill bg-brand" />
      </Container>

      {/* Full-bleed through a normal full-width parent, never `100vw` — that
          includes the scrollbar gutter and puts 8px of horizontal scroll on the
          page. */}
      <div className="wl-voices-stage wl-rail relative flex h-140 w-full items-center justify-center overflow-hidden [perspective:2200px]">
        <div className="wl-voices-plane flex items-start gap-6 [transform-style:preserve-3d]">
          {COLUMNS.map((column, index) => {
            const slice = reviews.slice(index * PER_COLUMN, (index + 1) * PER_COLUMN);
            if (slice.length === 0) return null;

            return (
              <div
                key={index}
                className="wl-voices-track"
                data-reverse={column.reverse || undefined}
                style={
                  {
                    "--voices-duration": column.duration,
                    "--voices-offset": column.offset,
                  } as React.CSSProperties
                }
              >
                {/* Two copies, so -50% lands on an identical frame. The trailing
                    padding is what makes that land on the gap, not mid-card. */}
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    /* `undefined`, not `false`: the reduced-motion fallback in
                       globals.css drops the duplicate by this attribute, and an
                       explicit aria-hidden="false" is noise in the markup. */
                    aria-hidden={copy === 1 || undefined}
                    className="flex flex-col gap-6 pb-6"
                  >
                    {slice.map((review) => (
                      <ReviewCard key={review.user + review.body.slice(0, 12)} {...review} />
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/*
          The fades sit on the stage, not inside the transformed stack — inside,
          they inherit the tilt and stop covering the edges they exist to hide.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-[42%] md:block bg-linear-to-b from-surface from-[16%] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[42%] md:block bg-linear-to-t from-surface from-[16%] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[30%] md:block bg-linear-to-r from-surface from-[24%] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[30%] md:block bg-linear-to-l from-surface from-[24%] to-transparent"
        />
      </div>
    </section>
  );
}
