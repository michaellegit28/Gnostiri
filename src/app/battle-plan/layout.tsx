import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Battle Plan — Gnostiri",
  description:
    "Your day-by-day exam mission — an automatic study plan built around your target date.",
};

export default function BattlePlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
