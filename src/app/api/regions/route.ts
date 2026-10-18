import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// Cascading dropdown source: regions → boards → tracks. Cacheable 60s (ISR-friendly).
export async function GET() {
  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
    include: { boards: { orderBy: { name: "asc" }, include: { tracks: { orderBy: { name: "asc" } } } } },
  });
  return NextResponse.json(
    { regions: regions.map((r) => ({ id: r.id, name: r.name, isoCode: r.isoCode, rtl: r.rtlLanguage, boards: r.boards.map((b) => ({ id: b.id, name: b.name, tracks: b.tracks.map((t) => ({ id: t.id, name: t.name })) })) })) },
    { headers: { "Cache-Control": "public, max-age=60" } }
  );
}
