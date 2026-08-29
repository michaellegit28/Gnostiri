# Gnostiri

AI-powered learning platform. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and NextAuth.

## Setup

1. Copy `.env.example` to `.env` and fill in real secrets (never commit `.env`).
2. Install dependencies: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Push schema to your database: `npx prisma db push`
5. Run dev server: `npm run dev`

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM
- NextAuth (with Prisma adapter)
- Upstash Redis, OpenAI, Stripe, Paystack integrations (add keys in `.env`)
