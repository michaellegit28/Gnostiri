import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "High School — textbooks and past papers | Gnostiri",
  description:
    "Study JAMB subjects in the textbooks, then test yourself on real past papers.",
};

export default function HighSchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
