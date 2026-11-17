"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  isInternalTargetUrl,
  isReportStatus,
  REPORT_STATUS_TRANSITIONS,
  type ReportStatus,
} from "@/lib/content-reports";
import { createNotification } from "@/lib/notify";

function parseStatus(v: FormDataEntryValue | null): ReportStatus | null {
  const s = String(v || "").toLowerCase().trim();
  return isReportStatus(s) ? s : null;
}

export async function setReportStatus(formData: FormData) {
  const { user, authorized } = await requireAdmin();
  if (!authorized || !user) throw new Error("Not authorized");
  const id = String(formData.get("id") || "");
  const status = parseStatus(formData.get("status"));
  if (!id || !status) throw new Error("id and valid status required");
  const prev = await prisma.contentReport.findUnique({
    where: { id },
    select: { status: true, reporterId: true, targetUrl: true },
  });
  if (!prev) throw new Error("Report not found");
  if (!isReportStatus(prev.status)) throw new Error("Report has an unsupported status");
  if (prev.status === status) return;
  if (!REPORT_STATUS_TRANSITIONS[prev.status].includes(status)) {
    throw new Error(`Cannot move a ${prev.status} report to ${status}`);
  }

  const closed = status === "fixed" || status === "rejected";
  const wasClosed = prev.status === "fixed" || prev.status === "rejected";
  await prisma.contentReport.update({
    where: { id },
    data: {
      status,
      resolvedAt: closed ? new Date() : null,
      resolvedBy: closed ? user.id : null,
    },
  });

  if (closed && !wasClosed && prev.reporterId) {
    try {
      await createNotification(prev.reporterId, {
        type: "report_resolved",
        title: status === "fixed" ? "Content issue fixed" : "Content report reviewed",
        body:
          status === "fixed"
            ? "The content you flagged has been fixed."
            : "We reviewed your report and could not confirm the reported content issue.",
        href: isInternalTargetUrl(prev.targetUrl) ? prev.targetUrl : null,
      });
    } catch {
      console.error("Failed to create content report notification");
    }
  }

  revalidatePath("/admin/content-reports");
}

export async function deleteReport(formData: FormData) {
  const { user, authorized } = await requireAdmin();
  if (!authorized || !user) throw new Error("Not authorized");
  const id = String(formData.get("id") || "");
  const confirmation = String(formData.get("confirmation") || "");
  if (!id) throw new Error("id required");
  if (confirmation !== "DELETE") throw new Error("Deletion confirmation required");
  const prev = await prisma.contentReport.findUnique({ where: { id }, select: { id: true } });
  if (!prev) throw new Error("Report not found");
  await prisma.contentReport.delete({ where: { id } });
  revalidatePath("/admin/content-reports");
}
