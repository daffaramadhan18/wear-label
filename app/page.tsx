import { Collections } from "@/components/home/collections";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { Hero } from "@/components/home/hero";
import { Lookbook } from "@/components/home/lookbook";
import { Materials } from "@/components/home/materials";
import { Newsletter } from "@/components/home/newsletter";
import { Notes } from "@/components/home/notes";
import { Process } from "@/components/home/process";
import { Story } from "@/components/home/story";
import { Values } from "@/components/home/values";
import { getCollections, getFeaturedProducts, type Image } from "@/lib/shopify";

/**
 * Landing page.
 *
 * Section order follows a storytelling pattern for a brand-led storefront:
 * hook → trust → product → who we are → how it's made → editorial → proof → CTA.
 * Product and collection data comes from `lib/shopify`; nothing here touches the
 * Storefront API directly.
 */

const HERO_IMAGE: Image = {
  url: null, // → /home/hero.jpg
  altText: "Two people in handwoven cotton, photographed in morning light in Bandung",
  width: 1200,
  height: 1400,
};

const STORY_IMAGE: Image = {
  url: null, // → /home/workshop.jpg
  altText: "The Wear Label workshop in Bandung, cloth laid out on a cutting table",
  width: 1200,
  height: 1500,
};

export default async function HomePage() {
  const [featured, collections] = await Promise.all([
    getFeaturedProducts(4),
    getCollections(3),
  ]);

  return (
    <>
      <Hero image={HERO_IMAGE} />
      <Values />
      <FeaturedCollection products={featured} />
      <Story image={STORY_IMAGE} />
      <Materials />
      <Process />
      <Collections collections={collections} />
      <Lookbook />
      <Notes />
      <Newsletter />
    </>
  );
}
