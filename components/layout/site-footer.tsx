import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { brand, footerNote, nav } from "@/lib/content/site";
import { Wordmark } from "./wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-content px-gutter py-block-lg">
        <div className="grid gap-block md:grid-cols-[1.2fr_2fr]">
          <div>
            <Wordmark className="text-h3" />
            <p className="mt-5 wl-measure-narrow text-caption leading-relaxed text-ink-muted">
              {brand.shortDescription}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {nav.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="inline-flex min-h-11 items-center gap-1 text-caption text-ink underline decoration-1 underline-offset-4 decoration-line transition-colors duration-[var(--duration-fast)] hover:decoration-ink"
                  >
                    {item.label}
                    <ArrowUpRightIcon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-block sm:grid-cols-3">
            {nav.footer.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-body text-eyebrow font-medium uppercase tracking-eyebrow text-ink-muted">
                  {group.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-caption text-ink transition-colors duration-[var(--duration-fast)] hover:text-ink-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <hr className="wl-rule my-block" />

        <div className="grid gap-6 text-caption text-ink-muted md:grid-cols-2">
          <p>{footerNote.shipping}</p>
          <p className="md:text-right">{footerNote.payment}</p>
        </div>

        <div className="mt-block flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-caption text-ink-muted">
          <p>{footerNote.copyright}</p>
          <ul className="flex flex-wrap gap-x-5">
            {nav.legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center transition-colors duration-[var(--duration-fast)] hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
