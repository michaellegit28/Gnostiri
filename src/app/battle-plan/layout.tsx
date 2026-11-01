import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Battle Plan — Gnostiri",
  description:
    "Your day-by-day exam mission — a study plan built around your exam date.",
};

export default function BattlePlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
