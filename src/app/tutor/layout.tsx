import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask Gnostiri Tutor — Gnostiri",
  description:
    "Ask Gnostiri Tutor for explanations, examples, and study plans across High School, University, and Discovery.",
};

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
