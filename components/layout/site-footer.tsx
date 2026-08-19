import Link from "next/link";
import { Copy } from "@/components/ui/copy";
import { footer, nav } from "@/lib/content/site";
import { Wordmark } from "./wordmark";

/**
 * Footer. The system's footer is quiet: 13–14px camel copy at generous leading,
 * separated from the page by a section rule.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-canvas">
      <div className="mx-auto max-w-content px-gutter py-block-lg">
        <div className="flex flex-col gap-block md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark height={26} />
            <p className="mt-5 text-caption leading-snug text-ink-subtle">
              <Copy value={footer.note} label="footer note" lines={2} />
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2">
              {[...nav.primary, nav.account].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-label uppercase tracking-nav text-ink-muted transition-colors duration-(--duration-base) hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="wl-rule my-block" />

        <p className="max-w-xs text-caption leading-snug text-ink-subtle">
          <Copy value={footer.copyright} label="copyright" />
        </p>
      </div>
    </footer>
  );
}
