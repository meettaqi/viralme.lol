import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Affiliates - Viralme.lol",
  description: "Become a partner affiliate for Viralme.lol and earn 50% lifetime recurring commissions.",
};

export default function AffiliatesPage() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center text-center px-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-16 h-16 bg-brand-500/10 text-brand-500 flex items-center justify-center rounded-2xl mb-6 shadow-sm border border-brand-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
          <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
        </svg>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
        Partner Affiliates
      </h1>
      
      <p className="text-lg text-muted-foreground font-medium mb-8 max-w-lg leading-relaxed">
        Earn <strong className="text-brand-500 font-bold">50% commission</strong> on every single purchase made by users you refer. Payments are processed automatically via Whop.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <a 
          href="https://whop.com/" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-brand-500 text-white hover:brightness-110 font-bold text-lg px-8 py-4 rounded-full shadow-[inset_0_2px_0_rgba(255,255,255,0.3),_0_4px_0_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-[inset_0_2px_0_rgba(255,255,255,0.1),_0_0px_0_rgba(0,0,0,0.2)] transition-all"
        >
          <span>Become an Affiliate</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
        
        <Link 
          href="/" 
          className="flex items-center justify-center font-bold text-[15px] sm:text-[17px] text-muted-foreground hover:text-foreground hover:bg-gray-100 px-8 py-4 rounded-full transition-colors"
        >
          Back to Home
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full max-w-3xl">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="text-brand-500 font-bold text-xl mb-2">50%</div>
          <div className="text-sm font-semibold text-gray-900 mb-1">High Commission</div>
          <div className="text-sm text-gray-500">Get half of every payment for life.</div>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="text-brand-500 font-bold text-xl mb-2">90 Days</div>
          <div className="text-sm font-semibold text-gray-900 mb-1">Cookie Duration</div>
          <div className="text-sm text-gray-500">Long-lasting tracking for your referrals.</div>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="text-brand-500 font-bold text-xl mb-2">Instant</div>
          <div className="text-sm font-semibold text-gray-900 mb-1">Payouts</div>
          <div className="text-sm text-gray-500">Powered and guaranteed by Whop.</div>
        </div>
      </div>
    </div>
  );
}
