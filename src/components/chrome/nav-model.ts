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
 */
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
      { href: "/highschool", label: "High School", icon: BookOpen, note: "Textbooks and exam banks" },
      { href: "/university", label: "University", icon: GraduationCap, note: "Degree-depth courses" },
      { href: "/discovery", label: "Discovery", icon: Compass, note: "Follow curiosity" },
    ],
  },
  {
    id: "workspace",
    label: "Your workspace",
    items: [
      { href: "/battle-plan", label: "Battle Plan", icon: Swords, note: "Your day-by-day mission" },
      { href: "/desk", label: "Desk", icon: FolderOpen, note: "Uploads, notes and plans" },
      { href: "/tutor", label: "AI Tutor", icon: Sparkles, note: "A guide, not an oracle" },
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
  { href: "/highschool", label: "Study", icon: BookOpen, note: "High school and university" },
  { href: "/league", label: "Compete", icon: Trophy, note: "Merit League" },
  { href: "/profile", label: "Profile", icon: GraduationCap, note: "Membership and settings" },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
