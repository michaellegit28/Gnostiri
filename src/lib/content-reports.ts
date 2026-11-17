import { z } from "zod";

export const REPORT_TARGET_TYPES = ["lesson", "question", "topic", "assessmentItem"] as const;
export const REPORT_CATEGORIES = ["incorrect", "unclear", "typo", "missing", "inappropriate", "other"] as const;
export const REPORT_STATUSES = ["open", "triaged", "fixed", "rejected"] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  open: "Open",
  triaged: "Triaged",
  fixed: "Fixed",
  rejected: "Not upheld",
};

export const REPORT_STATUS_TRANSITIONS: Record<ReportStatus, readonly ReportStatus[]> = {
  open: ["triaged", "rejected"],
  triaged: ["open", "fixed", "rejected"],
  fixed: ["triaged"],
  rejected: ["triaged"],
};

export function isReportStatus(value: string): value is ReportStatus {
  return (REPORT_STATUSES as readonly string[]).includes(value);
}

export function isInternalTargetUrl(value: string): boolean {
  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !/[\u0000-\u0020]/.test(value)
  );
}

export const contentReportSchema = z.object({
  domain: z.enum(["highschool", "university", "extras"]),
  targetType: z.enum(REPORT_TARGET_TYPES),
  targetId: z.string().min(1).max(120),
  targetUrl: z.string().min(1).max(500).refine(isInternalTargetUrl, "Must be an internal Gnostiri path"),
  targetTitle: z.string().max(300).optional(),
  category: z.enum(REPORT_CATEGORIES),
  detail: z.string().min(1).max(2000),
});

export type ContentReportInput = z.infer<typeof contentReportSchema>;
