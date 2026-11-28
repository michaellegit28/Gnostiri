import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Plan — Gnostiri",
  description:
    "Write your own study plan, or generate a JAMB study plan built around your exam date.",
};

export default function StudyPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
