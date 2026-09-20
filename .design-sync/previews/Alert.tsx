import { Alert } from "wear-label";

/**
 * The three tones. Each is a warm surface with a 2px rule down the left edge.
 *
 * Tone is carried by the text as well as the colour, which is why `label` exists:
 * it renders a visually-hidden prefix ("Error: ") so the meaning never depends on
 * hue alone. Pass it for anything but info.
 */
export const Tones = () => (
  <div className="flex max-w-xl flex-col gap-4">
    <Alert tone="success" label="Success">
      Added to your bag.
    </Alert>
    <Alert tone="error" label="Error">
      That size is no longer available. Choose another size to continue.
    </Alert>
    <Alert tone="info">Orders placed after 2pm ship the next working day.</Alert>
  </div>
);
