import { Aurora } from "wear-label";

/**
 * The aurora wash — a slow gradient for low-density bands that carry no
 * photography: the made-to-order block, the bag summary, the footer.
 *
 * It is two CSS classes, not inline styles. `.wl-aurora` in `globals.css`
 * assembles the wash and the stop lists live in `tokens.css`, so it recolours
 * with the palette instead of carrying colours of its own. This component only
 * picks a tone, an origin and an intensity.
 *
 * **`tone` must match the surface underneath.** The veil layer is painted in the
 * surface colour, so a mismatch shows up as a visible rectangle — that is the bug
 * this effect always has. Each cell below pairs the tone with the background it
 * belongs on, which is the pairing to copy.
 *
 * Never place it behind photography or the logotype: the clear-space and contrast
 * rules apply to whatever sits on top. For a band with content over the wash, use
 * `AuroraBand`, which adds the `isolate` that keeps the blend on the band rather
 * than the page.
 */

/** The four tones, each on the surface it is painted to sit on. */
export const Tones = () => (
  <div className="grid grid-cols-2 gap-4">
    <div className="relative h-40 overflow-hidden bg-canvas">
      <Aurora tone="canvas" />
      <span className="absolute bottom-3 left-3 text-micro uppercase tracking-label text-ink-subtle">
        canvas
      </span>
    </div>
    <div className="relative h-40 overflow-hidden bg-surface-muted">
      <Aurora tone="muted" />
      <span className="absolute bottom-3 left-3 text-micro uppercase tracking-label text-ink-subtle">
        muted
      </span>
    </div>
    <div className="relative h-40 overflow-hidden bg-inert">
      <Aurora tone="inert" />
      <span className="absolute bottom-3 left-3 text-micro uppercase tracking-label text-ink-subtle">
        inert
      </span>
    </div>
    <div className="relative h-40 overflow-hidden bg-invert">
      <Aurora tone="invert" />
      <span className="absolute bottom-3 left-3 text-micro uppercase tracking-label text-ink-invert-muted">
        invert
      </span>
    </div>
  </div>
);

/** Which corner the wash fades out from. */
export const Origins = () => (
  <div className="grid grid-cols-3 gap-4">
    {(["bottom-left", "top-right", "top-left"] as const).map((origin) => (
      <div key={origin} className="relative h-40 overflow-hidden bg-canvas">
        <Aurora tone="canvas" origin={origin} />
        <span className="absolute bottom-3 left-3 text-micro uppercase tracking-label text-ink-subtle">
          {origin}
        </span>
      </div>
    ))}
  </div>
);

/** `intensity` is the design's own tweak, applied as opacity. */
export const Intensity = () => (
  <div className="grid grid-cols-3 gap-4">
    {[1, 0.7, 0.4].map((intensity) => (
      <div key={intensity} className="relative h-40 overflow-hidden bg-inert">
        <Aurora tone="inert" intensity={intensity} />
        <span className="absolute bottom-3 left-3 text-micro uppercase tracking-label text-ink-subtle">
          {intensity}
        </span>
      </div>
    ))}
  </div>
);
