import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Arena (Coming Soon) — Gnostiri",
  description:
    "Inter-school and inter-country contests are opening soon. Train in High School meanwhile.",
};

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
