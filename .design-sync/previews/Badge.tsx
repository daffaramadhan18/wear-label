import { Badge } from "wear-label";

/**
 * All five tones side by side. Pills are reserved for badges and filter chips —
 * every other surface in this system stays near-square, so reaching for a pill
 * anywhere else breaks the look.
 */
export const Tones = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge tone="brand">New in</Badge>
    <Badge tone="promo">Final reduction</Badge>
    <Badge tone="sage">Restocked</Badge>
    <Badge tone="outline">Category 1</Badge>
    <Badge tone="inert">Sold out</Badge>
  </div>
);

/**
 * How a badge actually sits on a product card — top left, over the image.
 * Cropped to the top of the media block rather than the full 3:4 frame, so the
 * cell shows the badge and not a wall of placeholder tone.
 */
export const OnCard = () => (
  <div className="relative h-28 w-44 rounded-sm bg-tone p-4">
    <Badge tone="promo">Final reduction</Badge>
  </div>
);
