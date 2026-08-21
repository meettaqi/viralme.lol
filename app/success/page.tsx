import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      {/* Check icon */}
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
        <svg viewBox="0 0 24 24" fill="none" className="size-10 text-primary" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        You&apos;re on the board! 🎉
      </h1>
      <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty max-w-sm">
        Your payment is confirmed. Your listing appears on the leaderboard within
        seconds as we fetch your site&apos;s details.
      </p>

      {/* Tips */}
      <div className="mt-8 rounded-2xl border bg-muted/40 px-6 py-5 text-left w-full">
        <p className="text-sm font-semibold text-foreground mb-2">
          Stay at #1 — here&apos;s how 👇
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>⚡ <strong className="text-foreground">Tell your community</strong> — they can boost your listing for $1–$5, raising your bid without costing you anything</li>
          <li>🔥 <strong className="text-foreground">Trigger a Takeover</strong> — pay 5× the current #1 to lock the top spot for 3 hours and go viral</li>
          <li>📣 <strong className="text-foreground">Share on X</strong> — every visitor is a potential bidder or booster</li>
          <li>👑 <strong className="text-foreground">Hold #1 for 24h</strong> — earn a permanent Hall of Fame badge</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
        <a
          href="/"
          className="flex-1 inline-flex items-center justify-center rounded-full bg-primary px-6 h-11 text-sm font-bold text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          See the leaderboard →
        </a>
        <a
          href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent("I just claimed a top spot on viralme.lol 🔥 \n\nWill anyone outbid me? 👀 https://viralme.lol")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 h-11 text-sm font-bold text-foreground hover:bg-muted/50 transition-colors"
        >
          <span>𝕏</span> Share on X
        </a>
      </div>

      <Link
        href="/rules"
        className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Read the rules
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
