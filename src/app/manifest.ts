import { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Gnostiri", short_name: "Gnostiri", description: "Accessible curriculum learning", start_url: "/", display: "standalone", background_color: "#0F172A", theme_color: "#D4AF37", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] };
}
