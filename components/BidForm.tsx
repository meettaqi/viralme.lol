"use client";

import { useState, useEffect, useId } from "react";
import { cn } from "@/lib/utils";

interface Props {
  defaultAmount?: number;
  topBid: number;
  takeoverCost: number;
  takeoverActive: boolean;
  takeoverEnabled?: boolean;
}

const MIN_BID = 2;
const STEP = 1;

export default function BidForm({
  defaultAmount,
  topBid = 0,
  takeoverCost = 50,
  takeoverActive,
  takeoverEnabled = true,
}: Props) {
  const [identity, setIdentity] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(defaultAmount || Math.max(MIN_BID, topBid + 1));
  const [loading, setLoading] = useState(false);
  const [takingOver, setTakingOver] = useState(false);
  const [error, setError] = useState("");
  const [isVerifiedAi, setIsVerifiedAi] = useState(false);
  const formId = useId();

  // Very naive projection
  const projectedRank = amount > topBid ? 1 : amount > topBid * 0.5 ? 2 : 3;
  // Stub for existing bid difference logic
  const existingBid = 0;
  const charge = Math.max(MIN_BID, amount - existingBid);

  function adjust(delta: number) {
    setAmount((prev) => Math.max(MIN_BID, prev + delta));
  }

  function validateIdentity(val: string): string {
    if (!val.trim()) return "Please enter a URL or handle.";
    if (!isVerifiedAi) return "You must confirm this is an AI product.";
    const v = val.trim().toLowerCase();
    const blocked = ["t.me/", "discord.gg/", "wa.me/", "whatsapp", "messenger", "signal"];
    if (blocked.some((b) => v.includes(b))) return "Chat/invite links are not allowed.";
    const nsfw = ["porn", "xxx", "adult", "nsfw", "onlyfans"];
    if (nsfw.some((n) => v.includes(n))) return "NSFW/adult content is not allowed.";
    return "";
  }

  async function handleBid(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const err = validateIdentity(identity);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "bid", 
          identity: identity.trim(), 
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          amount,
          referredBy: localStorage.getItem("viralme_ref") || undefined 
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Something went wrong.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTakeover(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const err = validateIdentity(identity);
    if (err) { setError(err); return; }

    setTakingOver(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "takeover", 
          identity: identity.trim(),
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          referredBy: localStorage.getItem("viralme_ref") || undefined
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Something went wrong.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setTakingOver(false);
    }
  }

  return (
    <div className="flex flex-col items-center text-center w-full max-w-2xl mx-auto">
      {/* Huge Pricing Header */}
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-3 mb-4">
        Claim #{projectedRank} for 
        <button 
          onClick={() => adjust(-STEP)}
          className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center hover:bg-brand-500/20 transition-colors text-2xl leading-none font-medium"
        >-</button>
        <span className="text-brand-500 tabular-nums inline-flex overflow-hidden">
          $
          <span key={amount} className="animate-bloop inline-block">
            {amount}
          </span>
        </span>
        <button 
          onClick={() => adjust(STEP)}
          className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center hover:bg-brand-500/20 transition-colors text-2xl leading-none font-medium"
        >+</button>
      </h2>

      {/* Subtext */}
      <p className="text-sm text-muted-foreground text-balance mb-8">
        Your amount decides the rank. Paying less than the #1 price still puts you on the board at whatever place that bid can take.
      </p>

      {/* Input Row Form */}
      <form
        onSubmit={handleBid}
        className="relative flex items-center w-full rounded-full border border-border/60 bg-card p-1.5 pl-4 shadow-sm hover:border-brand-500/30 transition-colors focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/20"
      >
        {/* Globe Icon */}
        <svg className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        
        <input
          id={`${formId}-identity`}
          type="text"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          placeholder="Your AI product URL or @handle"
          className="flex-1 bg-transparent border-none text-foreground text-sm sm:text-base focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
          required
        />
        
        <button
          type="submit"
          disabled={loading || !isVerifiedAi}
          className="ml-2 rounded-full bg-brand-500 hover:bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
        >
          {loading ? "Loading..." : "Claim"}
        </button>
      </form>
      
      {/* Optional Metadata Inputs */}
      {identity.trim().length > 3 && (
        <div className="flex flex-col gap-3 w-full mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short Title (optional, we'll fetch it if left blank)"
            className="w-full bg-white border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 placeholder:text-muted-foreground"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short Description (optional, we'll fetch it if left blank)"
            className="w-full bg-white border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 placeholder:text-muted-foreground"
          />
        </div>
      )}

      {/* Strict AI Checkbox Deterrent */}
      <div className="mt-5 flex items-start gap-2 max-w-xl mx-auto text-left">
        <input 
          type="checkbox" 
          id={`${formId}-verify`}
          checked={isVerifiedAi}
          onChange={(e) => setIsVerifiedAi(e.target.checked)}
          className="mt-1 shrink-0 accent-brand-500 w-4 h-4 rounded border-border"
        />
        <label htmlFor={`${formId}-verify`} className="text-xs text-muted-foreground cursor-pointer">
          <strong className="text-foreground">I confirm this is an AI Agent or Product.</strong> Non-AI submissions will be permanently deleted without a refund.
        </label>
      </div>

      {error && <p className="text-xs font-medium text-red-400 bg-red-400/10 py-2 px-3 rounded-md border border-red-400/20 mt-4">{error}</p>}

      {/* Bottom Subtext */}
      <p className="text-xs text-muted-foreground mt-4 mb-6">
        Already on the list? Enter the same URL or @handle and up your bid to get back to the top.
      </p>

      {takeoverEnabled && (
        <button
          type="button"
          disabled={takingOver || takeoverActive || !identity.trim() || !isVerifiedAi}
          onClick={handleTakeover}
          className={cn(
            "shrink-0 tracking-[-0.5px] font-semibold px-4 py-2 text-[13px] sm:text-[14px] rounded-full transition-colors shadow-none",
            takeoverActive || (!identity.trim() || !isVerifiedAi)
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          )}
        >
          {takingOver
            ? "Redirecting…"
            : takeoverActive
            ? "Takeover Active"
            : `🔥 Hostile Takeover for $${takeoverCost.toLocaleString()}`}
        </button>
      )}
    </div>
  );
}
