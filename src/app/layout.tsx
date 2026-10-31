import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DomainProvider } from "@/context/DomainContext";
import ServiceWorker from "@/components/ServiceWorker";
import AppShell from "@/components/chrome/AppShell";
import TutorPill from "@/components/chrome/TutorPill";

const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const reading = Inter({
  subsets: ["latin"],
  variable: "--font-reading",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="en" data-theme="dark" className={`${display.variable} ${body.variable} ${reading.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("gnostiri.theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}`,
          }}
        />
        <ServiceWorker />
        <AuthProvider>
          <DomainProvider>
            <AppShell>{children}</AppShell>
            <TutorPill />
          </DomainProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
