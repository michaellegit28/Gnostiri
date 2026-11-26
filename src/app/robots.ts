import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private / session-scoped surfaces stay out of the crawl. The server
        // also never links them from public pages, so this is the first line,
        // not the only one.
        disallow: [
          "/api/",
          "/desk",
          "/profile",
          "/settings",
          "/progress",
          "/notifications",
          "/tutor",
          "/battle-plan",
          "/study-plan",
          "/library/credits",
          "/offline",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}