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
        "relative group flex flex-col p-4 sm:p-6 transition-colors border-b last:border-b-0 border-border/40 hover:bg-muted/20 w-full",
        rank === 1 && "bg-brand-500/5 hover:bg-brand-500/10 border-brand-500/20",
        isTakeover && "bg-yellow-500/5 hover:bg-yellow-500/10"
      )}
    >
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={handleTrack}
        className="absolute inset-0 z-10"
        aria-label={`Visit ${bid.title || bid.identity}`}
      />

      <div className="flex items-start sm:items-center gap-4 sm:gap-6 w-full">
        {/* Rank */}
        <div className="flex-none w-8 sm:w-12 pt-1 sm:pt-0 text-right">
          <span className={cn(
            "text-2xl sm:text-4xl font-light tracking-tighter",
            rank === 1 ? "text-brand-500 font-bold" : "text-muted-foreground/30"
          )}>
            #{rank}
          </span>
        </div>

        {/* Icon */}
        <div className="flex-none w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden bg-white border border-border/50 shadow-sm flex items-center justify-center text-2xl font-bold mt-1 sm:mt-0">
          {getFaviconUrl(bid.identity) ? (
            <Image 
              src={getFaviconUrl(bid.identity)!} 
              alt={bid.identity}
              width={64}
              height={64}
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

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-xl sm:text-2xl truncate text-foreground tracking-tight">
              {bid.title || bid.identity.replace(/^https?:\/\//, '')}
            </span>
            {bid.hallOfFame && (
              <span title="Held #1 for 24+ hours" className="flex-none text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 font-bold uppercase tracking-wider">
                👑 HoF
              </span>
            )}
            {isTakeover && (
              <span className="flex-none text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-500 font-bold uppercase tracking-wider">
                Takeover Active
              </span>
            )}
          </div>
          
          {bid.description ? (
            <p className="text-sm sm:text-base text-muted-foreground leading-snug line-clamp-2 pr-4 font-medium">
              {bid.description}
            </p>
          ) : (
            <p className="text-sm sm:text-base text-muted-foreground leading-snug truncate font-medium">
              {formatUrl(bid.identity)}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-muted-foreground font-semibold mt-1 relative z-20">
            <span>{timeAgo(bid.updatedAt || bid.createdAt)}</span>
            <span className="opacity-40">·</span>
            <span>{bid.clicks || 0} clicks</span>

            {bid.boostTotal > 0 && (
              <>
                <span className="opacity-40">·</span>
                <span className="text-brand-500 font-bold">+{formatUSD(bid.boostTotal)} boosted</span>
              </>
            )}
          </div>
        </div>

        {/* Amount & Claim */}
        <div className="flex-none flex flex-col items-end justify-center pl-2 sm:pl-4 relative z-20">
          <span
            className={cn(
              "font-bold tabular-nums text-3xl sm:text-4xl font-mono tracking-tighter",
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
            className="mt-2 flex items-center justify-center rounded bg-foreground text-background hover:bg-brand-500 hover:text-white px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold transition-all shadow-sm whitespace-nowrap z-30 cursor-pointer relative"
          >
            Outbid {formatUSD(claimAmount)}
          </button>
        </div>
      </div>

      {/* Action Row - Always Visible on Mobile, Optional on Desktop */}
      <div className="w-full flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-border/30 relative z-30 ml-0 sm:ml-24">
        <div onClick={(e) => e.stopPropagation()} className="cursor-pointer relative z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-xs font-semibold text-muted-foreground transition-colors">
          <BoostButton identity={bid.identity} currentAmount={bid.amount} />
        </div>
        <div onClick={(e) => e.stopPropagation()} className="cursor-pointer relative z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-xs font-semibold text-muted-foreground transition-colors">
          <ReferralButton identity={bid.identity} />
        </div>
      </div>
    </div>
  );
}
