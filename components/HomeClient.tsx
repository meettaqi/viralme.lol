"use client";

import { useState } from "react";
import BidForm from "./BidForm";
import Leaderboard from "./Leaderboard";
import FeaturesGuide from "./FeaturesGuide";

import FomoTicker from "./FomoTicker";
import type { Bid } from "@/lib/db";
import type { TakeoverState } from "@/lib/takeover";

interface Props {
  initialBids: Bid[];
  initialTakeover: TakeoverState;
  topBid: number;
  takeoverCost: number;
  takeoverEnabled: boolean;
  liveVisitors: number | null;
  totalVisitors: number;
}

export default function HomeClient({
  initialBids,
  initialTakeover,
  topBid,
  takeoverCost,
  takeoverEnabled,
  liveVisitors,
  totalVisitors,
}: Props) {
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto mt-0 sm:mt-2">
      {/* Hero Section */}
      <div className="text-center mb-6 max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          The #1 AI Product Directory
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-5">
          No algorithms, no fake reviews. <strong className="text-foreground">Rank is determined purely by your bid.</strong><br className="hidden sm:block"/> Put your AI Agent or Product in front of thousands of early adopters.
        </p>
        
        {/* Top Stats Badge */}
        <a 
          href={`https://datafa.st/share/${process.env.NEXT_PUBLIC_DATAFAST_ID || "dfid_vXi6O2z6DLnvmkHjoQF26"}?period=last24h&granularity=hourly`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-wrap justify-center items-center gap-2 rounded-full bg-muted/40 border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        >
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="relative inline-flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex size-2 rounded-full bg-brand-500"></span>
            </span>
            <span className="font-semibold text-brand-500">{liveVisitors !== null ? liveVisitors.toLocaleString() : 42} online</span>
          </span>
          <span className="opacity-50">·</span>
          <span>{totalVisitors.toLocaleString()} total visitors</span>
          <span className="opacity-50">·</span>
          <span>${initialBids.reduce((acc, b) => acc + b.amount, 0).toLocaleString()} volume</span>
        </a>
      </div>

      {/* Bidding Terminal (Inline) */}
      <div className="w-full mb-8">
        <BidForm
          key={bidAmount}
          defaultAmount={bidAmount}
          topBid={topBid}
          takeoverCost={takeoverCost}
          takeoverActive={initialTakeover.active}
          takeoverEnabled={takeoverEnabled}
        />
      </div>

      {/* Bottom Section: Leaderboard */}
      <div className="w-full">
        <Leaderboard
          initialBids={initialBids}
          initialTakeover={initialTakeover}
          onClaimClick={(amt) => {
            setBidAmount(amt);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>

      <div className="w-full mt-12">
        <FeaturesGuide />
      </div>

      <FomoTicker bids={initialBids} liveVisitors={liveVisitors} />
    </div>
  );
}
