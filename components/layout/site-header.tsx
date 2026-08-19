"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DURATION, EASE } from "@/components/motion/tokens";
import { CartIcon, CloseIcon, MenuIcon, PersonIcon } from "@/components/ui/icons";
import { nav, ui } from "@/lib/content/site";
import { Wordmark } from "./wordmark";

/**
 * Site header — the design's 76px sticky bar: the lockup on the left, uppercase
 * nav labels at 0.18em in the middle with a taupe rule under the current item, and
 * the account and bag marks on the right.
 *
 * Client-side only because of the mobile menu disclosure; the markup, links and
 * lockup all render on the server. The bag count arrives as `cartBadge` from the
 * layout, so reading the bag cookie does not force this whole component to be a
 * Server Component — nor the reverse.
 *
 * The panel is a disclosure, not a modal: it opens in normal flow underneath the
 * header rather than as an overlay. Escape closes it and focus returns to the
 * toggle. Background scroll is deliberately NOT locked — the panel is part of the
 * page, so locking it would make the lower items unreachable on a short viewport.
 *
 * It is the one place here that animates height rather than transform. A disclosure
 * that pushes the page down has to actually push it down. Height is not a
 * transform, so `MotionConfig`'s reduced-motion handling does not cover it —
 * `useReducedMotion` collapses the duration to zero instead.
 *
 * The design's search mark is not here: there is no search on the site yet, and an
 * icon that does nothing is worse than one absence.
 */
export function SiteHeader({ cartBadge }: { cartBadge?: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
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

  return (
    <header className="sticky top-0 z-(--z-sticky) bg-surface shadow-md">
      <div className="mx-auto flex h-19 max-w-content items-center justify-between gap-8 px-gutter">
        <div className="flex items-center gap-2">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-ml-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-sm text-brand transition-colors duration-(--duration-base) hover:bg-surface-muted md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? ui.closeMenu : ui.openMenu}</span>
          </button>
          <Wordmark height={26} />
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center">
            {nav.primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="relative inline-flex min-h-11 items-center px-4 text-label uppercase tracking-nav text-ink-body transition-colors duration-(--duration-base) after:absolute after:inset-x-4 after:bottom-1.5 after:h-px after:bg-transparent after:content-[''] hover:text-brand aria-[current=page]:text-brand aria-[current=page]:after:bg-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="-mr-3 flex items-center">
          <Link
            href={nav.account.href}
            aria-current={isCurrent(nav.account.href) ? "page" : undefined}
            className="inline-flex size-11 items-center justify-center rounded-sm text-ink-body transition-colors duration-(--duration-base) hover:text-brand aria-[current=page]:text-brand"
          >
            <PersonIcon className="size-5" />
            <span className="sr-only">{nav.account.label}</span>
          </Link>

          <Link
            href={nav.bag.href}
            aria-current={isCurrent(nav.bag.href) ? "page" : undefined}
            className="relative inline-flex size-11 items-center justify-center rounded-sm text-ink-body transition-colors duration-(--duration-base) hover:text-brand aria-[current=page]:text-brand"
          >
            <CartIcon className="size-5" />
            <span className="sr-only">{nav.bag.label}</span>
            {cartBadge}
          </Link>
        </div>
      </div>

      {/* Mobile disclosure panel. The wrapper stays in the DOM so `aria-controls`
          always resolves to something; only its contents come and go. */}
      <div id="mobile-nav" ref={panelRef} className="md:hidden">
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              /* `overflow-hidden` is what makes the height animation a wipe
                 rather than a squash of the links inside it. */
              className="overflow-hidden border-t border-hairline bg-surface"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  duration: reduceMotion ? 0 : DURATION.enter,
                  ease: EASE.entrance,
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  duration: reduceMotion ? 0 : DURATION.exit,
                  ease: EASE.exit,
                },
              }}
            >
              <nav aria-label="Primary, mobile" className="px-gutter py-2">
                <ul className="flex flex-col">
                  {[...nav.primary, nav.account, nav.bag].map((item) => (
                    <li key={item.href} className="border-b border-hairline last:border-0">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={isCurrent(item.href) ? "page" : undefined}
                        className="flex min-h-14 items-center text-label uppercase tracking-nav text-ink-body transition-colors duration-(--duration-base) hover:text-brand aria-[current=page]:text-brand"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
