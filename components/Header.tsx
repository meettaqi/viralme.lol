import Link from "next/link";
import LiveVisitors from "./LiveVisitors";

export default function Header({ 
  liveVisitors,
  totalVisitors 
}: { 
  liveVisitors?: number | null;
  totalVisitors?: number;
}) {
  return (
    <header className="mt-4 sm:mt-4 mb-5 grid grid-cols-2 sm:grid-cols-3 items-center w-full">
      {/* Left (Live Visitors on desktop, hidden on mobile) */}
      <LiveVisitors initialVisitors={liveVisitors ?? null} totalVisitors={totalVisitors} />

      {/* Center Logo */}
      <div className="flex justify-start sm:justify-center">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-bold tracking-tight text-2xl hover:opacity-90 transition-all duration-300"
        >
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inset-0 bg-brand-500/20 rounded-lg blur-sm group-hover:bg-brand-500/40 transition-colors" />
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-full h-full drop-shadow-sm">
              <path d="M8 8L20 32" stroke="url(#paint0_linear)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M32 8L20 32" stroke="url(#paint1_linear)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="8" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="hsl(0, 100%, 50%)" />
                  <stop offset="1" stopColor="hsl(0, 100%, 75%)" />
                </linearGradient>
                <linearGradient id="paint1_linear" x1="32" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="hsl(0, 100%, 65%)" />
                  <stop offset="1" stopColor="hsl(0, 100%, 85%)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-foreground">
            viralme<span className="text-brand-500">.</span>lol
          </span>
        </Link>
      </div>

      {/* Right Nav */}
      <nav className="flex items-center justify-end gap-3 sm:gap-4">
        <Link 
          href="/" 
          className="text-[13px] sm:text-sm font-bold bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 px-4 py-2 rounded-full transition-colors border border-brand-500/20"
        >
          Leaderboard
        </Link>
        <Link href="/rules" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          Rules
        </Link>
        <a href="https://x.com/viralmelol" target="_blank" rel="noopener noreferrer" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          𝕏 Twitter
        </a>
      </nav>
    </header>
  );
}
