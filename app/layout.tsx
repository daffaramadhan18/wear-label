import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { brand, ui } from "@/lib/content/site";
import "./globals.css";

/**
 * Type pairing: Fraunces (display) + Instrument Sans (body). Both are variable
 * fonts, so one file covers the whole weight range. next/font self-hosts them, so
 * there is no runtime request to Google and no layout shift while they load.
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

/**
 * Only the company name is asserted here. Tagline and description are blank in
 * `lib/content/site.ts` and stay out of the metadata until they are written —
 * shipping placeholder text to crawlers and social cards would be worse than
 * shipping nothing.
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
      className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          /* `fixed`, not `absolute`: shift-tabbing back to this link after
             scrolling must bring it into view, not park it at the top of the
             document where the focused control would be invisible. */
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-modal) focus:rounded-pill focus:bg-primary focus:px-5 focus:py-3 focus:text-caption focus:text-on-primary"
        >
          {ui.skipToContent}
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
