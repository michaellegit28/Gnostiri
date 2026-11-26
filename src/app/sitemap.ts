import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const PUBLIC_ROUTES = [
  "/",
  "/study",
  "/practice",
  "/highschool",
  "/university",
  "/discovery",
  "/library",
  "/league",
  "/pricing",
  "/login",
];

/**
 * Canonical, crawler-visible entry points. Everything behind a signed-in
 * session (dashboard, desk, progress, settings) stays out of the sitemap —
 * public pages are for discovery, not for pre-auth feature discovery.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : route === "/highschool" || route === "/university" || route === "/discovery" ? 0.8 : 0.6,
  }));
}