import { MenuIcon } from "wear-label";

/**
 * The mobile navigation toggle's open state. 24px box, 1.5 stroke, round caps,
 * no fill — `currentColor`, so it takes the colour of whatever it sits in.
 *
 * Icons in this system are decorative (`aria-hidden`): when an icon is a
 * control's only content, the control itself carries the accessible name.
 */
export const Default = () => (
  <span className="text-ink">
    <MenuIcon />
  </span>
);

/** Inheriting colour, and scaled up to show the stroke weight holding. */
export const Colours = () => (
  <div className="flex items-center gap-8">
    <span className="text-ink">
      <MenuIcon />
    </span>
    <span className="text-brand">
      <MenuIcon />
    </span>
    <span className="text-ink-subtle">
      <MenuIcon width={40} height={40} />
    </span>
    <span className="rounded-sm bg-invert p-3 text-ink-invert">
      <MenuIcon />
    </span>
  </div>
);
