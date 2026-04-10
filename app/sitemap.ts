import type { MetadataRoute } from "next";

const SITE_URL = "https://www.gradeforge.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const universities = ["ucp", "umt", "uol", "hec"];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...universities.map((u) => ({
      url: `${SITE_URL}/${u}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
