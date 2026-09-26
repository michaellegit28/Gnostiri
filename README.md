# Gnostiri

AI-powered learning platform. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and Firebase Auth.

## Setup

1. Copy `.env.example` to `.env` and fill in real secrets (never commit `.env`).
2. Install dependencies: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. For a fresh local database, apply schema changes with `npx prisma migrate deploy`. The connected Supabase production database is managed with Supabase migrations; apply production SQL from the matching files in `prisma/migrations/` through Supabase so its migration history stays in sync.
5. Seed the curriculum and catalogs: `npx prisma db seed`
6. Run dev server: `npm run dev`

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM
- Firebase Auth (email/password, Google, and Apple) with verified HTTP-only server sessions
- Supabase PostgreSQL through Prisma; the server is the only database access layer
- Upstash Redis rate limits, OpenAI Tutor, Stripe, Paystack, and Razorpay (configure keys in `.env`)

## Payment webhooks

Configure provider webhooks at `/api/payments/webhook/stripe`, `/api/payments/webhook/paystack`, and `/api/payments/webhook/razorpay`. Premium access is activated only from verified payment events. Add the matching provider credentials and webhook secrets to the server environment before enabling checkout. Paystack signatures use its secret key; Stripe and Razorpay use their configured webhook secrets.

## PWA

The app manifest and service worker make Gnostiri installable and cache viewed `/study` pages for offline reading. Quiz submissions, sign-in, and checkout require a connection.
