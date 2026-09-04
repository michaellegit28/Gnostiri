import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DomainProvider } from "@/context/DomainContext";

export const metadata: Metadata = {
  title: "Gnostiri",
  description: "Gnostiri — AI-powered learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DomainProvider>
            {children}
          </DomainProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
