import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { brand } from "@/lib/content/site";
import "./globals.css";

/**
 * Type pairing: Fraunces (display) + Instrument Sans (body).
 *
 * Both are variable fonts, so a single file covers the whole weight range —
 * fewer requests and no per-weight preloads. Fraunces' optical-size and SOFT
 * axes are requested so display type can carry softened terminals, which is what
 * gives the headings their handmade warmth.
 *
 * next/font self-hosts both, so there is no request to Google at runtime and no
 * layout shift while they load.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.shortDescription,
  applicationName: brand.name,
  keywords: [
    "slow fashion",
    "handwoven cotton",
    "linen apparel",
    "Indonesian fashion brand",
    "Bandung apparel",
  ],
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.shortDescription,
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.shortDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* Next 16 no longer overrides scroll-behavior on navigation unless asked,
         so this keeps in-page anchors smooth while route changes stay instant. */
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
/* `fixed`, not `absolute`: shift-tabbing back to this link after scrolling
             must bring it into view, not park it at the top of the document
             where the focused control would be invisible. */
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-modal) focus:rounded-pill focus:bg-primary focus:px-5 focus:py-3 focus:text-caption focus:text-on-primary"
        >
          Skip to main content
        </a>
        <AnnouncementBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
