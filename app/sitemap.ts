import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Only routes that actually exist are listed. Shop, collection and lookbook
 * routes get added here as those pages are built — listing them now would feed
 * crawlers URLs that 404.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
