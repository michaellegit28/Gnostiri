import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// TEMPORARY diagram inserter for bioenergetics lessons — DELETE after confirmed.
const STANDARD: { diagramId: string; caption: string }[] = [
  { diagramId: "mitochondrion", caption: "Where respiration finishes" },
  { diagramId: "chloroplast", caption: "Where photosynthesis happens" },
  { diagramId: "enzyme-optimum", caption: "Rate vs temperature/pH" },
  { diagramId: "atp-cycle", caption: "The energy currency loop" },
  { diagramId: "respiration-map", caption: "Respiration roadmap" },
  { diagramId: "photosynthesis-map", caption: "Photosynthesis roadmap" },
];
const ADVANCED: { diagramId: string; caption: string }[] = [
  ...STANDARD,
  { diagramId: "michaelis-menten", caption: "Km and Vmax" },
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "bioenergetics-biochemistry" }, include: { lessons: { orderBy: { orderIndex: "asc" } } } });
    if (!topic) throw new Error("topic missing");
    const out: Record<string, number> = {};
    const sets = [STANDARD, ADVANCED];
    for (let li = 0; li < topic.lessons.length && li < 2; li++) {
      const lesson = topic.lessons[li];
      const content = (lesson.content as unknown as { blocks: object[] }) || { blocks: [] };
      const have = new Set(content.blocks.filter((b): b is { type: string; diagramId: string } => typeof b === "object" && b !== null && (b as { type: string }).type === "diagram").map((b) => b.diagramId));
      const add = sets[li].filter((d) => !have.has(d.diagramId)).map((d) => ({ type: "diagram", ...d }));
      if (add.length) {
        await prisma.lesson.update({ where: { id: lesson.id }, data: { content: { blocks: [...content.blocks, ...add] } as object } });
      }
      out[lesson.title] = add.length;
    }
    return NextResponse.json({ ok: true, added: out });
  } catch (e) {
    console.error("temp diagrams failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
