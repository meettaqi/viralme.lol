"use client";

import { useEffect, useState, useCallback } from "react";
import type { Bid } from "@/lib/db";
import type { TakeoverState } from "@/lib/takeover";
import LeaderboardEntry from "./LeaderboardEntry";
import TakeoverBanner from "./TakeoverBanner";
import ShareCTA from "./ShareCTA";
import LiveDot from "./LiveDot";

interface Props {
  initialBids: Bid[];
  initialTakeover: TakeoverState;
  onClaimClick?: (amount: number) => void;
}

export default function Leaderboard({ initialBids, initialTakeover, onClaimClick }: Props) {
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [takeover, setTakeover] = useState<TakeoverState>(initialTakeover);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [bidsRes, takeoverRes] = await Promise.all([
        fetch("/api/bids"),
        fetch("/api/takeover"),
      ]);
      const bidsData = await bidsRes.json();
      const takeoverData = await takeoverRes.json();
      setBids(bidsData);
      setTakeover(takeoverData.takeover);
      setLastRefresh(new Date());
    } catch {
      // silent
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 30s auto-refresh
  useEffect(() => {
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  // Seconds-ago counter
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastRefresh.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [lastRefresh]);

  // Sort: takeover entry pinned to top during active takeover
  const sorted = [...bids].sort((a, b) => {
    if (takeover.active) {
      if (a.identity === takeover.identity) return -1;
      if (b.identity === takeover.identity) return 1;
    }
    return b.amount - a.amount || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const totalVolume = bids.reduce((acc, bid) => acc + bid.amount, 0);
  const totalClicks = bids.reduce((acc, bid) => acc + (bid.clicks || 0), 0);

  return (
    <section className="flex flex-col">
      {/* Takeover banner */}
      {takeover.active && <TakeoverBanner takeover={takeover} />}

      {/* Header row */}
      <div className="flex items-center justify-end w-full mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Refreshed {refreshing ? "just now" : `${secondsAgo} seconds ago`}</span>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-card hover:bg-muted font-semibold transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Entries */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 py-16 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <span className="text-xl">👻</span>
          </div>
          <h3 className="font-semibold text-foreground">It&apos;s quiet in here...</h3>
          <p className="text-muted-foreground text-sm mt-1">Be the first to claim #1.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((bid, i) => (
            <LeaderboardEntry
              key={bid.id}
              bid={bid}
              rank={i + 1}
              isTakeover={takeover.active && bid.identity === takeover.identity}
              onClaimClick={onClaimClick}
            />
          ))}
        </div>
      )}

      {/* Share CTA */}
      {bids.length > 0 && <ShareCTA />}
    </section>
  );
}
