import type { Metadata } from "next";
import { Sora, Manrope, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DomainProvider } from "@/context/DomainContext";
import ServiceWorker from "@/components/ServiceWorker";
import SiteMenu from "@/components/chrome/SiteMenu";
import TutorPill from "@/components/chrome/TutorPill";
import LiteModeToggle from "@/components/chrome/LiteModeToggle";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const reading = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-reading",
  display: "swap",
});

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
    <html lang="en" className={`${display.variable} ${body.variable} ${reading.variable}`}>
      <body className="font-sans antialiased">
        <ServiceWorker />
        <AuthProvider>
          <DomainProvider>
            <SiteMenu />
            {children}
            <footer className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-6">
              <p className="text-xs text-slate-500">Gnostiri — text-only Lite Mode hides heavy media.</p>
              <LiteModeToggle />
            </footer>
            <TutorPill />
          </DomainProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
