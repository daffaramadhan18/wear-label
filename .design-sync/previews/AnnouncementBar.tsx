import { AnnouncementBar } from "wear-label";

/**
 * The espresso strip above the header.
 *
 * One line, uppercase at label tracking, centred, and **nothing interactive in
 * it** — a bar that carries a link competes with the nav directly underneath it.
 *
 * It takes no props: the line comes from `announcement` in `lib/content/site.ts`,
 * which is the only place to change it. Empty copy renders nothing at all rather
 * than an empty band, so removing the strip is a content change, not a layout
 * change.
 */

/** The strip as the storefront ships it, over the header it sits above. */
export const Default = () => <AnnouncementBar />;

/** In place: the strip, then the sticky header bar beneath it. */
export const AboveTheHeader = () => (
  <div>
    <AnnouncementBar />
    <div className="flex h-19 items-center justify-center border-b border-hairline bg-surface">
      <span className="text-micro uppercase tracking-nav text-ink-subtle">
        Header sits here
      </span>
    </div>
  </div>
);
