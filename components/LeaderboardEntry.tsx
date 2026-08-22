"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Bid } from "@/lib/db";
import BoostButton from "./BoostButton";
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
  const [clicks, setClicks] = useState(bid.clicks || 0);
  const [tracked, setTracked] = useState(false);

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
    if (tracked) return;
    setTracked(true);
    setClicks(prev => prev + 1);
    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity: bid.identity }),
      keepalive: true,
    }).catch(() => {});
  }

  if (isTop3) {
    return (
      <article
        className={cn(
          "relative flex w-full cursor-pointer items-start gap-4 p-5 sm:p-6 transition-all duration-200",
          "bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]",
          isTakeover && "ring-2 ring-yellow-400 bg-yellow-50/10"
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

        {/* Left Column */}
        <div className="flex shrink-0 flex-col items-center gap-1.5 z-20">
          <span className="text-[18px] sm:text-[22px] font-extrabold text-brand-600">
            #{rank}
          </span>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] border border-black/5 bg-gray-50 overflow-hidden flex items-center justify-center">
            {getFaviconUrl(bid.identity) ? (
              <Image 
                src={getFaviconUrl(bid.identity)!} 
                alt={bid.identity}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                priority={true}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerText = avatarLetter(bid.identity);
                  }
                }}
                unoptimized
              />
            ) : (
              <span className="font-bold text-2xl text-gray-400">{avatarLetter(bid.identity)}</span>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 z-20 pointer-events-none">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <a 
                href={href} 
                target="_blank" 
                onClick={handleTrack} className="truncate text-[20px] leading-[1.2] font-bold tracking-[-0.5px] text-gray-900 hover:underline sm:text-[24px] pointer-events-auto"
              >
                {bid.title || bid.identity.replace(/^https?:\/\//, '')}
              </a>
              <span className="flex-shrink-0 text-brand-500 mt-1" title="Verified AI Product">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </span>
            </div>
            <span className="shrink-0 text-[24px] sm:text-[28px] font-extrabold tabular-nums text-brand-500">
              {formatUSD(bid.amount)}
            </span>
          </div>
          
          {bid.description ? (
            <p className="line-clamp-2 text-[14px] leading-[1.4] font-medium tracking-[-0.2px] text-gray-500 sm:text-[15px]">
              {bid.description}
            </p>
          ) : (
            <p className="truncate text-[14px] leading-[1.4] font-medium tracking-[-0.2px] text-gray-500 sm:text-[15px]">
              {formatUrl(bid.identity)}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-3 mt-2 pointer-events-auto relative z-30">
            <span className="shrink-0 px-2.5 py-1 text-[13px] font-bold bg-brand-500/10 text-brand-600 rounded-md flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              {clicks} clicks
            </span>
            <time className="min-w-0 flex-1 truncate text-[13px] tracking-[-0.26px] text-gray-400 font-medium">
              {timeAgo(bid.updatedAt || bid.createdAt)}
            </time>
            
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              <BoostButton identity={bid.identity} currentAmount={bid.amount} />
              <button 
                className="shrink-0 tracking-[-0.5px] bg-[#F97316] text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 text-[14px] sm:text-[15px] rounded-full shadow-[0_4px_0_#C2410C] hover:bg-[#EA580C] active:translate-y-[4px] active:shadow-none transition-all"
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

          {rank === 1 && bid.leadMagnet && (
            <div className="mt-4 w-full relative z-30 pointer-events-auto">
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

  // The rest (Rank > 3)
  return (
    <article
      className={cn(
        "relative flex w-full cursor-pointer items-start gap-3 px-3.5 py-3 transition hover:bg-gray-50 sm:gap-4 sm:px-5 sm:py-[14px]",
        "border-b border-gray-100 last:border-b-0 bg-white",
        isTakeover && "bg-yellow-50/50"
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

      <div className="flex shrink-0 flex-col items-center gap-1 z-20">
        <span className="text-[13px] font-semibold text-gray-400 sm:text-[14px]">
          #{rank}
        </span>
        <div className="w-11 h-11 sm:w-11 sm:h-11 rounded-[10px] border border-black/5 bg-gray-50 overflow-hidden flex items-center justify-center">
          {getFaviconUrl(bid.identity) ? (
            <Image 
              src={getFaviconUrl(bid.identity)!} 
              alt={bid.identity}
              width={44}
              height={44}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerText = avatarLetter(bid.identity);
                }
              }}
              unoptimized
            />
          ) : (
            <span className="font-bold text-lg text-gray-400">{avatarLetter(bid.identity)}</span>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 z-20 pointer-events-none">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <a 
              href={href} 
              target="_blank" 
              onClick={handleTrack} className="truncate text-[16px] leading-[1.25] font-semibold tracking-[-0.4px] text-gray-900 hover:underline sm:text-[18px] pointer-events-auto"
            >
              {bid.title || bid.identity.replace(/^https?:\/\//, '')}
            </a>
            <span className="flex-shrink-0 flex items-center text-brand-500 mt-0.5" title="Verified AI Product">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </span>
          </div>
          <span className="shrink-0 text-[18px] sm:text-[22px] font-semibold tabular-nums text-brand-500">
            {formatUSD(bid.amount)}
          </span>
        </div>
        
        {bid.description ? (
          <p className="truncate text-[13px] leading-[1.4] font-medium tracking-[-0.2px] text-gray-500 sm:text-[14px]">
            {bid.description}
          </p>
        ) : (
          <p className="truncate text-[13px] leading-[1.4] font-medium tracking-[-0.2px] text-gray-500 sm:text-[14px]">
            {formatUrl(bid.identity)}
          </p>
        )}
        
        <div className="flex items-center flex-wrap gap-2.5 mt-1 pointer-events-auto relative z-30">
          <span className="shrink-0 px-2 py-0.5 text-[12px] sm:text-[13px] font-semibold bg-brand-500/10 text-brand-600 rounded flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            {clicks} clicks
          </span>
          <time className="min-w-0 flex-1 truncate text-[12px] sm:text-[13px] tracking-[-0.26px] text-gray-400 font-medium">
            {timeAgo(bid.updatedAt || bid.createdAt)}
          </time>
          
          <div className="flex items-center gap-2">
            <BoostButton identity={bid.identity} currentAmount={bid.amount} />
            <button 
              className="shrink-0 tracking-[-0.5px] bg-orange-100 text-orange-600 font-semibold px-3 py-[5px] text-[13px] sm:px-[14px] sm:py-[6px] sm:text-[15px] rounded-full hover:bg-orange-200 transition-colors shadow-none"
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
      </div>
    </article>
  );
}
