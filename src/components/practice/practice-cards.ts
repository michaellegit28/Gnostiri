import { CalendarCheck, ClipboardList, FolderDown, GraduationCap, MonitorPlay, type LucideIcon } from "lucide-react";
import { GSE } from "@/lib/exam-brand";
import type { NavAudience } from "@/lib/learning-domain";

export interface PracticeCardSpec {
  href: string;
  title: string;
  Icon: LucideIcon;
  audience: NavAudience;
}

/**
 * The practice hub's destinations. Lives outside the client grid so the
 * server page can pre-scope the payload to the active lane — a High School
 * session never receives the University card (label or href) to strip
 * client-side (same rule as /study).
 */
export const PRACTICE_CARDS: PracticeCardSpec[] = [
  {
    href: "/highschool/exams",
    title: GSE,
    Icon: ClipboardList,
    audience: "highschool",
  },
  {
    href: "/cbt",
    title: "Timed CBT",
    Icon: MonitorPlay,
    audience: "highschool",
  },
  {
    href: "/university",
    title: "Course exam halls",
    Icon: GraduationCap,
    audience: "university",
  },
  {
    href: "/battle-plan",
    title: "Study Plan",
    Icon: CalendarCheck,
    audience: "highschool",
  },
  {
    href: "/library",
    title: "Library",
    Icon: FolderDown,
    audience: "shared",
  },
];