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
    <header className="mt-4 sm:mt-4 mb-5 flex items-center justify-between w-full">
      {/* Left Logo */}
      <div className="flex justify-start items-center">
        <Link
          href="/"
          className="group inline-flex items-center hover:opacity-90 transition-opacity duration-300"
        >
          <img 
            src="/logo.png" 
            alt="Viralme.lol - Pay-to-Rank AI Product Directory" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Center (Live Visitors on desktop, hidden on mobile) */}
      <div className="hidden sm:flex justify-center flex-1">
        <LiveVisitors initialVisitors={liveVisitors ?? null} totalVisitors={totalVisitors} />
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
