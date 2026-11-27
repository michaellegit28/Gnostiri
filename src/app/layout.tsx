import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { absoluteUrl, site } from "@/lib/site";
import { BRAND_CREAM, BRAND_NAVY } from "@/components/brand/Logo";
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
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: absoluteUrl("/") },
  applicationName: site.name,
  // iOS / installed-PWA polish (Add to Home Screen, Apple store wrapper).
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [site.ogImage],
  },
};

// Browser/PWA chrome follows the app grounds (--bg dark #101B33, light #F7F9FF)
// via the brand constants. Two metas, one per scheme, because theme-color can
// never read the CSS token block; ThemeToggle and the pre-paint script below
// rewrite BOTH contents to the resolved theme so an explicit choice wins.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: BRAND_NAVY },
    { media: "(prefers-color-scheme: light)", color: BRAND_CREAM },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="midnight-scholar" className={`${display.variable} ${body.variable} ${reading.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var C={"midnight-scholar":"#0a0f1e","deep-forest":"#0a1f1a","solarized-dark":"#002b36","high-contrast":"#000000","paper-white":"#fafafa","warm-cream":"#fdf6e3","cool-slate":"#f1f5f9","solarized-light":"#fdf6e3"};var t=localStorage.getItem("gnostiri.theme");if(!C[t]){t=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)?"paper-white":"midnight-scholar"}document.documentElement.setAttribute("data-theme",t);var m=document.querySelectorAll('meta[name="theme-color"]');if(m.length){m.forEach(function(x){x.setAttribute("content",C[t])})}}catch(e){}`,
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
