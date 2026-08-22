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
      <div className="text-center mb-8 max-w-3xl mx-auto flex flex-col items-center">
        {/* Top Stats Badge */}
        <a 
          href={`https://datafa.st/share/${process.env.NEXT_PUBLIC_DATAFAST_ID || "dfid_vXi6O2z6DLnvmkHjoQF26"}?period=last24h&granularity=hourly`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex justify-center items-center gap-3 rounded-full bg-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.08)] px-4 py-2 text-[14px] font-semibold text-gray-500 transition-transform hover:-translate-y-0.5 mb-8"
        >
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[13px]">
            <span className="relative inline-flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
            </span>
            <span>{liveVisitors !== null ? liveVisitors.toLocaleString() : 42} online now</span>
          </span>
          <span className="text-gray-900">{totalVisitors.toLocaleString()} <span className="font-medium text-gray-500">views so far</span></span>
          <span className="text-[13px] font-bold">See live stats</span>
        </a>

        <h1 className="text-[52px] sm:text-[72px] leading-[1.05] font-extrabold text-[#111827] tracking-tight mb-5">
          Claim <span className="text-brand-500">#1</span> for your<br/>AI product
        </h1>
        
        <p className="text-[18px] sm:text-[20px] font-medium text-gray-600 leading-snug max-w-xl mx-auto">
          <strong className="text-green-600 font-bold">Bids start at $2.</strong> Bid under the #1 price and you still land on the board - exactly where your amount ranks.
        </p>
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
