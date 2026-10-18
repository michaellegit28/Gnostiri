import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gnostiri Premium — Plans",
  description:
    "Unlock university courses, adaptive plans, certificates, and unlimited Tutor access.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
