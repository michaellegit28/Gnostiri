import {
  Home,
  BookOpen,
  GraduationCap,
  Compass,
  FolderOpen,
  Sparkles,
  ListChecks,
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
  Bell,
  type LucideIcon,
} from "lucide-react";
import { isVisibleForAudience, type LearningDomain, type NavAudience } from "@/lib/learning-domain";
import { GSE } from "@/lib/exam-brand";

/**
 * One navigation model for every surface: the sidebar menu, the mobile drawer,
 * the bottom tab bar and the command palette all render from this. Adding a
 * destination here adds it everywhere — there is no second list to drift.
 *
 * Information architecture: two isolated learning lanes (High School /
 * University) that never cross-link, a thin shared layer (tutor, discovery,
 * my learning, notifications) and a membership zone. High School exams are the
 * Gnostiri Senior Examination (GSE); University exams are GPE (Gnostiri Proficiency Exam), course halls GC-(course).
 * Timed CBT is High School only — University gets the advanced AI cluster
 * instead. No descriptions live here — explanations live only in the tour.
 *
 * Accessibility contract:
 *  - Accessible names are SHARED constants so every surface announces identically.
 *  - An item's active state is NEVER colour-only: aria-current="page" plus a
 *    visible non-colour indicator on every surface.
 */

/** Accessible name of the sidebar menu and the mobile drawer. */
export const NAV_LABEL = "Primary";
/** Accessible name of the mobile bottom tab bar. */
export const TAB_BAR_LABEL = "Primary tabs";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Which learning lane may see this destination. Shared items show in both. */
  audience: NavAudience;
}

export interface NavZone {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_ZONES: NavZone[] = [
  {
    id: "today",
    label: "Today",
    items: [
      { href: "/", label: "Home", icon: Home, audience: "shared" },
    ],
  },
  {
    id: "lane",
    label: "Study",
    items: [
      // ── High School ──
      { href: "/highschool/exams", label: GSE, icon: ClipboardList, audience: "highschool" },
      { href: "/highschool/study", label: "Textbook study", icon: BookOpen, audience: "highschool" },
      { href: "/cbt", label: "Timed CBT", icon: MonitorPlay, audience: "highschool" },
      // ── University — no Timed CBT; the advanced AI cluster lives in its own lane ──
      { href: "/university", label: "Courses", icon: GraduationCap, audience: "university" },
      { href: "/university/ai", label: "AI Studio", icon: Sparkles, audience: "university" },
      { href: "/desk", label: "Documents", icon: FolderOpen, audience: "university" },
      { href: "/university/revision", label: "Review", icon: RotateCcw, audience: "university" },
    ],
  },
  {
    id: "shared",
    label: "Discover",
    items: [
      // The tutor's CONTENT is domain-scoped server-side (its API requires a
      // lane), so each lane carries its own entry — one URL, two audiences.
      { href: "/tutor", label: "Tutor", icon: Sparkles, audience: "highschool" },
      { href: "/tutor", label: "Tutor", icon: Sparkles, audience: "university" },
      // Discovery is the neutral extras surface — the ONE shared study surface
      // (owner-approved): its trails carry no lane tag yet.
      { href: "/discovery", label: "Discovery", icon: Compass, audience: "shared" },
      // Notifications are account-level (one account, one feed).
      { href: "/notifications", label: "Notifications", icon: Bell, audience: "shared" },
    ],
  },
  {
    id: "learning",
    label: "My learning",
    items: [
      // One URL per lane audience: the route self-scopes (or lane-gates), so
      // each lane only ever sees its own entry.
      { href: "/battle-plan", label: "Study Plan", icon: ListChecks, audience: "highschool" },
      { href: "/battle-plan", label: "Study Plan", icon: ListChecks, audience: "university" },
      { href: "/progress", label: "Progress", icon: BarChart3, audience: "highschool" },
      { href: "/progress", label: "Progress", icon: BarChart3, audience: "university" },
      { href: "/league", label: "Compete", icon: Trophy, audience: "highschool" },
      { href: "/league", label: "Compete", icon: Trophy, audience: "university" },
      // Course certificates are a University surface only.
      { href: "/certificates", label: "Certificates", icon: FileBadge, audience: "university" },
      { href: "/library", label: "Library", icon: Library, audience: "highschool" },
      { href: "/library", label: "Library", icon: Library, audience: "university" },
    ],
  },
  {
    id: "membership",
    label: "Account",
    items: [
      { href: "/pricing", label: "Gnostiri Prime", icon: Crown, audience: "shared" },
      { href: "/profile", label: "Profile", icon: GraduationCap, audience: "shared" },
      { href: "/settings", label: "Settings", icon: Settings, audience: "shared" },
    ],
  },
];

/** The five mobile bottom tabs — where a student lives. Each lane gets its own set. */
export const BOTTOM_TABS: NavItem[] = [
  { href: "/", label: "Today", icon: Home, audience: "shared" },
  { href: "/study", label: "Study", icon: BookOpen, audience: "shared" },
  { href: "/cbt", label: "Practice", icon: MonitorPlay, audience: "highschool" },
  { href: "/practice", label: "Practice", icon: MonitorPlay, audience: "university" },
  { href: "/progress", label: "Progress", icon: BarChart3, audience: "highschool" },
  { href: "/progress", label: "Progress", icon: BarChart3, audience: "university" },
  { href: "/library", label: "Library", icon: Library, audience: "highschool" },
  { href: "/library", label: "Library", icon: Library, audience: "university" },
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