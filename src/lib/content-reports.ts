import { z } from "zod";

export const REPORT_TARGET_TYPES = ["lesson", "question", "topic", "assessmentItem"] as const;
export const REPORT_CATEGORIES = ["incorrect", "unclear", "typo", "missing", "inappropriate", "other"] as const;
export const REPORT_STATUSES = ["open", "triaged", "fixed", "rejected"] as const;

export const contentReportSchema = z.object({
  domain: z.enum(["highschool", "university", "extras"]),
  targetType: z.enum(REPORT_TARGET_TYPES),
  targetId: z.string().min(1).max(120),
  targetUrl: z.string().min(1).max(500),
  targetTitle: z.string().max(300).optional(),
  category: z.enum(REPORT_CATEGORIES),
  detail: z.string().min(1).max(2000),
});

export type ContentReportInput = z.infer<typeof contentReportSchema>;
