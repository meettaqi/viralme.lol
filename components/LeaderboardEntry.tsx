"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Bid } from "@/lib/db";
import BoostButton from "./BoostButton";
import ReferralButton from "./ReferralButton";
import Image from "next/image";

interface Props {
  bid: Bid;
  rank: number;
  isTakeover?: boolean;
  onClaimClick?: (amount: number) => void;
}

function avatarLetter(identity: string): string {
  const clean = identity.replace(/^https?:\/\//, "").replace(/^@/, "");
  return (clean[0] ?? "?").toUpperCase();
}

function formatUSD(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function formatUrl(identity: string) {
  try {
    const u = new URL(identity.startsWith("http") ? identity : `https://${identity}`);
    return u.hostname + (u.pathname !== "/" ? u.pathname : "");
  } catch {
    return identity.replace(/^@/, "@");
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function getFaviconUrl(identity: string) {
  if (identity.startsWith("@")) {
    return `https://unavatar.io/twitter/${identity.slice(1)}`;
  }
  try {
    const u = new URL(identity.startsWith("http") ? identity : `https://${identity}`);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return null;
  }
}

export default function LeaderboardEntry({ bid, rank, isTakeover, onClaimClick }: Props) {
  const [hovered, setHovered] = useState(false);
  const claimAmount = bid.amount + 1;
  const href = bid.identity.startsWith("http")
    ? bid.identity
    : bid.identity.startsWith("@")
    ? `https://x.com/${bid.identity.slice(1)}`
    : bid.identity.startsWith("github.com") || bid.identity.includes("github.com/")
    ? `https://${bid.identity.replace(/^https?:\/\//, "")}`
    : `https://${bid.identity}`;

  function handleTrack() {
    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: bid.identity }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <div
      className={cn(
        "relative group flex items-start sm:items-center p-3 sm:p-5 gap-3 sm:gap-5 transition-colors border-b last:border-b-0 border-border/40 hover:bg-muted/30",
        rank === 1 && "bg-brand-500/5 hover:bg-brand-500/10 border-brand-500/20",
        isTakeover && "bg-yellow-500/5 hover:bg-yellow-500/10"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={handleTrack}
        className="absolute inset-0 z-10"
        aria-label={`Visit ${bid.title || bid.identity}`}
      />

      <div className="flex-none w-8 sm:w-12 pt-1 sm:pt-0 text-right">
        <span className={cn(
          "text-xl sm:text-2xl font-bold font-mono tracking-tighter",
          rank === 1 ? "text-brand-500" : "text-muted-foreground/50"
        )}>
          {rank === 1 ? "👑" : `#${rank}`}
        </span>
      </div>

      <div className="flex-none w-12 h-12 sm:w-14 sm:h-14 rounded flex items-center justify-center text-xl font-bold overflow-hidden bg-white border border-border/50 shadow-sm mt-0.5 sm:mt-0">
        {getFaviconUrl(bid.identity) ? (
          <Image 
            src={getFaviconUrl(bid.identity)!} 
            alt={bid.identity}
            width={56}
            height={56}
            className="w-full h-full object-cover bg-white"
            priority={rank <= 3}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.innerText = avatarLetter(bid.identity);
              }
            }}
            unoptimized
          />
        ) : (
          avatarLetter(bid.identity)
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 sm:gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-lg sm:text-xl truncate text-foreground tracking-tight">
            {bid.title || bid.identity.replace(/^https?:\/\//, '')}
          </span>
          {bid.hallOfFame && (
            <span title="Held #1 for 24+ hours" className="flex-none text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 font-bold uppercase tracking-wider">
              HoF
            </span>
          )}
          {isTakeover && (
            <span className="flex-none text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-500 font-bold uppercase tracking-wider">
              Takeover
            </span>
          )}
        </div>
        
        {bid.description ? (
          <p className="text-sm sm:text-base text-muted-foreground leading-snug line-clamp-1 sm:line-clamp-2 pr-4">
            {bid.description}
          </p>
        ) : (
          <p className="text-sm sm:text-base text-muted-foreground leading-snug truncate">
            {formatUrl(bid.identity)}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] sm:text-xs text-muted-foreground font-medium mt-1.5 relative z-20">
          <span>{timeAgo(bid.updatedAt || bid.createdAt)}</span>
          <span className="opacity-50 hidden sm:inline">·</span>
          <span>{bid.clicks || 0} clicks</span>

          {bid.boostTotal > 0 && (
            <>
              <span className="opacity-50 hidden sm:inline">·</span>
              <span className="text-brand-400 font-bold">+{formatUSD(bid.boostTotal)} boosted</span>
            </>
          )}

          <span className="opacity-50">·</span>
          <div onClick={(e) => e.stopPropagation()} className="inline-block relative z-30">
            <BoostButton identity={bid.identity} currentAmount={bid.amount} />
          </div>

          <span className="opacity-50">·</span>
          <div onClick={(e) => e.stopPropagation()} className="inline-block relative z-30">
            <ReferralButton identity={bid.identity} />
          </div>
        </div>
      </div>

      <div className="flex-none flex flex-col items-end justify-center pl-2 sm:pl-4 relative z-20">
        <span
          className={cn(
            "font-bold tabular-nums text-2xl sm:text-3xl font-mono tracking-tighter",
            rank === 1 ? "text-brand-500" : "text-foreground"
          )}
        >
          {formatUSD(bid.amount)}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClaimClick?.(claimAmount);
          }}
          className="mt-1 sm:mt-1.5 flex items-center justify-center rounded bg-foreground text-background hover:bg-brand-500 hover:text-white px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap z-30 cursor-pointer relative"
        >
          Claim {formatUSD(claimAmount)}
        </button>
      </div>
    </div>
  );
}
