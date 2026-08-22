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
        "shrink-0 tracking-[-0.5px] font-semibold px-3 py-[5px] text-[13px] sm:px-[14px] sm:py-[6px] sm:text-[15px] rounded-full transition-colors shadow-none",
        copied ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-blue-100 text-blue-600 hover:bg-blue-200"
      )}
      title="Share this link to earn a free + boost for every bid placed!"
    >
      {copied ? "Copied Link!" : "Earn +$"}
    </button>
  );
}