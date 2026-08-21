import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
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
      "No ads, no algorithms. Just bids. Outbid the competition, claim #1, and go viral.",
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
      <head>
        {process.env.NEXT_PUBLIC_DATAFAST_ID && (
          <script defer data-website-id={process.env.NEXT_PUBLIC_DATAFAST_ID} src="https://datafa.st/js/script.js"></script>
        )}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
