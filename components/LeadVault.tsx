"use client";

import { useState } from "react";
import type { LeadMagnet } from "@/lib/db";

interface Props {
  identity: string;
  leadMagnet: LeadMagnet;
}

export default function LeadVault({ identity, leadMagnet }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, email }),
      });
      if (res.ok) {
        setUnlocked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-brand-500/30 bg-brand-500/5 relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500/0 via-brand-500 to-brand-500/0 opacity-50" />
      
      {!unlocked ? (
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 text-brand-500 font-bold text-sm mb-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              #1 Exclusive Offer
            </div>
            <p className="text-foreground font-semibold">{leadMagnet.offer}</p>
          </div>
          
          <form onSubmit={handleUnlock} className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              required
              placeholder="Enter email to unlock"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 flex-1 sm:w-48"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 rounded-lg bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "..." : "Unlock"}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 sm:p-5 flex flex-col items-center justify-center text-center">
          <div className="text-green-500 font-bold mb-2 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Offer Unlocked!
          </div>
          <div className="bg-background border border-border rounded-lg px-4 py-2 font-mono text-foreground font-bold select-all">
            {leadMagnet.secret}
          </div>
        </div>
      )}
    </div>
  );
}
