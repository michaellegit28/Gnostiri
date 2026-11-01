import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discovery — read past your syllabus | Gnostiri",
  description:
    "Topics past the school syllabus — certifications, practical skills and electives.",
};

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
