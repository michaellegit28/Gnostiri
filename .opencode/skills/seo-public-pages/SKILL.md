---
name: seo-public-pages
description: Use when building public-facing lesson, course, exam, board, or discovery pages that should rank and share well. Trigger keywords: SEO, metadata, generateMetadata, OpenGraph, canonical, JSON-LD, sitemap, robots, OG image, share card, public page.
---

# SEO for public study pages

Public surfaces: highschool exam/board pages, university course & lesson pages, discovery trails, pricing.

Per page:
1. **`generateMetadata`** (server) on every public route: title (≤60 chars, "Concept — Board/Subject | Gnostiri"), description, canonical URL, `robots` directives.
2. **OpenGraph + Twitter cards** on every public page; OG image when the page is a primary entry point.
3. **Structured data**: `Course`/`LearningResource` JSON-LD for course and lesson pages; `Quiz`/`Question` schema for public quiz content. Keep it honest — no fake ratings.
4. **Sitemap/robots** cover dynamic lesson/exam routes; private areas (progress, tutor, cbt sessions) must be `noindex` and excluded from the sitemap.
5. **Internal linking**: lesson → module → course → subject breadcrumbs with real anchors (the CPT lesson: broken event-handler links killed a whole course page — verify links actually render).
6. **Core Web Vitals**: keep hero/images lean (`next/image`), avoid client-heavy charts above the fold; lesson bodies are server-rendered for crawlability.
7. After metadata work, render the page and check tags in the served HTML — not just in the source.
