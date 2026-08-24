import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Affiliates - ViralMe.lol",
  description: "Become a partner affiliate for ViralMe.lol and earn 50% lifetime recurring commissions.",
};

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ViralMe.lol" className="h-8 w-auto object-contain" />
            <span className="sr-only">
              Viral<span className="text-[brand-500]">Me</span>.lol
            </span>
          </Link>
          <Link 
            href="/" 
            className="text-sm font-semibold text-gray-500 hover:text-black transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-white py-24 px-6 text-center border-b border-gray-200 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 pointer-events-none" 
               style={{ background: 'radial-gradient(ellipse at top, var(--brand-500) 0%, transparent 70%)' }}></div>
          
          <div className="max-w-3xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-bold text-[brand-500] bg-[brand-500]/10 rounded-full border border-[brand-500]/20">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
              High-Converting Partner Program
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Earn <span className="text-[brand-500]">50%</span> from<br/>every referral.
            </h1>
            <p className="text-xl sm:text-2xl text-gray-500 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              Partner with ViralMe.lol and get half of every payment for life. Payouts are handled automatically via Whop.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://whop.com/checkout/prod_Zq065SmwLUowB?a=affiliate" // Replace with actual affiliate signup link
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[brand-500] text-white hover:brightness-110 font-bold text-xl px-10 py-5 rounded-full shadow-[0_8px_30px_rgb(244,29,26,0.3)] hover:shadow-[0_8px_30px_rgb(244,29,26,0.4)] active:scale-95 transition-all w-full sm:w-auto"
              >
                <span>Become an Affiliate</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[brand-500]/10 text-[brand-500] rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">50% Commission</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  You get 50% of the revenue for every single Bid, Boost, or Takeover purchased by your referrals. No limits.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[brand-500]/10 text-[brand-500] rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">90-Day Cookie</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  We use generous 90-day cookies. If they visit today and buy a top spot next month, you still get paid.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[brand-500]/10 text-[brand-500] rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Payouts</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  No more waiting for net-30 manual payments. Everything is securely tracked and paid out by Whop automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">How it works</h2>
            <p className="text-xl text-gray-500 font-medium">Getting started takes less than two minutes.</p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-gray-100 -z-10"></div>
            
            <div className="text-center relative bg-white">
              <div className="w-24 h-24 bg-gray-50 border-4 border-white rounded-full flex items-center justify-center text-3xl font-extrabold text-gray-300 mx-auto mb-6 shadow-sm">1</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Join the Program</h3>
              <p className="text-gray-500 font-medium px-4">Click the button below to join our Whop affiliate program instantly.</p>
            </div>
            
            <div className="text-center relative bg-white">
              <div className="w-24 h-24 bg-gray-50 border-4 border-white rounded-full flex items-center justify-center text-3xl font-extrabold text-gray-300 mx-auto mb-6 shadow-sm">2</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Share your Link</h3>
              <p className="text-gray-500 font-medium px-4">Share your unique affiliate link with developers, founders, and marketers.</p>
            </div>
            
            <div className="text-center relative bg-white">
              <div className="w-24 h-24 bg-gray-50 border-4 border-white rounded-full flex items-center justify-center text-3xl font-extrabold text-[brand-500] mx-auto mb-6 shadow-sm bg-[brand-500]/5">3</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Earn Cash</h3>
              <p className="text-gray-500 font-medium px-4">Watch your Whop dashboard as you earn 50% commission on every sale.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-gray-900 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8">Ready to start earning?</h2>
            <a 
              href="https://whop.com/checkout/prod_Zq065SmwLUowB?a=affiliate" // Replace with actual affiliate signup link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[brand-500] text-white hover:brightness-110 font-bold text-xl px-12 py-5 rounded-full shadow-[0_8px_30px_rgb(244,29,26,0.3)] transition-all active:scale-95"
            >
              Get Your Affiliate Link Now
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 px-6 text-center">
        <p className="text-gray-400 font-medium text-sm">
          © {new Date().getFullYear()} ViralMe.lol. All rights reserved. Payments processing by Whop.
        </p>
      </footer>
    </div>
  );
}
