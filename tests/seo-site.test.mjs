// Canonical site metadata, robots and sitemap contracts.
//
// src/lib/site.ts was introduced as the single source of truth for the brand
// voice and origin. This guard keeps the shell actually consuming it, and keeps
// private session surfaces out of the crawl.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");

const LAYOUT = read("src/app/layout.tsx");
const SITE = read("src/lib/site.ts");
const ROBOTS = read("src/app/robots.ts");
const SITEMAP = read("src/app/sitemap.ts");

test("the site module owns the canonical brand facts", () => {
  for (const fact of ["name", "tagline", "description", "url", "ogImage"]) {
    assert.match(SITE, new RegExp(`${fact}:`), `site.${fact} exists`);
  }
  assert.match(SITE, /NEXT_PUBLIC_SITE_URL/, "preview/self-hosted deploys can point at their own origin");
});

test("the root layout consumes site.ts", () => {
  assert.match(LAYOUT, /import \{ absoluteUrl, site \} from "@\/lib\/site"/);
  assert.match(LAYOUT, /metadataBase: new URL\(site\.url\)/);
  assert.match(LAYOUT, /template: `%s \| \$\{site\.name\}`/);
  assert.match(LAYOUT, /images: \[\{ url: site\.ogImage/);
});

test("robots and sitemap share the same canonical origin", () => {
  assert.match(ROBOTS, /absoluteUrl\("\/sitemap\.xml"\)/);
  assert.match(SITEMAP, /absoluteUrl\(route\)/);
  assert.match(SITEMAP, /url: absoluteUrl\(route\)/);
  for (const privateRoute of ["/desk", "/progress", "/settings", "/profile", "/tutor", "/library/credits"]) {
    assert.match(ROBOTS, new RegExp(`"${privateRoute}"`), `${privateRoute} stays out of the crawl`);
  }
  // Public study lanes stay crawlable.
  assert.match(SITEMAP, /"\/highschool"/);
  assert.match(SITEMAP, /"\/university"/);
  assert.match(SITEMAP, /"\/discovery"/);
  assert.doesNotMatch(SITEMAP, /"\/progress"/);
});