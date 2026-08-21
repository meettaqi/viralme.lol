"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ReferralButton({ identity }: { identity: string }) {
  const [copied, setCopied] = useState(false);

  function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof window === "undefined") return;
    
    const url = window.location.origin + "/?ref=" + encodeURIComponent(identity);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      alert("Failed to copy link. Please manually copy: " + url);
    });
  }

  return (
    <button
      onClick={handleShare}
      className={cn(
        "flex items-center gap-1 rounded px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap",
        copied ? "bg-green-500 hover:bg-green-600 text-white" : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/30 shadow-sm"
      )}
      title="Share this link to earn a free + boost for every bid placed!"
    >
      {copied ? "Copied Link!" : "Earn +"}
    </button>
  );
}