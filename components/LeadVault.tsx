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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 relative group">
      {!unlocked ? (
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex-1 w-full text-left">
            <div className="flex items-center gap-1.5 text-orange-600 font-bold text-[11px] uppercase tracking-wider mb-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              #1 Exclusive Offer
            </div>
            <p className="text-gray-900 font-semibold text-[13px]">{leadMagnet.offer}</p>
          </div>
          
          <form onSubmit={handleUnlock} className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              required
              placeholder="Enter email to unlock"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[34px] rounded-full border border-gray-200 bg-white px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/40 flex-1 sm:w-48 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 tracking-[-0.5px] font-semibold px-4 h-[34px] text-[13px] rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors shadow-none disabled:opacity-50"
            >
              {loading ? "..." : "Unlock"}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-green-600 font-bold text-[13px] mb-2 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Offer Unlocked!
          </div>
          <div className="bg-white border border-gray-200 rounded-md px-3 py-1.5 font-mono text-gray-900 text-[13px] font-bold select-all">
            {leadMagnet.secret}
          </div>
        </div>
      )}
    </div>
  );
}
