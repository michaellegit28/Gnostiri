import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// One-shot: create the LaunchToken table on production. Idempotent (IF NOT
// EXISTS everywhere) — matches prisma/migrations/20261011120000_launch_tokens.
// Cadence: deploy -> trigger ONCE with REVALIDATE_SECRET -> verify via the
// generator stats endpoint -> remove in a cleanup commit.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LaunchToken" (
          "id" TEXT NOT NULL,
          "code" TEXT NOT NULL,
          "country" TEXT NOT NULL,
          "tier" TEXT NOT NULL DEFAULT 'standard',
          "usedById" TEXT,
          "usedAt" TIMESTAMP(3),
          "expiresAt" TIMESTAMP(3),
          "note" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "LaunchToken_pkey" PRIMARY KEY ("id")
      )`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "LaunchToken_code_key" ON "LaunchToken"("code")`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "LaunchToken_usedById_key" ON "LaunchToken"("usedById")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "LaunchToken_country_tier_idx" ON "LaunchToken"("country", "tier")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "LaunchToken_usedById_idx" ON "LaunchToken"("usedById")`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "LaunchToken" DROP CONSTRAINT IF EXISTS "LaunchToken_usedById_fkey"`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "LaunchToken" ADD CONSTRAINT "LaunchToken_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "LaunchToken" ENABLE ROW LEVEL SECURITY`);
    return NextResponse.json({ ok: true, created: "LaunchToken table + indexes + FK + RLS" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message.slice(0, 300) : "failed" },
      { status: 500 }
    );
  }
}
