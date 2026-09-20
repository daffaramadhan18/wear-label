import { CardHover, CardMedia, Media } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * The image wrapper inside a product card.
 *
 * It must sit inside `CardHover` — it reads the hover/focus state through Motion's
 * variant context and scales the image to 1.03 when the card is active. The clip
 * lives on a static parent, so the crop stays put while the image scales
 * underneath it.
 *
 * On its own, outside a `CardHover`, it renders the image at rest and simply never
 * animates — which is a legitimate use, not a broken one.
 *
 * **Hover is a pointer state, so a still preview shows the rest position.**
 */
const moa = products.find((p) => p.handle === "moa-pants")!;

/** Inside the card, where the scale-on-hover actually happens. */
export const InCard = () => (
  <CardHover className="w-56">
    <CardMedia>
      <Media image={moa.featuredImage} sizes="25vw" ratio="1 / 1" />
    </CardMedia>
  </CardHover>
);

/** Standing alone: the same crop, at rest, with nothing to animate against. */
export const Standalone = () => (
  <div className="w-56">
    <CardMedia>
      <Media image={moa.featuredImage} sizes="25vw" ratio="1 / 1" />
    </CardMedia>
  </div>
);

/** Before the photography exists — the labelled placeholder at the same ratio. */
export const AwaitingPhotography = () => (
  <CardHover className="w-56">
    <CardMedia>
      <Media
        image={{ url: null, altText: "", width: 1024, height: 1024 }}
        sizes="25vw"
        ratio="1 / 1"
        label="Product photo"
      />
    </CardMedia>
  </CardHover>
);
