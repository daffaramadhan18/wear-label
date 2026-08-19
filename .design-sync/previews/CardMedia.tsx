import { CardHover, CardMedia, Media } from "wear-label";

/**
 * The image wrapper inside a product card. It must sit inside CardHover — it
 * reads the hover/focus state through Motion's variant context and scales the
 * image to 1.03 when the card is active.
 *
 * The clip lives on a static parent, so the crop stays put while the image scales
 * underneath it. On its own, outside a CardHover, it renders the image at rest and
 * simply never animates.
 *
 * Hover is a pointer state, so a still preview shows the rest position.
 */
export const InCard = () => (
  <CardHover className="w-56">
    <CardMedia>
      <Media
        image={{ url: null, altText: "", width: 1200, height: 1500 }}
        sizes="25vw"
      />
    </CardMedia>
  </CardHover>
);
