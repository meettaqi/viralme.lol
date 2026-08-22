"use client";

import { useState } from "react";

interface Props {
  identity: string;
  currentAmount: number;
}

const BOOST_OPTIONS = [1, 2, 3, 5];

export default function BoostButton({ identity, currentAmount }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<number | null>(null);

  async function handleBoost(amount: number) {
    setLoading(amount);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "boost", 
          identity, 
          amount,
          referredBy: localStorage.getItem("viralme_ref") || undefined
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  if (!open) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="shrink-0 tracking-[-0.5px] font-semibold px-3 py-[5px] text-[13px] sm:px-[14px] sm:py-[6px] sm:text-[15px] rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors shadow-none"
        title="Boost this listing"
      >
        <span className="text-[11px] mr-1">⚡</span> Boost
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Boost:</span>
      {BOOST_OPTIONS.map((amt) => (
        <button
          key={amt}
          disabled={loading !== null}
          onClick={() => handleBoost(amt)}
          className="rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-[12px] font-semibold hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {loading === amt ? "…" : `+$${amt}`}
        </button>
      ))}
      <button
        onClick={() => setOpen(false)}
        className="ml-1 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
