import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// TEMPORARY chapter seeder (Biology Cell Biology) — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "cell-biology" } });
    if (!topic) throw new Error("master cell-biology topic missing");
    const blocks = [
      { type: "heading", level: 2, text: "The cell is the unit of life" },
      { type: "paragraph", text: "Every living organism — from bacteria to baobab trees to humans — is made of cells. Understanding the cell unlocks genetics, physiology, health, and disease." },
      { type: "definition", term: "Cell", text: "The smallest structural and functional unit of an organism. All cells share a membrane, cytoplasm, and DNA." },
      { type: "heading", level: 3, text: "Organelles and their jobs" },
      { type: "table", headers: ["Organelle", "Job", "Found in"], rows: [["Nucleus", "Stores DNA, controls the cell", "Plants + animals"], ["Mitochondrion", "Releases energy (respiration)", "Plants + animals"], ["Chloroplast", "Photosynthesis", "Plants only"], ["Ribosome", "Builds proteins", "Plants + animals"], ["Cell wall", "Strength and support", "Plants only"]] },
      { type: "heading", level: 3, text: "Membrane transport" },
      { type: "paragraph", text: "The cell membrane controls what enters and leaves: diffusion moves substances down a concentration gradient, osmosis is the diffusion of water, and active transport pumps substances against the gradient using energy." },
      { type: "example", text: "A red blood cell placed in pure water swells as water moves in by osmosis — which is why IV drips must match blood concentration." },
      { type: "heading", level: 3, text: "Mitosis and meiosis" },
      { type: "paragraph", text: "Mitosis produces two identical cells for growth and repair. Meiosis produces four different gametes with half the chromosomes for sexual reproduction." },
      { type: "callout", variant: "warning", text: "Common exam trap: mitosis = identical (growth), meiosis = variation (gametes). State which one and why in every answer." },
    ];
    const existing = await prisma.lesson.findFirst({ where: { topicId: topic.id } });
    if (existing) {
      await prisma.lesson.update({ where: { id: existing.id }, data: { title: "Cell Biology", content: { blocks } as object, estimatedMinutes: 20 } });
    } else {
      await prisma.lesson.create({ data: { domain: "highschool", topicId: topic.id, title: "Cell Biology", content: { blocks } as object, orderIndex: 0, estimatedMinutes: 20 } });
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { lastAuditedDate: new Date(), needsVerification: false } });
    return NextResponse.json({ ok: true, topic: "cell-biology", blocks: blocks.length });
  } catch (e) {
    console.error("temp chapter seed failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
