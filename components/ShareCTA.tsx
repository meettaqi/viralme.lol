"use client";

import { useState } from "react";

export default function ShareCTA() {
  const [shared, setShared] = useState(false);

  const tweetText = encodeURIComponent(
    "Pay to rank on viralme.lol 🔥 — the leaderboard where your bid decides your position. Will you take #1? 👀 https://viralme.lol"
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  function handleShare() {
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
    setShared(true);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 to-card/40 px-5 py-5 flex flex-col sm:flex-row items-center gap-4 mt-6 backdrop-blur-sm shadow-sm group">
      <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex-1 text-center sm:text-left">
        <h4 className="font-bold text-foreground text-sm flex items-center justify-center sm:justify-start gap-2">
          <span>📈</span> Every share = more competition.
        </h4>
        <p className="text-muted-foreground text-sm mt-1">
          Share viralme.lol on X to bring more eyes to the board. The more people playing, the more your #1 spot is worth.
        </p>
      </div>
      
      <button
        onClick={handleShare}
        className={`relative z-10 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-md active:scale-95 flex-none ${
          shared
            ? "bg-green-500/10 border border-green-500/30 text-green-400"
            : "bg-foreground text-background hover:bg-foreground/90 border border-transparent"
        }`}
      >
        {shared ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Shared!
          </>
        ) : (
          <>
            <span>𝕏</span> Share on X
          </>
        )}
      </button>
    </div>
  );
}
