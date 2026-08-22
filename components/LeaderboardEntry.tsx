"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Bid } from "@/lib/db";
import BoostButton from "./BoostButton";
import ReferralButton from "./ReferralButton";
import Image from "next/image";
import LeadVault from "./LeadVault";

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
  if (m < 1) return "1 minute ago";
  if (m < 60) return `${m} minutes ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hours ago`;
  const d = Math.floor(h / 24);
  return `${d} days ago`;
}

function getFaviconUrl(identity: string) {
  if (identity.startsWith("@")) {
    return `https://unavatar.io/twitter/${identity.slice(1)}`;
  }
  try {
    const u = new URL(identity.startsWith("http") ? identity : `https://${identity}`);
    return `https://icon.horse/icon/${u.hostname}`;
  } catch {
    return null;
  }
}

export default function LeaderboardEntry({ bid, rank, isTakeover, onClaimClick }: Props) {
  const isTop3 = rank <= 3;
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
    <article
      className={cn(
        "relative flex w-full cursor-pointer items-start gap-3 px-3.5 py-3 transition hover:bg-muted/30 sm:gap-4 sm:px-5 sm:py-[14px]",
        "border-b border-border/50 last:border-b-0",
        // Top 3 specific border/bg to satisfy "all 3" request while maintaining layout
        rank === 1 && "rounded-[1.5rem] border-2 border-brand-500 bg-brand-500/5 hover:bg-brand-500/10",
        rank === 2 && "rounded-[1.5rem] border border-brand-500/60 bg-card hover:bg-muted/30",
        rank === 3 && "rounded-[1.5rem] border border-brand-500/30 bg-card hover:bg-muted/30",
        isTakeover && "ring-2 ring-yellow-500 shadow-sm"
      )}
    >
      {/* Invisible link overlay */}
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={handleTrack}
        className="absolute inset-0 z-10"
        aria-label={`Visit ${bid.title || bid.identity}`}
      />

      {/* Rank & Icon (Left Column) */}
      <div className="flex shrink-0 flex-col items-center gap-1 z-20">
        <span className={cn(
          "text-[13px] font-semibold sm:text-[14px]",
          isTop3 ? "bg-brand-500 text-white rounded-full px-2 py-0.5 shadow-sm text-xs" : "text-muted-foreground"
        )}>
          #{rank}
        </span>
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[10px] border border-black/10 bg-white overflow-hidden flex items-center justify-center shadow-sm">
          {getFaviconUrl(bid.identity) ? (
            <Image 
              src={getFaviconUrl(bid.identity)!} 
              alt={bid.identity}
              width={48}
              height={48}
              className="w-full h-full object-cover"
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
            <span className="font-bold text-lg text-muted-foreground">{avatarLetter(bid.identity)}</span>
          )}
        </div>
      </div>

      {/* Content (Right Column) */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 z-20 pointer-events-none">
        
        {/* Title & Price Row */}
        <div className="flex items-baseline justify-between gap-3">
          <a 
            href={href} 
            target="_blank" 
            className="min-w-0 truncate text-[16px] leading-[1.25] font-semibold tracking-[-0.4px] text-foreground hover:underline sm:text-[18px] pointer-events-auto"
          >
            {bid.title || bid.identity.replace(/^https?:\/\//, '')}
          </a>
          <span className={cn(
            "shrink-0 text-[18px] sm:text-[22px] font-bold tabular-nums",
            isTop3 ? "text-brand-500" : "text-foreground"
          )}>
            {formatUSD(bid.amount)}
          </span>
        </div>
        
        {/* Description Row */}
        {bid.description ? (
          <p className="truncate text-[13px] leading-[1.4] font-medium tracking-[-0.2px] text-muted-foreground sm:text-[14px]">
            {bid.description}
          </p>
        ) : (
          <p className="truncate text-[13px] leading-[1.4] font-medium tracking-[-0.2px] text-muted-foreground sm:text-[14px]">
            {formatUrl(bid.identity)}
          </p>
        )}
        
        {/* Bottom Meta & Actions Row */}
        <div className="flex items-center flex-wrap gap-2.5 mt-1 pointer-events-auto relative z-30">
          <span className="shrink-0 px-2 py-0.5 text-[12px] sm:text-[13px] font-medium bg-muted text-muted-foreground rounded-md flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            {bid.clicks || 0} clicks
          </span>
          <time className="min-w-0 flex-1 truncate text-[12px] sm:text-[13px] tracking-[-0.26px] text-muted-foreground font-medium">
            {timeAgo(bid.updatedAt || bid.createdAt)}
          </time>
          
          <div className="flex items-center gap-2">
            <BoostButton identity={bid.identity} currentAmount={bid.amount} />
            <ReferralButton identity={bid.identity} />
            <button 
              className="shrink-0 tracking-[-0.5px] bg-brand-500/10 text-brand-600 font-semibold px-3 py-[5px] text-[13px] sm:px-[14px] sm:py-[6px] sm:text-[15px] rounded-full hover:bg-brand-500 hover:text-white transition-colors shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClaimClick?.(claimAmount);
              }}
            >
              Take this spot
            </button>
          </div>
        </div>

        {/* Lead Vault (If #1) */}
        {rank === 1 && bid.leadMagnet && (
          <div className="mt-2 w-full relative z-30 pointer-events-auto">
            <LeadVault 
              identity={bid.identity} 
              leadMagnet={bid.leadMagnet} 
            />
          </div>
        )}
      </div>
    </article>
  );
}
