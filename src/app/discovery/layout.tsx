import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discovery Lab — Research Physics | Gnostiri",
  description:
    "The Discovery Lab is Gnostiri's research space. Physics is the first lab — every level, every branch: Principles, Projects, Hypotheses, News.",
};

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
