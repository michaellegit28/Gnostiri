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
    start_url: "/",
    display: "standalone",
    background_color: BRAND_BG_DEEP,
    theme_color: BRAND_NAVY,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
