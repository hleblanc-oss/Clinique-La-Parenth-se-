import type { MetadataRoute } from "next";
import { URL_SITE } from "@/content/clinique";
import { soins } from "@/content/soins";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: URL_SITE, priority: 1 },
    { url: `${URL_SITE}/soins`, priority: 0.9 },
    { url: `${URL_SITE}/rendez-vous`, priority: 0.9 },
    { url: `${URL_SITE}/a-propos`, priority: 0.7 },
    { url: `${URL_SITE}/contact`, priority: 0.7 },
  ];

  for (const soin of soins) {
    pages.push({ url: `${URL_SITE}/soins/${soin.slug}`, priority: 0.8 });
  }

  return pages;
}
