import { announcement } from "@/lib/content/site";

/**
 * The espresso strip above the header. One line, uppercase at label tracking, and
 * nothing interactive in it — a bar that carries a link competes with the nav
 * directly underneath it. Empty copy renders nothing at all rather than an empty
 * band.
 */
export function AnnouncementBar() {
  if (!announcement) return null;

  return (
    <div className="bg-invert text-ink-invert">
      <p className="mx-auto max-w-content px-gutter py-2.5 text-center text-micro uppercase tracking-label">
        {announcement}
      </p>
    </div>
  );
}
