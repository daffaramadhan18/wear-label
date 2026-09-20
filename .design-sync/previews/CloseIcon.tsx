import { CloseIcon } from "wear-label";

/**
 * The mobile navigation toggle's dismiss state — the counterpart to MenuIcon.
 * Same 24px box, 1.5 stroke, round caps, `currentColor`.
 */
export const Default = () => (
  <span className="text-ink">
    <CloseIcon />
  </span>
);

/** In the control it actually lives in: an icon-only button in the open menu. */
export const InControl = () => (
  <div className="flex items-center gap-8">
    <span className="text-ink">
      <CloseIcon />
    </span>
    <button
      type="button"
      aria-label="Close menu"
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-ink hover:text-brand"
    >
      <CloseIcon />
    </button>
    <span className="rounded-sm bg-invert p-3 text-ink-invert">
      <CloseIcon />
    </span>
  </div>
);
