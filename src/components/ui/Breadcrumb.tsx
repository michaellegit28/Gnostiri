import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb — canonical-hierarchy trail (A1-confirmed trees only):
 * Study: Home > High School > Study > [Subject] > [Topic]
 * Exams:  Home > High School > Exams > [Board] > [Subject] > [Paper]
 * Legacy /highschool/[exam] routes are NOT canonical — never link them here.
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm text-slate-400"
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <ChevronRight className="h-4 w-4 text-slate-600" aria-hidden="true" />
            )}
            {last || !item.href ? (
              <span
                aria-current={last ? "page" : undefined}
                className="font-medium text-slate-100"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
