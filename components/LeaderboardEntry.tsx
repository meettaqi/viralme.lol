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

  // Get specific styles for top 3
  const getContainerStyle = () => {
    if (rank === 1) return "rounded-[1.5rem] border-2 border-brand-500 bg-brand-500/5 p-4 sm:p-5";
    if (rank === 2) return "rounded-[1.5rem] border border-brand-500/60 bg-card p-4 sm:p-5";
    if (rank === 3) return "rounded-[1.5rem] border border-brand-500/30 bg-card p-4 sm:p-5";
    return "border-b border-border/50 py-4 sm:py-5 px-1 sm:px-4 bg-transparent";
  };

  const getRankStyle = () => {
    if (rank === 1) return "bg-brand-500 text-white shadow-sm";
    if (rank === 2) return "bg-brand-500/80 text-white shadow-sm";
    if (rank === 3) return "bg-brand-500/60 text-white shadow-sm";
    return "";
  };

  return (
    <div
      className={cn(
        "relative group transition-colors w-full flex flex-col hover:bg-muted/10",
        getContainerStyle(),
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

      <div className="flex items-start sm:items-center w-full gap-3 sm:gap-5 relative">
        {/* Rank */}
        <div className="flex-none w-8 sm:w-10 pt-1.5 sm:pt-0 flex justify-end">
          {isTop3 ? (
            <span className={cn(
              "flex items-center justify-center h-6 px-2.5 rounded-full text-xs font-bold",
              getRankStyle()
            )}>
              #{rank}
            </span>
          ) : (
            <span className="text-sm font-semibold text-muted-foreground mr-1">
              #{rank}
            </span>
          )}
        </div>

        {/* Icon */}
        <div className="flex-none w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white border border-border/30 shadow-sm flex items-center justify-center text-xl font-bold mt-1 sm:mt-0">
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

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between w-full pr-1">
            <span className="font-bold text-lg sm:text-xl truncate text-foreground tracking-tight pr-4">
              {bid.title || bid.identity.replace(/^https?:\/\//, '')}
            </span>
            {/* Amount floating right on top line */}
            <span
              className={cn(
                "font-bold tabular-nums text-xl sm:text-2xl flex-none ml-2 tracking-tight",
                isTop3 ? "text-brand-500" : "text-foreground"
              )}
            >
              {formatUSD(bid.amount)}
            </span>
          </div>
          
          {bid.description ? (
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug line-clamp-1 sm:line-clamp-2 pr-4 mt-0.5">
              {bid.description}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug truncate mt-0.5">
              {formatUrl(bid.identity)}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground font-medium mt-1.5">
            <span className="text-brand-500/80">{timeAgo(bid.updatedAt || bid.createdAt)}</span>
            <span className="text-brand-500 text-[10px]">●</span>
            <span className="text-foreground font-semibold">{bid.clicks || 0} clicks</span>

            {bid.boostTotal > 0 && (
              <>
                <span className="opacity-50 mx-1">·</span>
                <span className="text-brand-500">+{formatUSD(bid.boostTotal)} boosted</span>
              </>
            )}
            
            {bid.hallOfFame && (
              <>
                <span className="opacity-50 mx-1">·</span>
                <span className="text-yellow-600 font-bold uppercase tracking-wider">👑 HoF</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hover Action Overlay */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
      >
        <div className="bg-card shadow-lg border border-border/50 rounded-lg p-1.5 flex items-center gap-1.5 backdrop-blur-md">
          <div onClick={(e) => e.stopPropagation()}>
            <BoostButton identity={bid.identity} currentAmount={bid.amount} />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ReferralButton identity={bid.identity} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaimClick?.(claimAmount);
            }}
            className="flex items-center justify-center rounded bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm whitespace-nowrap"
          >
            Outbid {formatUSD(claimAmount)}
          </button>
        </div>
      </div>

      {/* Lead Vault */}
      {rank === 1 && bid.leadMagnet && (
        <div className="mt-4 ml-0 sm:ml-16 w-full sm:w-[calc(100%-4rem)] relative z-30">
          <LeadVault 
            identity={bid.identity} 
            leadMagnet={bid.leadMagnet} 
          />
        </div>
      )}
    </div>
  );
}
