"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FeaturesGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-muted/10 border border-border/40 rounded-xl overflow-hidden mb-12 shadow-sm">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-foreground hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">✨</span>
          <span>How to Win & Secret Features</span>
        </div>
        <svg 
          className={cn("w-5 h-5 text-muted-foreground transition-transform duration-200", open ? "rotate-180" : "")} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={cn(
        "grid gap-6 px-5 transition-all duration-300 ease-in-out",
        open ? "pb-6 opacity-100 max-h-[1000px]" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-border/40 pt-4">
          {/* Feature 1 */}
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <span className="text-brand-500">👑</span> The Lead-Capture Vault
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you claim the <strong className="text-foreground">#1 Rank</strong>, you unlock the Vault. Visitors must enter their email address to see your secret offer. We capture those emails for you automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <span className="text-yellow-500">⚡</span> Hostile Takeover
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pay 5x the current #1 bid to initiate a Hostile Takeover. You will instantly lock the #1 spot for 3 hours, and nobody can outbid you during that time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <span className="text-blue-500">🔗</span> Affiliate Loop (Free Boosts)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Copy your unique Affiliate Link from your leaderboard entry. Anyone who buys a spot using your link gives you an automatic <strong className="text-foreground">+$10 free boost</strong> to your rank!
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <span className="text-green-500">📈</span> Infinite Rank Bumping
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You can boost your existing listing at any time. You only pay the difference between your current bid and your new bid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
