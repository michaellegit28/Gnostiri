---
name: nextjs-repo-conventions
description: Use when writing or editing any code under src/ (App Router pages, API routes, components, lib) in this Next.js 14 repo. Trigger keywords: Next.js, app router, server component, client component, API route, middleware, generateMetadata, tailwind, component, page.
---

# Next.js 14 App Router conventions (this repo)

- **Server components by default.** No event handlers (`onClick` et al.) in server components — passing them crashes the render (the university course page digest-error incident). If a component handles events, mark it `"use client"`.
- **Routes**: app-router tree under `src/app/` (`study`, `university`, `discovery`, `highschool`, `cbt`, `arena`, `battle-plan`, `progress`, `study-plan`, `tutor`, `admin`, `certificates`, `pricing`, `launch`, `login`). API routes under `src/app/api/`.
- **Data access**: server-only via Prisma through `src/lib/`; never expose the DB client to the browser. Sessions are verified HTTP-only Firebase sessions (middleware + `src/lib/firebase/`).
- **force-dynamic pages are NOT exercised by `next build`** — a green build says nothing about them. Runtime smoke against the deployed URL is mandatory for dynamic routes (see qa-gates).
- **middleware.ts** carries the launch gate (edge HMAC) and IP rate limiting — touch it only with the access skill's owner present; breaking it gates the whole site.
- **Styling**: Tailwind with `tailwind.config.ts` tokens; UI primitives in `src/components/ui/`; keep new visual effects in `src/components/effects/` patterns, respect `prefers-reduced-motion`.
- **Copy framework docs accurately with context7** rather than from memory — Next 14.2 and Prisma 5 specifics matter here.
- TypeScript is strict (`tsconfig.json`); no `any` in new code without a comment justifying it.
