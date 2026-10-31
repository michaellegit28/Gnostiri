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
  type LucideIcon,
} from "lucide-react";

/**
 * One navigation model for every surface: the desktop sidebar, the mobile
 * drawer, the bottom tab bar and the command palette all render from this.
 * Adding a destination here adds it everywhere — there is no second list to
 * drift (the old SiteMenu GROUPS array is gone).
 *
 * Accessibility contract (Phase 6d):
 *  - The accessible names below are SHARED constants, so the sidebar, the
 *    drawer and the tab bar announce themselves identically to a screen reader
 *    no matter which surface rendered them. Never re-type these strings.
 *  - An item's active state is NEVER colour-only. Every surface pairs
 *    aria-current="page" (see isActive) with a visible indicator that is not
 *    a colour: a gold dot on the bottom tabs, a left border in the drawer and
 *    sidebar. Gold text alone is not an answer.
 *  - Every NavItem carries a `note` — the sub-copy the drawer and palette
 *    render at 12px, which must stay on the .text-muted floor.
 */

/** Accessible name of the desktop sidebar and the mobile drawer (both are the
 *  same "Primary" landmark to a screen reader — only one is ever displayed). */
export const NAV_LABEL = "Primary";

/** Accessible name of the mobile bottom tab bar. Deliberately distinct from
 *  NAV_LABEL so the two landmarks are not collapsed into one. */
export const TAB_BAR_LABEL = "Primary tabs";
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  note: string;
}

export interface NavZone {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_ZONES: NavZone[] = [
  {
    id: "study",
    label: "Study",
    items: [
      { href: "/study", label: "Study", icon: BookOpen, note: "High school, university, discovery, desk" },
      { href: "/highschool", label: "High School", icon: BookOpen, note: "Exam questions, verified" },
      { href: "/university", label: "University", icon: GraduationCap, note: "Courses, full depth" },
      { href: "/discovery", label: "Discovery", icon: Compass, note: "Explore past the syllabus" },
    ],
  },
  {
    id: "workspace",
    label: "Your workspace",
    items: [
      { href: "/battle-plan", label: "Battle Plan", icon: Swords, note: "Your day-by-day mission" },
      { href: "/desk", label: "Desk", icon: FolderOpen, note: "Your uploads, notes and plans" },
      { href: "/tutor", label: "AI Tutor", icon: Sparkles, note: "Your AI study assistant" },
      { href: "/progress", label: "My Progress", icon: Trophy, note: "Streaks, accuracy, history" },
    ],
  },
  {
    id: "compete",
    label: "Compete & share",
    items: [
      { href: "/league", label: "Merit League", icon: Trophy, note: "Cups, brackets and seasons" },
      { href: "/library", label: "Public Library", icon: Library, note: "Shared notes and quizzes" },
    ],
  },
  {
    id: "membership",
    label: "Membership",
    items: [
      { href: "/pricing", label: "Gnostiri Prime", icon: Crown, note: "Unlock everything" },
      { href: "/university/revision", label: "Revision Queue", icon: RotateCcw, note: "Concepts due for review" },
      { href: "/library/credits", label: "Credits & Badges", icon: Coins, note: "Rewards earned in the Library" },
    ],
  },
];

/** The four mobile bottom tabs — the four places a student actually lives. */
export const BOTTOM_TABS: NavItem[] = [
  { href: "/", label: "Home", icon: Home, note: "Dashboard" },
  { href: "/study", label: "Study", icon: BookOpen, note: "High school, university, discovery, desk" },
  { href: "/league", label: "Compete", icon: Trophy, note: "Merit League and rankings" },
  { href: "/profile", label: "Profile", icon: GraduationCap, note: "Membership and settings" },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
