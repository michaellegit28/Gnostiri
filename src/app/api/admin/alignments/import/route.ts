import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// POST body: { csv: string } with header topic_slug,board_name,track_name,tier,weight_notes
// Rejects ENTIRE batch if any slug invalid (per approval), validates tier + board.
export async function POST(req: NextRequest) {
  const { user, authorized } = await requireAdmin();
  if (!authorized || !user) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const { csv } = await req.json();
    if (typeof csv !== "string" || csv.length > 500_000) return NextResponse.json({ error: "Invalid CSV payload" }, { status: 400 });
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length < 2) return NextResponse.json({ error: "CSV empty" }, { status: 400 });
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const idx = {
      slug: header.indexOf("topic_slug"),
      board: header.indexOf("board_name"),
      track: header.indexOf("track_name"),
      tier: header.indexOf("tier"),
      notes: header.indexOf("weight_notes"),
    };
    if (idx.slug < 0 || idx.board < 0 || idx.tier < 0) return NextResponse.json({ error: "CSV must contain topic_slug,board_name,tier" }, { status: 400 });

    const rows = lines.slice(1).map((l, i) => {
      // minimal CSV split (no quoted commas in v1 — documented limitation)
      const cols = l.split(",").map((c) => c.trim());
      return { line: i + 2, slug: cols[idx.slug] || "", board: cols[idx.board] || "", track: idx.track >= 0 ? cols[idx.track] || "" : "", tier: (cols[idx.tier] || "").toLowerCase(), notes: idx.notes >= 0 ? cols[idx.notes] || "" : "" };
    }).filter((r) => r.slug || r.board || r.tier);

    // 1. Validate ALL slugs first — reject entire batch on any invalid
    const slugs = Array.from(new Set(rows.map((r) => r.slug)));
    const topics = await prisma.topic.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true } });
    const topicBySlug = new Map(topics.map((t) => [t.slug!, t.id]));
    const badSlugs = slugs.filter((s) => !topicBySlug.has(s));
    if (badSlugs.length > 0) return NextResponse.json({ error: `Invalid topic_slug(s): ${badSlugs.join(", ")}. Entire batch rejected.`, badSlugs }, { status: 422 });

    const badTiers = rows.filter((r) => !["core", "elective", "excluded"].includes(r.tier));
    if (badTiers.length > 0) return NextResponse.json({ error: `Invalid tier on line(s) ${badTiers.map((r) => r.line).join(", ")}. Use core|elective|excluded. Entire batch rejected.` }, { status: 422 });

    // 2. Resolve boards + tracks
    const boardNames = Array.from(new Set(rows.map((r) => r.board)));
    const boards = await prisma.curriculumBoard.findMany({ where: { name: { in: boardNames } }, select: { id: true, name: true } });
    const boardByName = new Map(boards.map((b) => [b.name, b.id]));
    const badBoards = boardNames.filter((n) => !boardByName.has(n));
    if (badBoards.length > 0) return NextResponse.json({ error: `Unknown board_name(s): ${badBoards.join(", ")}. Entire batch rejected.` }, { status: 422 });

    let created = 0;
    const today = new Date();
    for (const r of rows) {
      const topicId = topicBySlug.get(r.slug)!;
      const boardId = boardByName.get(r.board)!;
      let trackId: string | null = null;
      if (r.track) {
        const track = await prisma.studyTrack.findFirst({ where: { boardId, name: r.track } });
        if (!track) return NextResponse.json({ error: `Unknown track "${r.track}" for board "${r.board}" on line ${r.line}. Entire batch rejected.` }, { status: 422 });
        trackId = track.id;
      }
      // Default to elective when uncertain — never auto-guess core (hard constraint 4).
      // CSV must explicitly say core; here we honor explicit value only.
      const existing = trackId === null
        ? await prisma.topicBoardAlignment.findFirst({ where: { topicId, boardId, trackId: null } })
        : await prisma.topicBoardAlignment.findFirst({ where: { topicId, boardId, trackId } });
      if (existing) {
        const prev = existing.tier;
        await prisma.topicBoardAlignment.update({ where: { id: existing.id }, data: { tier: r.tier as "core" | "elective" | "excluded", weightNotes: r.notes || null, verifiedDate: today, verifiedBy: user.id } });
        await prisma.alignmentAudit.create({ data: { alignmentId: existing.id, actorEmail: user.email, action: "updated", previousValue: { tier: prev } as object, newValue: { tier: r.tier, via: "csv" } as object } });
      } else {
        const rec = await prisma.topicBoardAlignment.create({ data: { topicId, boardId, trackId, tier: r.tier as "core" | "elective" | "excluded", weightNotes: r.notes || null, verifiedDate: today, verifiedBy: user.id } });
        await prisma.alignmentAudit.create({ data: { alignmentId: rec.id, actorEmail: user.email, action: "created", newValue: { tier: r.tier, via: "csv" } as object } });
        created++;
      }
    }
    return NextResponse.json({ created, total: rows.length });
  } catch (e) {
    console.error("CSV import failed", e);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
