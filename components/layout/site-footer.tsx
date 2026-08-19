import Link from "next/link";
import { AuroraBand } from "@/components/ui/aurora";
import { NoticeForm } from "@/components/ui/notice-form";
import { footer } from "@/lib/content/site";
import { subscribeToNewsletter } from "@/lib/shopify/actions";
import { Wordmark } from "./wordmark";

/**
 * Footer — the design's espresso band: the newsletter across the top, then the
 * lockup with three link columns, then the copyright, each separated by a rule.
 * The aurora wash sits behind it all at reduced intensity; on a dark surface the
 * gradient is doing atmosphere, not decoration.
 *
 * A column entry with no `href` is a page that does not exist yet, and renders as
 * plain text rather than as a link that would 404 (see `lib/content/site.ts`).
 */
export function SiteFooter() {
  return (
    <AuroraBand
      as="footer"
      tone="invert"
      origin="top-left"
      intensity={0.8}
      className="mt-block bg-invert text-ink-invert"
    >
      <div className="mx-auto max-w-content px-gutter pt-block-lg">
        <div className="grid items-center gap-block lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-3.5">
            <h2 className="font-display text-h2 leading-h2 text-ink-invert">
              {footer.newsletter.heading}
            </h2>
            <p className="text-small leading-snug text-ink-invert-muted">
              {footer.newsletter.body}
            </p>
          </div>

          <NoticeForm
            action={subscribeToNewsletter}
            label={footer.newsletter.heading}
            noticeClassName="text-ink-invert-muted"
          >
            <div className="flex flex-wrap gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                {footer.newsletter.label}
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={footer.newsletter.placeholder}
                className="min-h-13 min-w-0 flex-1 rounded-sm bg-canvas px-4.5 text-small text-ink placeholder:text-ink-subtle"
              />
              <button
                type="submit"
                className="min-h-13 cursor-pointer rounded-sm bg-brand px-8 text-label uppercase tracking-label text-on-brand transition-colors duration-(--duration-base) hover:bg-invert-hover"
              >
                {footer.newsletter.cta}
              </button>
            </div>
          </NoticeForm>
        </div>

        <hr className="my-block border-0 border-t border-invert-hover" />

        <div className="grid gap-block sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="flex flex-col items-start gap-5">
            <Wordmark onDark height={28} />
            <p className="text-caption leading-snug text-ink-invert-muted">{footer.note}</p>

            {footer.socials.length > 0 ? (
              <ul className="flex flex-wrap gap-3">
                {footer.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      rel="me noreferrer"
                      target="_blank"
                      className="inline-flex size-9 items-center justify-center rounded-xs border border-invert-hover text-micro text-ink-invert-muted transition-colors duration-(--duration-base) hover:border-ink-subtle hover:text-ink-invert"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <h2 className="font-body text-micro font-medium uppercase tracking-label text-ink-invert">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="text-caption text-ink-invert-muted transition-colors duration-(--duration-base) hover:text-ink-invert"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-caption text-ink-invert-muted opacity-60">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="mt-block border-0 border-t border-invert-hover" />

        <p className="py-7 text-caption text-ink-invert-muted">{footer.copyright}</p>
      </div>
    </AuroraBand>
  );
}
