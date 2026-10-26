"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { REPORT_STATUSES } from "@/lib/content-reports";

function parseStatus(v: FormDataEntryValue | null): string | null {
  const s = String(v || "").toLowerCase().trim();
  return (REPORT_STATUSES as readonly string[]).includes(s) ? s : null;
}

export async function setReportStatus(formData: FormData) {
  const { user, authorized } = await requireAdmin();
  if (!authorized || !user) throw new Error("Not authorized");
  const id = String(formData.get("id") || "");
  const status = parseStatus(formData.get("status"));
  if (!id || !status) throw new Error("id and valid status required");
  const prev = await prisma.contentReport.findUnique({ where: { id } });
  if (!prev) throw new Error("Report not found");
  const closed = status === "fixed" || status === "rejected";
  await prisma.contentReport.update({
    where: { id },
    data: {
      status,
      resolvedAt: closed ? new Date() : null,
      resolvedBy: closed ? user.id : null,
    },
  });
  revalidatePath("/admin/content-reports");
}

export async function deleteReport(formData: FormData) {
  const { user, authorized } = await requireAdmin();
  if (!authorized || !user) throw new Error("Not authorized");
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("id required");
  const prev = await prisma.contentReport.findUnique({ where: { id } });
  if (!prev) throw new Error("Report not found");
  await prisma.contentReport.delete({ where: { id } });
  revalidatePath("/admin/content-reports");
}
