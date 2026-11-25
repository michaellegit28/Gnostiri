// Canonical site facts, in one place. Every page's metadata, sitemap, robots and
// JSON-LD derive from here so the brand voice and the origin never drift
// between routes.
//
// NEXT_PUBLIC_SITE_URL is only needed to point preview/self-hosted deploys at
// their own origin. Unset (the normal case) resolves to production, which is
// what canonicals and OG images should reference; Vercel already marks preview
// deployments noindex, so the fallback never leaks a wrong canonical to
// crawlers. NAME only — never a secret.

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gnostiri.vercel.app"
).replace(/\/+$/, "");

export const site = {
  name: "Gnostiri",
  /** Used in title templates: "%s | Gnostiri". */
  shortName: "Gnostiri",
  tagline: "Past questions, practised properly.",
  /**
   * Written from the owner's own positioning: this is a study tool, not a
   * marketing site. Claims are concrete and testable rather than superlative,
   * because search engines and students both punish vague hype.
   */
  description:
    "Gnostiri turns JAMB, WAEC and board past questions into focused practice with instant explanations, spaced-repetition review, and a full computer-based exam simulator.",
  url: siteUrl,
  locale: "en_NG",
  /** Default social card at /opengraph-image; per-route cards override it. */
  ogImage: `${siteUrl}/opengraph-image`,
  twitter: "@gnostiri",
} as const;

/** Absolute URL for a path, for canonicals, sitemap entries and OG tags. */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Title template used by root metadata. Keep page titles comfortably under ~60. */
export function pageTitle(title: string): string {
  return `${title} | ${site.name}`;
}