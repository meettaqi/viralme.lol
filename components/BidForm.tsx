"use client";

import { useState, useEffect, useId } from "react";
import { cn } from "@/lib/utils";
import type { Bid } from "@/lib/db";

interface Props {
  bids: Bid[];
  defaultAmount?: number;
  topBid: number;
  takeoverCost: number;
  takeoverActive: boolean;
  takeoverEnabled?: boolean;
}

const MIN_BID = 2;
const STEP = 1;

export default function BidForm({
  bids,
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

  // Accurate projection: count how many bids are >= the current amount
  const projectedRank = bids.filter(b => b.amount >= amount).length + 1;
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
      <h1 className="text-[44px] sm:text-[56px] leading-[1.1] font-extrabold text-[#111827] tracking-tight mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
        <span>Claim <span className="text-brand-500">#{projectedRank}</span> for</span>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 bg-white border border-gray-100 shadow-sm p-1.5 sm:p-2 rounded-[24px]">
          <button 
            onClick={() => adjust(-STEP)}
            className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] rounded-[16px] bg-brand-500/10 text-brand-500 flex items-center justify-center hover:bg-brand-500/20 transition-colors text-[28px] sm:text-[36px] leading-none font-medium pb-1 shrink-0"
          >
            -
          </button>
          <div className="text-brand-500 tabular-nums flex items-center min-w-[2.5ch] justify-center px-1">
            <span className="text-[48px] sm:text-[56px] font-extrabold tracking-tight leading-none">
              ${amount}
            </span>
          </div>
          <button 
            onClick={() => adjust(STEP)}
            className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] rounded-[16px] bg-brand-500/10 text-brand-500 flex items-center justify-center hover:bg-brand-500/20 transition-colors text-[28px] sm:text-[36px] leading-none font-medium pb-1 shrink-0"
          >
            +
          </button>
        </div>
      </h1>
      
      <p className="text-[20px] sm:text-[24px] font-bold text-gray-900 mb-6">
        for your AI product
      </p>

      <p className="text-[16px] sm:text-[18px] font-medium text-gray-500 leading-snug max-w-xl mx-auto mb-8">
        <strong className="text-brand-500 font-bold">Bids start at $2.</strong> Bid under the #1 price and you still land on the board - exactly where your amount ranks.
      </p>

      {/* Input Row Form */}
      <form
        onSubmit={handleBid}
        className="relative flex items-center w-full max-w-[500px] rounded-full bg-[#E5E7EB] p-2 pl-5 transition-colors focus-within:ring-2 focus-within:ring-brand-500/20 shadow-inner"
      >
        <svg className="w-[18px] h-[18px] text-gray-500 mr-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        
        <input
          id={`${formId}-identity`}
          type="text"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          placeholder="Your AI product URL or @handle"
          className="flex-1 bg-transparent border-none text-gray-800 text-[15px] sm:text-[16px] font-medium focus:outline-none focus:ring-0 placeholder:text-gray-500"
          required
        />
        
        <button
          type="submit"
          disabled={loading || !isVerifiedAi}
          className="ml-2 rounded-full bg-brand-500 hover:bg-brand-600 px-6 py-3 text-[15px] font-bold text-white transition-all disabled:opacity-50 whitespace-nowrap shadow-md shadow-brand-500/30"
        >
          {loading ? "Loading..." : "Claim #1"}
        </button>
      </form>
      
      {/* Optional Metadata Inputs */}
      {identity.trim().length > 3 && (
        <div className="flex flex-col gap-3 w-full max-w-[500px] mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short Title (optional, we'll fetch it if left blank)"
            className="w-full bg-[#E5E7EB] border-none rounded-2xl px-5 py-3.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 placeholder:text-gray-500 text-gray-800 shadow-inner"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short Description (optional, we'll fetch it if left blank)"
            className="w-full bg-[#E5E7EB] border-none rounded-2xl px-5 py-3.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 placeholder:text-gray-500 text-gray-800 shadow-inner"
          />
        </div>
      )}

      {/* Bottom Subtext */}
      <p className="text-[13px] text-gray-500 font-medium mt-4 mb-6">
        Already listed? Drop in the same URL or @handle to push your bid
      </p>

      {/* Strict AI Checkbox Deterrent */}
      {identity.trim().length > 0 && (
        <div className="flex items-start gap-3 max-w-[500px] w-full mx-auto text-left mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-top-2 duration-300">
          <input 
            type="checkbox" 
            id={`${formId}-verify`}
            checked={isVerifiedAi}
            onChange={(e) => setIsVerifiedAi(e.target.checked)}
            className="mt-1 shrink-0 accent-brand-500 w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor={`${formId}-verify`} className="text-[13px] text-gray-600 cursor-pointer">
            <strong className="text-gray-900 block mb-1 text-[14px]">I confirm this is an AI Agent or Product.</strong>
            Non-AI submissions will be permanently deleted without a refund.
          </label>
        </div>
      )}

      {error && <p className="text-[13px] font-medium text-red-600 bg-red-50 py-3 px-4 rounded-xl border border-red-100 max-w-[500px] w-full">{error}</p>}

      {takeoverEnabled && (
        <button
          type="button"
          disabled={takingOver || takeoverActive || !identity.trim() || !isVerifiedAi}
          onClick={handleTakeover}
          className={cn(
            "shrink-0 font-bold px-6 py-3 text-[14px] sm:text-[15px] rounded-full transition-all mt-2",
            takeoverActive || (!identity.trim() || !isVerifiedAi)
              ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              : "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_0_#991B1B] active:translate-y-[4px] active:shadow-none"
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
