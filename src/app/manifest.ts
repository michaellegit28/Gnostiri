import type { MetadataRoute } from "next";
import { BRAND_BG_DEEP, BRAND_NAVY } from "@/components/brand/Logo";

// Manifest metadata is not rendered in the app, so it cannot read the
// globals.css token block — the splash colours come from the documented
// brand constants (the same source as the mark and the win card).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gnostiri",
    short_name: "Gnostiri",
    description: "Exam questions, university courses and your AI study assistant.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    lang: "en",
    dir: "ltr",
    categories: ["education"],
    background_color: BRAND_BG_DEEP,
    theme_color: BRAND_NAVY,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Installed-PWA quick actions (long-press / right-click the launcher icon).
    shortcuts: [
      { name: "GPE papers", short_name: "GPE", url: "/highschool/exams", icons: [{ src: "/icon.svg", sizes: "any" }] },
      { name: "Timed CBT", short_name: "CBT", url: "/cbt", icons: [{ src: "/icon.svg", sizes: "any" }] },
      { name: "AI Studio", short_name: "AI", url: "/university/ai", icons: [{ src: "/icon.svg", sizes: "any" }] },
      { name: "Progress", short_name: "Progress", url: "/progress", icons: [{ src: "/icon.svg", sizes: "any" }] },
    ],
  };
}
