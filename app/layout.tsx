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
  title: "viralme.lol — The #1 AI Product Directory",
  description:
    "No algorithms, no fake reviews. Rank is determined purely by your bid. Put your AI Agent or Product in front of thousands of early adopters.",
  metadataBase: new URL("https://viralme.lol"),
  openGraph: {
    title: "viralme.lol — The #1 AI Product Directory",
    description:
      "No algorithms, no fake reviews. Rank is determined purely by your bid. Put your AI Agent or Product in front of thousands of early adopters.",
    url: "https://viralme.lol",
    siteName: "viralme.lol",
    images: [
      {
        url: "https://viralme.lol/preview.png",
        width: 1200,
        height: 630,
        alt: "viralme.lol Preview",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "viralme.lol — The #1 AI Product Directory",
    description: "No algorithms, no fake reviews. Rank is determined purely by your bid. Put your AI Agent or Product in front of thousands of early adopters.",
    images: ["https://viralme.lol/preview.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");whop.setScope("biz_SIuMh5ziOk95R5");whop.track("page");`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F7F7F8] text-foreground antialiased font-sans">
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        <Script 
          defer 
          data-website-id="dfid_vXi6O2z6DLnvmkHjoQF26" 
          src="https://datafa.st/js/script.js" 
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
