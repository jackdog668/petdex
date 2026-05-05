import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

import { FeedbackWidget } from "@/components/feedback-widget";
import { OnboardingTour } from "@/components/onboarding-tour";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO(brand): replace placeholder values once final brand info is set.
const SITE_NAME = "Homiedex";
const SITE_URL = "https://homiedex.vercel.app";
const SITE_DESCRIPTION =
  "Homiedex is the Black & African American pop culture codex of pixel pets. Browse the legends — music, film, sports, comedy, civil rights, literature — as tiny animated companions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Homiedex — Black & African American pop culture pixel pets",
    template: "%s | Homiedex",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Homiedex",
    "Black pop culture",
    "African American pop culture",
    "pixel pet",
    "animated pet",
    "Black icons",
    "hip hop",
    "soul",
    "Codex pet",
    "terminal pet",
  ],
  authors: [{ name: "Homiedex" }],
  creator: "Homiedex",
  publisher: "Homiedex",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Homiedex — Black & African American pop culture pixel pets",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Homiedex" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Homiedex — Black & African American pop culture pixel pets",
    description: SITE_DESCRIPTION,
    images: ["/og-twitter.png"],
    creator: "@db_alchemy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <FeedbackWidget />
          <OnboardingTour />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
