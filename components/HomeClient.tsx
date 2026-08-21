"use client";

import { useState } from "react";
import BidForm from "./BidForm";
import Leaderboard from "./Leaderboard";
import LiveDot from "./LiveDot";
import FomoTicker from "./FomoTicker";
import type { Bid } from "@/lib/db";
import type { TakeoverState } from "@/lib/takeover";

interface Props {
  initialBids: Bid[];
  initialTakeover: TakeoverState;
  topBid: number;
  takeoverCost: number;
  takeoverEnabled: boolean;
}

export default function HomeClient({
  initialBids,
  initialTakeover,
  topBid,
  takeoverCost,
  takeoverEnabled,
}: Props) {
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto mt-2 sm:mt-4">
      {/* Top Stats Badge */}
      <a 
        href={`https://datafa.st/share/${process.env.NEXT_PUBLIC_DATAFAST_ID}?period=last24h&granularity=hourly`}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 inline-flex flex-wrap justify-center items-center gap-2 rounded-full bg-muted/40 border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
      >
        <LiveDot active color="live" size="sm" />
        <span className="text-green-500 font-semibold">{initialBids.length} active entries</span>
        <span className="opacity-50">·</span>
        <span>${initialBids.reduce((acc, b) => acc + b.amount, 0).toLocaleString()} volume</span>
        <span className="opacity-50">·</span>
        <span className="font-semibold text-foreground hover:underline">see stats →</span>
      </a>

      {/* Hero Text */}
      <p className="text-center text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl mb-8 leading-relaxed">
        No ads, no algorithms, no revenue sharing. Just outbid your competition to get to the top. <span className="text-brand-500 font-semibold">Will you take #1 when this site goes viral?</span>
      </p>

      {/* Bidding Terminal (Inline) */}
      <div className="w-full mb-16">
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

      <FomoTicker />
    </div>
  );
}
