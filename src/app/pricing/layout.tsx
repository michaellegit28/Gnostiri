import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gnostiri Premium — Plans",
  description:
    "All university courses and quizzes, the AI Tutor, adaptive study plans and completion certificates.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
