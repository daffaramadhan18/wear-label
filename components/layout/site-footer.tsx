import Link from "next/link";
import { Copy } from "@/components/ui/copy";
import { footer, nav } from "@/lib/content/site";
import { Wordmark } from "./wordmark";

/** Minimal footer: mark, the same four destinations as the header, one note. */
export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-content px-gutter py-block-lg">
        <div className="flex flex-col gap-block md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark className="text-h3" />
            <p className="mt-5 text-caption leading-relaxed text-ink-muted">
              <Copy value={footer.note} label="footer note" lines={2} />
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-1">
              {[...nav.primary, nav.account].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-caption text-ink transition-colors duration-[var(--duration-fast)] hover:text-ink-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="wl-rule my-block" />

        <p className="max-w-xs text-caption text-ink-muted">
          <Copy value={footer.copyright} label="copyright" />
        </p>
      </div>
    </footer>
  );
}
