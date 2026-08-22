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
  totalPageviews: number;
}

export default function HomeClient({
  initialBids,
  initialTakeover,
  topBid,
  takeoverCost,
  takeoverEnabled,
  liveVisitors,
  totalVisitors,
  totalPageviews,
}: Props) {
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto mt-0 sm:mt-2">
      {/* Live Visitors & Open Startup Badge */}
      <div className="flex items-center justify-center mb-6">
        <a 
          href="https://datafa.st/share/6a88058f18a92e2689e02ab1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-4 sm:gap-6 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-full px-5 py-2 text-[14px] text-gray-600 font-semibold hover:border-gray-300 hover:bg-white transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
            </span>
            <span>{liveVisitors !== null ? liveVisitors.toLocaleString() : 0} online</span>
          </span>
          <span className="text-gray-900">
            {totalVisitors.toLocaleString()} <span className="font-medium text-gray-500 hidden sm:inline">visitors</span>
          </span>
          <span className="text-gray-900 hidden sm:inline">
            {totalPageviews.toLocaleString()} <span className="font-medium text-gray-500">views</span>
          </span>
          <span className="text-[13px] font-bold sm:ml-2 text-brand-500">Live stats →</span>
        </a>
      </div>

      {/* Bidding Terminal (Inline) */}
      <div className="w-full mb-8">
        <BidForm
          bids={initialBids}
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
