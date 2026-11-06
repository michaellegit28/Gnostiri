import Link from "next/link";
import { BookOpen, Compass, GraduationCap, Library, Sparkles, Upload } from "lucide-react";

/**
 * QuickLinks — jump-off points to every learning environment and the Public
 * Library (spec Part 7/8). One coherent row, module accents carried through,
 * so a student can always see where to go next.
 */
const LINKS = [
  { href: "/university", label: "University", note: "Courses & modules", Icon: GraduationCap, accent: "text-electric-text" },
  { href: "/highschool", label: "High School", note: "Subjects & papers", Icon: BookOpen, accent: "text-cyan-300" },
  { href: "/discovery", label: "Discovery", note: "Past the syllabus", Icon: Compass, accent: "text-violet-300" },
  { href: "/library", label: "Library", note: "Public resources", Icon: Library, accent: "text-cyan-300" },
  { href: "/desk", label: "PDF Desk", note: "Notes & quizzes", Icon: Upload, accent: "text-electric-text" },
  { href: "/tutor", label: "AI Tutor", note: "Ask anything", Icon: Sparkles, accent: "text-violet-300" },
];

export default function QuickLinks() {
  return (
    <nav aria-label="Quick access" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {LINKS.map(({ href, label, note, Icon, accent }) => (
        <Link
          key={href}
          href={href}
          className="gn-motion group flex flex-col gap-2 rounded-2xl border border-line bg-surface/40 p-4 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-lift)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Icon className={`h-6 w-6 ${accent} transition-colors group-hover:text-primary`} aria-hidden />
          <span className="text-sm font-semibold text-slate-100">{label}</span>
          <span className="text-xs text-muted">{note}</span>
        </Link>
      ))}
    </nav>
  );
}
