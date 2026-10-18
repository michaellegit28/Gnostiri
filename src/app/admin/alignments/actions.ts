"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AlignmentTier } from "@prisma/client";

const TIERS: AlignmentTier[] = ["core", "elective", "excluded"];

function parseTier(v: FormDataEntryValue | null): AlignmentTier | null {
  const s = String(v || "").toLowerCase().trim();
  return (TIERS as string[]).includes(s) ? (s as AlignmentTier) : null;
}

export async function createAlignment(formData: FormData) {
  const { user, authorized } = await requireAdmin();
  if (!authorized || !user) throw new Error("Not authorized");
  const topicId = String(formData.get("topicId") || "").trim();
  const boardId = String(formData.get("boardId") || "").trim();
  const trackRaw = String(formData.get("trackId") || "").trim();
  const trackId = trackRaw === "" ? null : trackRaw;
  const tier = parseTier(formData.get("tier"));
  const weightNotes = String(formData.get("weightNotes") || "").trim() || null;
  const languageOfInstruction = String(formData.get("languageOfInstruction") || "").trim() || null;
  if (!topicId || !boardId || !tier) throw new Error("topic, board and valid tier required");

  // Enforce single NULL-track row per (topic, board) — Postgres UNIQUE allows multiples with NULL
  if (trackId === null) {
    const dup = await prisma.topicBoardAlignment.findFirst({ where: { topicId, boardId, trackId: null } });
    if (dup) throw new Error("Alignment already exists for this topic + board (all tracks)");
  }

  const created = await prisma.topicBoardAlignment.create({
    data: { topicId, boardId, trackId, tier, weightNotes, languageOfInstruction, verifiedDate: new Date(), verifiedBy: user.id },
  });
  await prisma.alignmentAudit.create({
    data: { alignmentId: created.id, actorEmail: user.email, action: "created", newValue: { tier, boardId, topicId, trackId } as object },
  });
  revalidatePath("/admin/alignments");
}

export async function updateAlignment(formData: FormData) {
  const { user, authorized } = await requireAdmin();
  if (!authorized || !user) throw new Error("Not authorized");
  const id = String(formData.get("id") || "");
  const tier = parseTier(formData.get("tier"));
  if (!id || !tier) throw new Error("id and valid tier required");
  const prev = await prisma.topicBoardAlignment.findUnique({ where: { id } });
  if (!prev) throw new Error("Alignment not found");
  // Defensive: never allow verifiedDate null (hard constraint 8)
  const updated = await prisma.topicBoardAlignment.update({
    where: { id },
    data: {
      tier,
      weightNotes: String(formData.get("weightNotes") ?? prev.weightNotes ?? "") || null,
      languageOfInstruction: String(formData.get("languageOfInstruction") ?? prev.languageOfInstruction ?? "") || null,
      verifiedDate: new Date(),
      verifiedBy: user.id,
    },
  });
  await prisma.alignmentAudit.create({
    data: {
      alignmentId: id,
      actorEmail: user.email,
      action: "updated",
      previousValue: { tier: prev.tier, weightNotes: prev.weightNotes } as object,
      newValue: { tier: updated.tier, weightNotes: updated.weightNotes } as object,
    },
  });
  revalidatePath("/admin/alignments");
}

export async function deleteAlignment(formData: FormData) {
  const { user, authorized } = await requireAdmin();
  if (!authorized || !user) throw new Error("Not authorized");
  const id = String(formData.get("id") || "");
  const prev = await prisma.topicBoardAlignment.findUnique({ where: { id } });
  if (!prev) throw new Error("Alignment not found");
  await prisma.topicBoardAlignment.delete({ where: { id } });
  await prisma.alignmentAudit.create({
    data: { alignmentId: id, actorEmail: user.email, action: "deleted", previousValue: { tier: prev.tier, topicId: prev.topicId, boardId: prev.boardId } as object },
  });
  revalidatePath("/admin/alignments");
}

export async function flagAlignmentForReview(formData: FormData) {
  // Educator-facing flag — any signed-in user may flag; logged to audit (no schema change needed)
  const { user } = await requireAdmin();
  const id = String(formData.get("id") || "");
  const reason = String(formData.get("reason") || "Flagged for review by educator").slice(0, 500);
  if (!id) throw new Error("id required");
  await prisma.alignmentAudit.create({
    data: { alignmentId: id, actorEmail: user?.email || "anonymous", action: "flagged", newValue: { reason } as object },
  });
  revalidatePath("/admin/alignments");
}
