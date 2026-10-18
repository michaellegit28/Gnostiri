import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Progress — Gnostiri",
  description:
    "Track streaks, accuracy, and history across High School, University, and Discovery.",
};

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
