import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import ReferralTracker from "@/components/ReferralTracker";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "viralme.lol — Pay to rank. Go viral.",
  description:
    "The leaderboard where your bid decides your position. Pay to rank your product, profile, or GitHub above the competition. Will you take #1 when this goes viral?",
  openGraph: {
    title: "viralme.lol — Pay to rank. Go viral.",
    description:
      "No ads, no algorithms. Just bids. Claim your spot, claim #1, and go viral.",
    url: "https://viralme.lol",
    siteName: "viralme.lol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "viralme.lol — Pay to rank. Go viral.",
    description: "The leaderboard where money = rank. Will you take #1?",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#F7F7F8] text-foreground antialiased font-sans">
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="dfid_vXi6O2z6DLnvmkHjoQF26"
          data-domain="viralme.lol"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
