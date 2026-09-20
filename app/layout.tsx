import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartBadge } from "@/components/layout/cart-badge";
import { MotionProvider } from "@/components/motion/motion-provider";
import { PageTransition } from "@/components/motion/page-transition";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { brand, ui } from "@/lib/content/site";
import "./globals.css";

/**
 * Type pairing from the design system: Playfair Display for the editorial voice,
 * Poppins for the interface. next/font self-hosts both, so there is no runtime
 * request to Google and no layout shift while they load.
 *
 * Weights are the ones the system documents — 400/500/600 plus Playfair italic,
 * and 300/400/500/600 for Poppins. Poppins is not a variable font, so each weight
 * is a separate file; the list is kept to what the components actually use.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Title and description come from `lib/content/site.ts` — the storefront design's
 * own words, not invented here. An empty string there resolves to `undefined`
 * rather than an empty tag, so a crawler is never handed a blank description.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: brand.name,
    template: `%s — ${brand.name}`,
  },
  description: brand.description || undefined,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: brand.name,
    description: brand.description || undefined,
    locale: "en_US",
    url: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* Next 16 no longer overrides scroll-behavior on navigation unless asked,
         so this keeps in-page anchors smooth while route changes stay instant. */
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          /* `fixed`, not `absolute`: shift-tabbing back to this link after
             scrolling must bring it into view, not park it at the top of the
             document where the focused control would be invisible. */
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-modal) focus:rounded-sm focus:bg-brand focus:px-6 focus:py-4 focus:text-label focus:uppercase focus:tracking-label focus:text-on-brand"
        >
          {ui.skipToContent}
        </a>
        <MotionProvider>
          <AnnouncementBar />
          {/*
            The bag count is the one thing in the header that depends on the
            request. Passing it in as a node — inside its own Suspense boundary —
            keeps the cookie read to that subtree, so the header can stay a Client
            Component for its mobile disclosure and the count still renders on the
            server. The fallback is nothing at all: an empty bag has no badge, so
            there is no space to reserve and nothing to shift.
          */}
          <SiteHeader
            cartBadge={
              <Suspense fallback={null}>
                <CartBadge />
              </Suspense>
            }
          />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
