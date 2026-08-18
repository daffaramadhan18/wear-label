import Link from "next/link";
import { announcement } from "@/lib/content/site";

/** Thin promotional strip. Static text — nothing auto-rotates, so there is no
 *  pause control to provide and no motion to reduce. */
export function AnnouncementBar() {
  return (
    <div className="wl-on-dark bg-invert text-ink-invert">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-3 gap-y-1 px-gutter py-2.5 text-center text-caption">
        <span>{announcement.text}</span>
        <Link
          href={announcement.href}
          className="underline decoration-1 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-clay-fill"
        >
          {announcement.linkLabel}
        </Link>
      </div>
    </div>
  );
}
