"use client";

import { useEffect, useState } from "react";
import type { TakeoverState } from "@/lib/takeover";

function useCountdown(endsAt: string) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, new Date(endsAt).getTime() - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);
  return { h, m, s, expired: remaining === 0 };
}

interface Props {
  takeover: TakeoverState;
}

export default function TakeoverBanner({ takeover }: Props) {
  const { h, m, s, expired } = useCountdown(takeover.endsAt);

  if (!takeover.active || expired) return null;

  const tweetText = encodeURIComponent(
    `🔥 ${takeover.title || takeover.identity} just triggered a HOSTILE TAKEOVER on viralme.lol — they own the #1 spot for the next ${h}h ${m}m! Can you beat them? 👀 https://viralme.lol`
  );

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent px-5 py-4 mb-8 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
      {/* Animated pulse background */}
      <div className="absolute inset-0 bg-brand-500/5 animate-[pulse_4s_ease-in-out_infinite] pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500/20 text-brand-300 flex-none shadow-[0_0_15px_rgba(255,0,0,0.2)]">
            <span className="text-lg">🔥</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-brand-300 uppercase tracking-widest">Active Takeover</span>
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-foreground text-base truncate">
                {takeover.title || takeover.identity}
              </span>
              <span className="text-muted-foreground whitespace-nowrap text-sm">has locked #1</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-none bg-background/50 backdrop-blur-md rounded-xl p-1.5 pr-4 border border-white/5 shadow-inner">
          {/* Countdown */}
          <div className="flex items-center gap-1.5 pl-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
            <div className="font-mono font-bold text-brand-400 text-lg tabular-nums tracking-tighter">
              {pad(h)}:{pad(m)}:{pad(s)}
            </div>
          </div>
          
          <div className="w-px h-6 bg-border/60" />
          
          {/* Share tweet */}
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-brand-300 transition-colors group"
          >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">𝕏</span> 
            Share
          </a>
        </div>
      </div>
    </div>
  );
}
