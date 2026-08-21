"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const FAKE_EVENTS = [
  "🔥 @alex just claimed #3",
  "👀 14 people are viewing the board right now",
  "💸 A new bid of  was just placed",
  "👑 The #1 spot is highly contested today",
  "🚀 viralme.lol is trending on Twitter",
];

export default function FomoTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Wait a bit before first toast
    const initialDelay = setTimeout(() => {
      setVisible(true);
    }, 2000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % FAKE_EVENTS.length);
        setVisible(true);
      }, 500); // 500ms hide transition
    }, 8000); // cycle every 8s

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

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
        {FAKE_EVENTS[index]}
      </div>
    </div>
  );
}
