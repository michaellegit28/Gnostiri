import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discovery — Keep Going Deeper | Gnostiri",
  description:
    "Beyond the curriculum: professional certifications, practical skills, and elective topics.",
};

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
