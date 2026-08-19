"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DURATION, EASE } from "@/components/motion/tokens";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { nav, ui } from "@/lib/content/site";
import { Wordmark } from "./wordmark";

/**
 * Site header, following the design system's Navigation section: the lockup, then
 * uppercase nav labels at 0.18em tracking whose current item carries a taupe rule
 * underneath, then the account link as a utility item in camel.
 *
 * Client-side only because of the mobile menu disclosure — the markup, links and
 * lockup all render on the server.
 *
 * The panel is a disclosure, not a modal: it opens in normal flow underneath the
 * header rather than as an overlay. Escape closes it and focus returns to the
 * toggle. Background scroll is deliberately NOT locked — the panel is part of the
 * page, so locking it would make the lower items unreachable on a short viewport.
 *
 * It is the one place here that animates height rather than transform. A disclosure
 * that pushes the page down has to actually push it down; sliding a fixed-height
 * panel over the content would be cheaper to animate and a lie about the layout.
 * Height is not a transform, so `MotionConfig`'s reduced-motion handling does not
 * cover it — `useReducedMotion` collapses the duration to zero instead.
 */
export function SiteHeader() {
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
    <header className="sticky top-0 z-(--z-sticky) border-b border-rule bg-canvas">
      <div className="mx-auto flex max-w-content items-center justify-between gap-8 px-gutter py-5">
        <div className="flex items-center gap-3 md:gap-12">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-ml-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-sm text-brand transition-colors duration-(--duration-base) hover:bg-surface-muted md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? ui.closeMenu : ui.openMenu}</span>
          </button>
          <Wordmark />
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {nav.primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="inline-flex min-h-11 items-center border-b border-transparent pt-0.5 text-label uppercase tracking-nav text-ink-muted transition-colors duration-(--duration-base) hover:border-line aria-[current=page]:border-brand aria-[current=page]:text-ink"
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
          className="-mr-2 inline-flex min-h-11 items-center px-2 text-label uppercase tracking-nav text-ink-subtle transition-colors duration-(--duration-base) hover:text-brand aria-[current=page]:text-brand"
        >
          {nav.account.label}
        </Link>
      </div>

      {/* Mobile disclosure panel. The wrapper stays in the DOM so `aria-controls`
          always resolves to something; only its contents come and go. */}
      <div id="mobile-nav" ref={panelRef} className="md:hidden">
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              /* `overflow-hidden` is what makes the height animation a wipe
                 rather than a squash of the links inside it. */
              className="overflow-hidden border-t border-hairline bg-canvas"
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
                  {[...nav.primary, nav.account].map((item) => (
                    <li key={item.href} className="border-b border-hairline last:border-0">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={isCurrent(item.href) ? "page" : undefined}
                        className="flex min-h-14 items-center text-label uppercase tracking-nav text-ink-muted transition-colors duration-(--duration-base) hover:text-brand aria-[current=page]:text-brand"
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
