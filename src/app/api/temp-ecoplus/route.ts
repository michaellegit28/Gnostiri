import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

// TEMPORARY ecology appendix (no-skip pass) — DELETE after confirmed.
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const topic = await prisma.topic.findFirst({ where: { slug: "ecology-evolution" }, include: { lessons: { orderBy: { orderIndex: "asc" } } } });
    if (!topic || topic.lessons.length < 2) throw new Error("advanced lesson missing — seed it first");
    const lesson = topic.lessons[1];
    const content = (lesson.content as unknown as { blocks: { type: string; text?: string }[] }) || { blocks: [] };
    if (content.blocks.some((b) => b.text === "8. Field methods — counting the wild")) {
      return NextResponse.json({ ok: true, skipped: "appendix already present" });
    }
    const add = [
      { type: "heading", level: 2, text: "8. Field methods — counting the wild" },
      { type: "paragraph", text: "Quadrats (random frames for sessile organisms) and belt transects (zonation along lines) sample plants; the Lincoln index estimates mobile animals: population = (marked₁ × caught₂) ÷ recaptured. Randomise placement, repeat, and average — a single quadrat proves nothing." },
      { type: "example", text: "40 fish marked and released; later 50 caught with 10 marked → population ≈ (40×50)/10 = 200. Assumptions: no births/deaths/migration between catches, marks stay put." },
      { type: "heading", level: 2, text: "9. Biomes — climate writes the map" },
      { type: "table", headers: ["Biome", "Climate", "Life"], rows: [["Tropical rainforest", "Hot, wet year-round", "Stratified canopy, epiphytes, peak diversity"], ["Desert", "Hot, dry", "Succulents, nocturnal animals, CAM plants"], ["Savanna/grassland", "Seasonal rain", "Herds, fires, migration"], ["Temperate forest", "Four seasons", "Deciduous trees, hibernators"], ["Taiga", "Long frozen winters", "Conifers, moose, wolves"], ["Tundra", "Permafrost, brief summer", "Mosses, lichens, lemmings"]] },
      { type: "heading", level: 2, text: "10. Behaviour in full" },
      { type: "paragraph", text: "Innate: reflexes, orientation (taxes toward/away, kineses random-rate), fixed action patterns. Learned: habituation (ignore the harmless), imprinting (follow first mover — Lorenz's geese), classical and operant conditioning. Communication runs on pheromones, birdsong dialects, and dances (waggle dance maps food). True altruism (sterile worker castes, alarm-calling ground squirrels) pays through kin selection." },
      { type: "heading", level: 2, text: "11. Symbiosis up close" },
      { type: "table", headers: ["Type", "Example", "Score"], rows: [["Mutualism", "Lichen (fungus + alga), mycorrhizae, cleaner wrasse", "+/+"], ["Commensalism", "Barnacles on whales, epiphytes on branches", "+/0"], ["Parasitism", "Tapeworm, mistletoe, ticks", "+/−"]] },
      { type: "heading", level: 2, text: "12. Measuring diversity" },
      { type: "paragraph", text: "Simpson's index D = Σ(n/N)² (lower means more diverse — dominance probability); Shannon–Wiener H = −Σ(p·ln p) (higher means richer and more even). Worked: counts 10, 5, 5 (N=20): D = 0.25+0.0625+0.0625 = 0.375. Compare habitats with identical richness — evenness decides." },
      { type: "heading", level: 2, text: "13. Succession models" },
      { type: "paragraph", text: "Facilitation (pioneers prepare soil), tolerance (whoever arrives persists), inhibition (early species block later ones until disturbance). Arrested or deflected successions form plagioclimax (heathland, farmland) held by grazing, fire, or mowing." },
    ];
    await prisma.lesson.update({ where: { id: lesson.id }, data: { content: { blocks: [...content.blocks, ...add] } as object, estimatedMinutes: 75 } });
    return NextResponse.json({ ok: true, appended: add.length });
  } catch (e) {
    console.error("temp eco appendix failed", e);
    return NextResponse.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
