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
 * Information architecture: two learning lanes (High School / University) that
 * stay separate, a thin shared layer (tutor, discovery, my learning) and a
 * membership zone. High School exams are the Gnostiri Senior Examination
 * (GSE); University course exams are GC-(course). No descriptions live here —
 * the explanation lives only in the replayable feature tour.
 *
 * Accessibility contract:
 *  - Accessible names are SHARED constants so every surface announces identically.
 *  - An item's active state is NEVER colour-only: aria-current="page" plus a
 *    visible non-colour indicator on every surface.
 */

/** Accessible name of the desktop sidebar and the mobile drawer. */
export const NAV_LABEL = "Primary";
/** Accessible name of the mobile bottom tab bar. */
export const TAB_BAR_LABEL = "Primary tabs";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Which learning lane may see this destination. Discovery + workspace are shared. */
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
    label: "Your lane",
    items: [
      // ── High School ──
      { href: "/highschool/exams", label: "GSE", icon: ClipboardList, audience: "highschool" },
      { href: "/highschool/study", label: "Textbook study", icon: BookOpen, audience: "highschool" },
      { href: "/battle-plan", label: "Battle Plan", icon: Swords, audience: "highschool" },
      { href: "/cbt", label: "Timed CBT", icon: MonitorPlay, audience: "highschool" },
      // ── University ──
      { href: "/university", label: "Courses", icon: GraduationCap, audience: "university" },
      { href: "/desk", label: "PDF Desk", icon: FolderOpen, audience: "university" },
      { href: "/cbt", label: "Timed CBT", icon: MonitorPlay, audience: "university" },
      { href: "/university/revision", label: "Revision queue", icon: RotateCcw, audience: "university" },
    ],
  },
  {
    id: "shared",
    label: "Shared",
    items: [
      { href: "/tutor", label: "AI Tutor", icon: Sparkles, audience: "shared" },
      { href: "/discovery", label: "Discovery", icon: Compass, audience: "shared" },
    ],
  },
  {
    id: "learning",
    label: "My learning",
    items: [
      { href: "/progress", label: "Progress", icon: BarChart3, audience: "shared" },
      { href: "/league", label: "League", icon: Trophy, audience: "shared" },
      { href: "/certificates", label: "Certificates", icon: FileBadge, audience: "shared" },
      { href: "/library", label: "Library", icon: Library, audience: "shared" },
    ],
  },
  {
    id: "membership",
    label: "Membership",
    items: [
      { href: "/pricing", label: "Gnostiri Prime", icon: Crown, audience: "shared" },
      { href: "/library/credits", label: "Credits", icon: Coins, audience: "shared" },
      { href: "/profile", label: "Profile", icon: GraduationCap, audience: "shared" },
      { href: "/settings", label: "Settings", icon: Settings, audience: "shared" },
    ],
  },
];

/** The five mobile bottom tabs — where a student lives. */
export const BOTTOM_TABS: NavItem[] = [
  { href: "/", label: "Today", icon: Home, audience: "shared" },
  { href: "/study", label: "Study", icon: BookOpen, audience: "shared" },
  { href: "/cbt", label: "Practice", icon: MonitorPlay, audience: "shared" },
  { href: "/progress", label: "Progress", icon: BarChart3, audience: "shared" },
  { href: "/library", label: "Library", icon: Library, audience: "shared" },
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