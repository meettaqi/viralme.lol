"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";

export default function AffiliatesPage() {
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);

  const extractUsername = (input: string) => {
    if (!input) return "";
    // If it's a full link like https://whop.com/e/trk_.../username, extract the last part
    if (input.includes("/")) {
      const parts = input.split("/");
      const last = parts[parts.length - 1];
      if (last.includes("?")) {
        return last.split("?")[0];
      }
      return last;
    }
    return input;
  };

  const username = extractUsername(inputValue);
  const nicerLink = `https://viralme.lol/?ref=${username || "yourname"}`;

  const copyToClipboard = () => {
    if (username) {
      navigator.clipboard.writeText(`https://viralme.lol/?ref=${username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] text-[#1a2b3c] font-sans pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <Header />
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* Step 1 (Inferred from context) */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-16">
          <div className="w-[30px] h-[30px] rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-semibold shrink-0  text-sm mt-0.5">
            1
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#111827] mb-2 tracking-tight">Join the program on Whop</h2>
            <p className="text-[#4b5563] mb-4 text-[17px] tracking-tight">Click below to join our affiliate program on Whop. You get 50% on every sale.</p>
            <a 
              href="https://whop.com/viralme-lol/affiliates" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-[#111827] text-white px-5 py-2.5 rounded-lg font-medium inline-block hover:bg-gray-800 transition-colors "
            >
              Open the Viralme.lol Program
            </a>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-5 mb-16">
          <div className="w-[30px] h-[30px] rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-semibold shrink-0  text-sm mt-0.5">
            2
          </div>
          <div className="w-full">
            <h2 className="text-[20px] font-bold text-[#111827] mb-3 tracking-tight">Copy your External link and promote it</h2>
            <p className="text-[#4b5563] mb-5 text-[17px] tracking-tight">
              Under <strong className="text-[#111827] font-semibold">Your affiliate links</strong>, copy the <span className="text-[#a05a41] bg-[#42261f] bg-opacity-10 px-1.5 py-0.5 rounded text-[13px] font-semibold border border-[#a05a41] border-opacity-20">External</span> row - <strong className="text-[#111827] font-semibold">ViralMe.lol board</strong>. On a phone, swipe the table sideways to reach the copy button.
            </p>
            
            {/* Real Whop Affiliate Image */}
            <div className="rounded-[16px] overflow-hidden shadow-xl mb-4 border border-gray-800">
              <img 
                src="/whop-affiliate-links.png" 
                alt="Your affiliate links on Whop" 
                className="w-full h-auto block"
              />
            </div>
            <p className="text-[13px] text-[#6b7280] tracking-tight">Tap to open your real links. Copy the <strong className="text-[#374151] font-semibold">Company</strong> row (<strong className="text-[#374151] font-semibold">Viralme.lol</strong>) to share and earn 50% commissions.</p>
          </div>
        </div>

        {/* Make it a nicer link */}
        <div className="mb-16 ml-12">
          <h2 className="text-[20px] font-bold text-[#111827] mb-2.5 tracking-tight">Make it a nicer link</h2>
          <p className="text-[17px] text-[#4b5563] mb-6 tracking-tight">
            Paste it here - or just type your Whop username - for a shorter one on our domain. Same tracking, same 50%.
          </p>
          
          <div className="bg-[#F5F5F5] rounded-[24px] p-6 sm:p-7  border border-transparent">
            <h3 className="font-semibold text-[#111827] mb-1 text-[15px] tracking-tight">Paste your Whop link</h3>
            <p className="text-[15px] text-[#6b7280] mb-5 tracking-tight">Or just type your Whop username - either works.</p>
            
            <input 
              type="text" 
              placeholder="https://whop.com/viralme?a=yourname"
              className="w-full bg-[#E1E1E1] border-transparent rounded-[16px] px-5 py-3 text-[#111827] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            
            {inputValue && (
              <div className="mt-5 p-4 sm:p-5 bg-white rounded-[16px] border border-gray-200  animate-in fade-in">
                <p className="text-sm font-semibold text-[#111827] mb-3">Your nicer link:</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-grow">
                    <input 
                      readOnly
                      value={nicerLink}
                      className="w-full bg-[#F5F5F5] border border-gray-200 rounded-xl px-4 py-3 text-[#111827] font-mono text-[14px]"
                    />
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="bg-[#111827] hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors  flex items-center justify-center gap-2 shrink-0"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Worth knowing */}
        <div className="mb-24 ml-12">
          <h2 className="text-[20px] font-bold text-[#111827] mb-6 tracking-tight">Worth knowing</h2>
          
          <ul className="space-y-4 text-[#4b5563] text-[17px] tracking-tight">
            <li className="flex items-start">
              <span className="text-[#2778F5] mr-2 mt-0.5 text-[24px] leading-none">•</span>
              <span>No ceiling on a referral - people raise their bid to hold #1, and you earn on every raise.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#2778F5] mr-2 mt-0.5 text-[24px] leading-none">•</span>
              <span>A click sticks for <strong className="font-semibold text-[#111827]">90 days</strong>, and refunds are reversed.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#2778F5] mr-2 mt-0.5 text-[24px] leading-none">•</span>
              <span>Clicks and earnings live in your <a href="https://whop.com/viralme-lol/affiliates" target="_blank" rel="noreferrer" className="text-[#2778F5] hover:underline font-medium">Whop dashboard</a>. Those are the numbers that pay.</span>
            </li>
          </ul>
          
          <p className="mt-12 text-[15px] text-[#6b7280] tracking-tight">
            Questions? Read the <Link href="/rules" className="text-[#2778F5] hover:underline">rules</Link>.
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-[14px] text-[#6b7280] mt-10 pt-10 pb-8 tracking-tight">
          <p className="mb-4 sm:mb-0">Pay-to-rank AI product directory. Your bid is your rank.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link href="/rules" className="hover:text-[#374151]">Rules</Link>
            <Link href="/" className="hover:text-[#374151]">Live stats</Link>
            <Link href="/affiliates" className="hover:text-[#374151]">Affiliates</Link>
            <span>Payments by Whop</span>
          </div>
        </div>
      </div>
    </div>
  );
}
