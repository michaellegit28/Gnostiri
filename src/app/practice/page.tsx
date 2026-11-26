import { Metadata } from "next";
import PracticeGrid from "@/components/practice/PracticeGrid";

export const metadata: Metadata = {
  title: "Practice — Gnostiri",
  description: "Timed exams, blueprint-aligned practice, study plans, and saved study bundles.",
};

/**
 * /practice — the practice hub filtered to the student's learning lane.
 * The lane itself is client-resolved (DomainContext) so a device that picked
 * University on /study does not flash High School boards here.
 */
export default function PracticePage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <header className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-electric-text">Practice</p>
        <h1 className="gn-title-gradient mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
          Turn knowledge into exam-day performance.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Work through verified questions in your lane, sit timed practice, or follow the plan built around your exam date.
        </p>
        <PracticeGrid />
      </header>
    </main>
  );
}