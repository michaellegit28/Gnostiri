import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "High School — Textbooks and Exam Banks | Gnostiri",
  description:
    "Master subjects in study textbooks, then prove it on real past papers — WAEC, JAMB, NECO and more.",
};

export default function HighSchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
