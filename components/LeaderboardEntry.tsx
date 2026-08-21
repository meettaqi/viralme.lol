"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Bid } from "@/lib/db";
import BoostButton from "./BoostButton";

interface Props {
  bid: Bid;
  rank: number;
  isTakeover?: boolean;
  onClaimClick?: (amount: number) => void;
}

const TIER_STYLES: Record<number, string> = {
  1: "border-brand-500/60 shadow-[0_0_20px_rgba(255,0,0,0.15)] bg-gradient-to-r from-brand-500/10 to-transparent",
  2: "border-brand-400/40 shadow-md",
  3: "border-brand-300/30",
};

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
  const padRank = rank < 10 ? `0${rank}` : rank;

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
        "relative group rounded-xl border bg-card transition-all duration-300 hover:border-brand-500/30 flex items-center p-4 sm:p-5 gap-4",
        rank === 1 ? "border-brand-500/50 bg-brand-500/5 scale-[1.02] animate-glow-pulse my-2" : "border-border/60 hover:bg-muted/10 overflow-hidden",
        isTakeover && "ring-1 ring-brand-500/50 shadow-sm"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationFillMode: "both", animationDelay: `${rank * 50}ms` }}
    >
      {/* Invisible link overlay for perfect SEO, middle-clicks, and popup bypassing */}
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={handleTrack}
        className="absolute inset-0 z-10"
        aria-label={`Visit ${bid.title || bid.identity}`}
      />

      {/* Rank Badge */}
      <div className="flex-none">
        <span className={cn(
          "flex items-center justify-center h-7 px-2.5 rounded-full text-xs font-bold gap-1",
          rank === 1 ? "bg-brand-500 text-white shadow-sm" : rank <= 3 ? "bg-muted text-foreground border border-border/50" : "bg-transparent text-muted-foreground"
        )}>
          {rank === 1 && <span className="text-[10px]">👑</span>}
          #{rank}
        </span>
      </div>

      {/* Favicon / Avatar */}
      <div className="flex-none w-10 h-10 rounded-full flex items-center justify-center text-base font-bold overflow-hidden bg-white border border-border/50 shadow-sm">
        {getFaviconUrl(bid.identity) ? (
          <img 
            src={getFaviconUrl(bid.identity)!} 
            alt={bid.identity}
            className="w-full h-full object-cover bg-white"
            loading={rank > 3 ? "lazy" : "eager"}
            decoding="async"
            fetchPriority={rank <= 3 ? "high" : "auto"}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerText = avatarLetter(bid.identity);
            }}
          />
        ) : (
          avatarLetter(bid.identity)
        )}
      </div>

      {/* Content: Title, Description, Metadata */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-base truncate text-foreground tracking-tight">
            {bid.title || formatUrl(bid.identity)}
          </span>
          {bid.hallOfFame && (
            <span title="Held #1 for 24+ hours" className="flex-none text-[10px] px-1.5 py-0.5 rounded-sm bg-yellow-500/10 text-yellow-500 font-bold uppercase tracking-wider">
              HoF
            </span>
          )}
          {isTakeover && (
            <span className="flex-none text-[10px] px-1.5 py-0.5 rounded-sm bg-brand-500/10 text-brand-500 font-bold uppercase tracking-wider">
              Takeover
            </span>
          )}
        </div>
        
        {/* Missing Element: Website/Handle Description */}
        {bid.description ? (
          <p className="text-sm text-foreground/85 leading-relaxed pr-2">
            {bid.description}
          </p>
        ) : null}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-0.5">
          <span>{timeAgo(bid.updatedAt || bid.createdAt)}</span>
          <span className="opacity-50">·</span>
          <span className="text-foreground font-semibold">{bid.clicks || 0} clicks</span>

          {bid.boostTotal > 0 && (
            <>
              <span className="opacity-50">·</span>
              <span className="text-brand-400">+{formatUSD(bid.boostTotal)} boosted</span>
            </>
          )}
        </div>
      </div>

      {/* Right side: Amount */}
      <div className="flex-none pl-2">
        <span
          className={cn(
            "font-semibold tabular-nums text-sm sm:text-base",
            rank === 1 ? "text-brand-500/80" : "text-muted-foreground"
          )}
        >
          {formatUSD(bid.amount)}
        </span>
      </div>

      {/* Hover Actions - Absolute Over Right Side */}
      <div
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-card p-1 rounded-lg transition-opacity duration-200 border border-border/50 shadow-sm z-20",
          rank === 1 && "bg-brand-500/10 border-brand-500/30",
          hovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <BoostButton identity={bid.identity} currentAmount={bid.amount} />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClaimClick?.(claimAmount);
          }}
          className="flex items-center gap-1 rounded bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap"
        >
          Claim {formatUSD(claimAmount)}
        </button>
      </div>
    </div>
  );
}
