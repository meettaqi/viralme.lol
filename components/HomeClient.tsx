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
}

export default function HomeClient({
  initialBids,
  initialTakeover,
  topBid,
  takeoverCost,
  takeoverEnabled,
  liveVisitors,
}: Props) {
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto mt-2 sm:mt-4">
            {/* Product Description */}
      <div className="text-center mb-6 max-w-lg mx-auto">
        <h1 className="text-foreground text-sm sm:text-base leading-relaxed text-muted-foreground font-medium">
          A public leaderboard. You pay to stand above everyone else. <br className="hidden sm:block"/> Rank is the bid — nothing else.
        </h1>
      </div>
      {/* Top Stats Badge */}
      <a 
        href={`https://datafa.st/share/${process.env.NEXT_PUBLIC_DATAFAST_ID || "dfid_vXi6O2z6DLnvmkHjoQF26"}?period=last24h&granularity=hourly`}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 inline-flex flex-wrap justify-center items-center gap-2 rounded-full bg-muted/40 border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
      >
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="relative inline-flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:animate-none"></span>
            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
          </span>
          <span className="font-semibold text-green-500">{liveVisitors !== null ? liveVisitors.toLocaleString() : 42} online</span>
        </span>
        <span className="opacity-50">·</span>
        <span>${initialBids.reduce((acc, b) => acc + b.amount, 0).toLocaleString()} volume</span>
        <span className="opacity-50">·</span>
        <span className="font-semibold text-foreground hover:underline">see stats →</span>
      </a>

      {/* Hero Text */}
      <p className="text-center text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl mb-8 leading-relaxed">
        No ads, no algorithms, no revenue sharing. Just claim your rank to get to the top. <span className="text-brand-500 font-semibold">Will you take #1 when this site goes viral?</span>
      </p>

      {/* Bidding Terminal (Inline) */}
      <div className="w-full mb-6">
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

      <FomoTicker />
    </div>
  );
}
