"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Bid } from "@/lib/db";

interface Props {
  bids: Bid[];
  liveVisitors: number | null;
}

export default function FomoTicker({ bids, liveVisitors }: Props) {
  const [events, setEvents] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Generate realistic events based on actual data
    const dynamicEvents: string[] = [];
    
    // Add visitor stat if high enough
    const visitors = liveVisitors || Math.floor(Math.random() * 20) + 5;
    if (visitors > 5) {
      dynamicEvents.push(`👀 ${visitors} people are viewing the board right now`);
    }

    // Add recent top bids
    const sorted = [...bids].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const topRecent = sorted.slice(0, 5);
    
    topRecent.forEach(bid => {
      const isTop3 = bid.amount >= (bids[2]?.amount || 0);
      const isHighVal = bid.amount > 50;
      
      const cleanName = bid.title || bid.identity.replace(/^https?:\/\//, '').replace(/^@/, '');
      const shortName = cleanName.length > 15 ? cleanName.slice(0, 15) + '...' : cleanName;

      if (isTop3) {
        dynamicEvents.push(`👑 ${shortName} just claimed a top spot with $${bid.amount}!`);
      } else if (isHighVal) {
        dynamicEvents.push(`🔥 Big move: $${bid.amount} paid by ${shortName}`);
      } else {
        dynamicEvents.push(`💸 New bid placed by ${shortName}`);
      }
    });

    if (dynamicEvents.length < 3) {
      dynamicEvents.push("🚀 The leaderboard is heating up!");
      dynamicEvents.push("⚡ Hostile Takeover is currently available");
    }

    // Randomize the order
    setEvents(dynamicEvents.sort(() => Math.random() - 0.5));
  }, [bids, liveVisitors]);

  useEffect(() => {
    if (events.length === 0) return;

    // Wait a bit before first toast
    const initialDelay = setTimeout(() => {
      setVisible(true);
    }, 3000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % events.length);
        setVisible(true);
      }, 500); // 500ms hide transition
    }, 10000); // cycle every 10s

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [events.length]);

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 pointer-events-none">
      <div
        className={cn(
          "bg-card border border-border/60 shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] rounded-full px-4 py-2 text-sm font-medium text-foreground transition-all duration-500 transform",
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        )}
      >
        {events[index]}
      </div>
    </div>
  );
}
