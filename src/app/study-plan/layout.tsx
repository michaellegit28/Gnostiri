import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Plan — Gnostiri",
  description:
    "Organize learning with a manual study plan — or generate an automatic WAEC battle plan.",
};

export default function StudyPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
