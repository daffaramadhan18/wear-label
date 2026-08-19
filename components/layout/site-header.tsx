"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon, UserIcon } from "@/components/ui/icons";
import { nav, ui } from "@/lib/content/site";
import { Wordmark } from "./wordmark";

/**
 * Site header. Client-side only because of the mobile menu disclosure — the
 * markup, links and wordmark all render on the server.
 *
 * The panel is a disclosure, not a modal: it opens in normal flow underneath the
 * header rather than as an overlay. Escape closes it and focus returns to the
 * toggle. Background scroll is deliberately NOT locked — the panel is part of the
 * page, so locking it would make the lower items unreachable on a short viewport.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* Close the panel when the route changes, so browser back/forward never leaves
     it hanging open. Adjusted during render rather than in an effect — an effect
     here would cause a second render pass for every navigation. */
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (pathname !== renderedPath) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const linkClass =
    "inline-flex min-h-11 items-center text-caption text-ink transition-colors duration-[var(--duration-fast)] hover:text-ink-accent aria-[current=page]:font-medium aria-[current=page]:text-ink-accent aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8";

  return (
    <header className="sticky top-0 z-(--z-sticky) border-b border-hairline bg-canvas">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-gutter py-4">
        <div className="flex items-center gap-3 md:gap-10">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-ml-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-sm text-ink transition-colors duration-[var(--duration-fast)] hover:bg-sand md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? ui.closeMenu : ui.openMenu}</span>
          </button>
          <Wordmark />
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={linkClass}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href={nav.account.href}
          aria-current={isCurrent(nav.account.href) ? "page" : undefined}
          className={`-mr-2 gap-2 rounded-sm px-2 ${linkClass}`}
        >
          <UserIcon className="size-5" />
          <span className="hidden sm:inline">{nav.account.label}</span>
          <span className="sr-only sm:hidden">{nav.account.label}</span>
        </Link>
      </div>

      {/* Mobile disclosure panel */}
      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-hairline bg-canvas md:hidden"
      >
        <nav aria-label="Primary, mobile" className="px-gutter py-4">
          <ul className="flex flex-col">
            {[...nav.primary, nav.account].map((item) => (
              <li key={item.href} className="border-b border-hairline last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="flex min-h-14 items-center font-display text-h3 text-ink transition-colors duration-[var(--duration-fast)] hover:text-ink-accent aria-[current=page]:text-ink-accent aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
