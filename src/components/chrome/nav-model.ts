import {
  Home,
  BookOpen,
  GraduationCap,
  Compass,
  FolderOpen,
  Sparkles,
  Swords,
  Trophy,
  Library,
  Crown,
  RotateCcw,
  Coins,
  ClipboardList,
  MonitorPlay,
  Settings,
  BarChart3,
  FileBadge,
  type LucideIcon,
} from "lucide-react";
import { isVisibleForAudience, type LearningDomain, type NavAudience } from "@/lib/learning-domain";

/**
 * One navigation model for every surface: the desktop sidebar, the mobile
 * drawer, the bottom tab bar and the command palette all render from this.
 * Adding a destination here adds it everywhere — there is no second list to
 * drift.
 *
 * Information architecture (second-phase audit): the six global-learning
 * pillars — Study, Competitions, AI Studio, Examinations, Public Library,
 * My Learning — plus a separate Membership zone (profile/subscription/
 * settings stay out of the learning flow).
 *
 * Accessibility contract (unchanged):
 *  - The accessible names are SHARED constants so every surface announces
 *    identically. Never re-type these strings.
 *  - An item's active state is NEVER colour-only: aria-current="page" plus a
 *    visible non-colour indicator on every surface.
 *  - Every NavItem carries a `note` at the .text-muted floor (12px sub-copy).
 *
 * Integrity: destinations are REAL routes only. Planned-but-unbuilt surfaces
 * (Live Voice Transcriber, Notes Studio, AI theory-marking) are intentionally
 * absent here rather than faked — see the phase-2 report.
 */

/** Accessible name of the desktop sidebar and the mobile drawer. */
export const NAV_LABEL = "Primary";
/** Accessible name of the mobile bottom tab bar. */
export const TAB_BAR_LABEL = "Primary tabs";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  note: string;
  /** Which learning lane may see this destination. Discovery + workspace are shared. */
  audience: NavAudience;
  /** Planned-but-unbuilt items render as a disabled "Soon" chip, never a dead link. */
  soon?: boolean;
}

export interface NavZone {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_ZONES: NavZone[] = [
  {
    id: "start",
    label: "Start",
    items: [
      { href: "/", label: "Home", icon: Home, note: "Your dashboard & daily mission", audience: "shared" },
    ],
  },
  {
    id: "study",
    label: "Study",
    items: [
      { href: "/study", label: "Study", icon: BookOpen, note: "Every way to study, in one place", audience: "shared" },
      { href: "/university", label: "University", icon: GraduationCap, note: "Courses, degrees, mastery", audience: "university" },
      { href: "/highschool", label: "High School", icon: BookOpen, note: "Boards, syllabuses, past papers", audience: "highschool" },
      { href: "/discovery", label: "Discovery", icon: Compass, note: "Explore past the syllabus", audience: "shared" },
      { href: "/desk", label: "PDF Desk", icon: FolderOpen, note: "Notes, plans & quizzes from your PDFs", audience: "shared" },
    ],
  },
  {
    id: "compete",
    label: "Competitions",
    items: [
      { href: "/league", label: "Competitions", icon: Trophy, note: "Speed · Endurance · Mastery · Bracket", audience: "shared" },
    ],
  },
  {
    id: "ai",
    label: "AI Studio",
    items: [
      { href: "/tutor", label: "AI Tutor", icon: Sparkles, note: "Your AI study assistant", audience: "shared" },
      { href: "/desk", label: "Notes from PDFs", icon: FolderOpen, note: "Transcription-to-notes via your documents", audience: "shared" },
    ],
  },
  {
    id: "exams",
    label: "Examinations",
    items: [
      { href: "/highschool/exams", label: "Examination boards", icon: ClipboardList, note: "Countries, boards, papers", audience: "highschool" },
      { href: "/cbt", label: "MCQ practice", icon: MonitorPlay, note: "Timed computer-based tests", audience: "highschool" },
    ],
  },
  {
    id: "library",
    label: "Public Library",
    items: [
      { href: "/library", label: "Public Library", icon: Library, note: "Shared notes and quizzes", audience: "shared" },
    ],
  },
  {
    id: "mine",
    label: "My Learning",
    items: [
      { href: "/battle-plan", label: "Battle Plan", icon: Swords, note: "Your day-by-day exam mission", audience: "highschool" },
      { href: "/progress", label: "Progress", icon: BarChart3, note: "Streaks, accuracy, history", audience: "shared" },
      { href: "/certificates", label: "Certificates", icon: FileBadge, note: "Season awards & course completion", audience: "shared" },
      { href: "/university/revision", label: "Revision queue", icon: RotateCcw, note: "Concepts due for review", audience: "university" },
    ],
  },
  {
    id: "membership",
    label: "Membership",
    items: [
      { href: "/profile", label: "Profile", icon: GraduationCap, note: "Membership, credits and settings", audience: "shared" },
      { href: "/pricing", label: "Gnostiri Prime", icon: Crown, note: "Every feature, one subscription", audience: "shared" },
      { href: "/settings", label: "Settings", icon: Settings, note: "Appearance & accessibility", audience: "shared" },
      { href: "/library/credits", label: "Credits & badges", icon: Coins, note: "Rewards earned in the Library", audience: "shared" },
    ],
  },
];

/** The five mobile bottom tabs — where a student lives. */
export const BOTTOM_TABS: NavItem[] = [
  { href: "/", label: "Today", icon: Home, note: "Your mission and progress", audience: "shared" },
  { href: "/study", label: "Study", icon: BookOpen, note: "Your lane, discovery and desk", audience: "shared" },
  { href: "/practice", label: "Practice", icon: ClipboardList, note: "Exam practice", audience: "shared" },
  { href: "/league", label: "Compete", icon: Trophy, note: "Merit League and rankings", audience: "shared" },
  { href: "/library", label: "Library", icon: Library, note: "Public resources and saved downloads", audience: "shared" },
];

/**
 * One navigation model, filtered to a learning lane. University sees University
 * + shared; High School sees High School + shared; discovery and the personal
 * workspace are shared unless a route belongs to the other lane.
 */
export function navZonesForDomain(domain: LearningDomain): NavZone[] {
  return NAV_ZONES.map((zone) => ({
    ...zone,
    items: zone.items.filter((item) => isVisibleForAudience(item.audience, domain)),
  })).filter((zone) => zone.items.length > 0);
}

export function bottomTabsForDomain(domain: LearningDomain): NavItem[] {
  return BOTTOM_TABS.filter((item) => isVisibleForAudience(item.audience, domain));
}

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
