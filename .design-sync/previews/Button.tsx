import { Button } from "wear-label";

// Each named export below becomes one labeled cell on the Button card.
// Labels are the design system's own vocabulary, so a design agent reading the
// card learns which variant name to reach for.

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-4">{children}</div>
);

/** The five variants. One primary per screen is the system's rule. */
export const Variants = () => (
  <Row>
    <Button variant="primary">Add to bag</Button>
    <Button variant="outline">Size guide</Button>
    <Button variant="ghost">Cancel</Button>
    <Button variant="link">Size guide</Button>
  </Row>
);

/** Espresso full-bleed action, reserved for the checkout step. */
export const Checkout = () => (
  <div className="max-w-md">
    <Button variant="checkout" size="full">
      Continue to checkout
    </Button>
  </div>
);

/**
 * Small, medium and large. Labels stay uppercase at 0.2em tracking.
 *
 * Stacked rather than in a row: the three sizes only read as different when their
 * heights line up vertically, and a row wraps unpredictably in a narrow card.
 */
export const Sizes = () => (
  <div className="flex flex-col items-start gap-4">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

/** Only a real `<button>` can be disabled — ButtonLink has no disabled state. */
export const Disabled = () => (
  <Row>
    <Button disabled>Add to bag</Button>
    <Button variant="outline" disabled>
      Size guide
    </Button>
  </Row>
);
