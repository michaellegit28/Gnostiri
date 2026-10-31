import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gnostiri",
    short_name: "Gnostiri",
    description: "Exam questions, university courses and your AI study assistant.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090B",
    theme_color: "#D4AF37",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
