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
        body: JSON.stringify({ type: "boost", identity, amount }),
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
        className="flex items-center gap-1 rounded-lg bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 text-xs font-semibold text-brand-300 hover:bg-brand-500/20 hover:border-brand-500/40 transition-colors"
        title="Boost this listing"
      >
        <span className="text-[10px]">⚡</span> Boost
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-1 bg-card border border-border/60 rounded-lg p-1 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-wider">Boost:</span>
      {BOOST_OPTIONS.map((amt) => (
        <button
          key={amt}
          disabled={loading !== null}
          onClick={() => handleBoost(amt)}
          className="rounded-md bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 text-xs font-bold text-brand-400 hover:bg-brand-500 hover:text-white transition-colors disabled:opacity-50"
        >
          {loading === amt ? "…" : `+$${amt}`}
        </button>
      ))}
      <button
        onClick={() => setOpen(false)}
        className="ml-0.5 p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
