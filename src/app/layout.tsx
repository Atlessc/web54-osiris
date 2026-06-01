import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";

import AppNavbar from "@/features/layout/AppNavBar";
import AppBootSplash from "@/features/layout/AppBootSplash";

import "./globals.css";

const SITE_URL = "https://osirisai.live";
const SITE_NAME = "OSIRIS";
const SITE_TITLE =
  "OSIRIS — Local-First Open Source Intelligence Workspace";
const SITE_DESCRIPTION =
  "OSIRIS is a local-first intelligence workspace for monitoring open data streams, reviewing source-backed events, exploring map layers, and building configurable OSINT workflows from a browser-based interface.";

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | OSIRIS Intelligence",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "OSIRIS",
    "OSINT",
    "open source intelligence",
    "local-first intelligence workspace",
    "intelligence dashboard",
    "geospatial intelligence",
    "GEOINT",
    "source-backed intelligence",
    "event monitoring",
    "RSS intelligence feeds",
    "local JSON configuration",
    "map intelligence",
    "global incidents",
    "signals",
    "event dossiers",
    "source health",
    "flight tracking",
    "satellite tracking",
    "CCTV monitoring",
    "earthquake monitor",
    "wildfire tracker",
    "cyber threat intelligence",
    "space weather",
    "GPS jamming",
    "OSINT tools",
  ],
  authors: [{ name: "Osiris Project", url: SITE_URL }],
  creator: "Osiris Project",
  publisher: "Osiris Project",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      {
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OSIRIS — Local-First Open Source Intelligence Workspace",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OSIRIS — Local-First Open Source Intelligence Workspace",
    description:
      "Monitor open data streams, review source-backed events, explore map intelligence, and build configurable OSINT workflows.",
    creator: "@simplifaisoul",
    site: "@simplifaisoul",
    images: [`${SITE_URL}/og-image.png`],
  },
  category: "technology",
  classification: "Intelligence & Security",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "OSIRIS",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#06060C",
    "msapplication-config": "none",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "OSIRIS — Local-First Intelligence Workspace",
  alternateName: ["OSIRIS", "OsirisAI", "Osiris OSINT"],
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Local-first intelligence workspace",
    "Browser-based OSINT interface",
    "Configurable open data streams",
    "Source-backed event monitoring",
    "Map-based intelligence layers",
    "Event feed workflow",
    "Signal review workflow",
    "Source health review",
    "Local JSON configuration support",
    "Import and export-ready workspace direction",
    "Flight tracking layers",
    "Satellite tracking layers",
    "Worldwide CCTV monitoring",
    "Earthquake monitoring",
    "Wildfire tracking",
    "Cyber threat intelligence",
    "Space weather monitoring",
    "GPS jamming context",
    "Region intelligence dossiers",
  ],
  screenshot: `${SITE_URL}/og-image.png`,
  author: {
    "@type": "Organization",
    name: "Osiris Project",
    url: SITE_URL,
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className="antialiased overflow-hidden">
        <ErrorBoundary name="OSIRIS Core">
          <div className="flex h-dvh flex-col bg-[var(--bg-void)] text-white [--app-navbar-height:7.25rem] lg:[--app-navbar-height:4rem]">
            <AppBootSplash />
            <AppNavbar />

            <main
              id="app-content"
              className="relative h-[calc(100dvh-var(--app-navbar-height))] flex-1 pt-[var(--app-navbar-height)]"
            >
              <div className="relative h-full overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}