import Link from "next/link";
import Header from "@/components/Header";

export const metadata = {
  title: "Rules · viralme.lol",
  description: "How viralme.lol works: pay to rank, boost listings, trigger a takeover, and earn a Hall of Fame badge.",
};

export default function RulesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-4 sm:pt-8 pb-20">
      <Header />

      <article className="flex flex-col gap-10 mt-6 sm:mt-10">
        <section>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">Rules</h1>
          <p className="text-lg leading-relaxed text-muted-foreground font-medium">
            viralme.lol is a public pay-to-rank leaderboard. No ads, no algorithms, no revenue share.
            Your bid is your rank — nothing else decides it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">How ranking works</h2>
          <ul className="space-y-3 pl-1 leading-relaxed text-muted-foreground font-medium">
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>Bids are whole US dollars, <strong className="text-foreground">$2 minimum</strong>, $1 at a time.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>Paying less than #1 still earns you a rank at whatever position that bid can take. Equal bids stay in order placed — the older bid keeps the higher rank.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span><strong className="text-foreground">Re-bid the same URL or handle to reclaim #1.</strong> The new bid must be at least $1 above the current top. You only pay the difference — not the full new amount.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>App Store, Play Store, GitHub, and similar platform links are keyed by their path — different apps don&apos;t share a bid. Tracking query strings are stripped.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span><strong className="text-foreground">Hostile Takeover:</strong> Pay 5× the current #1 (minimum $50) to lock your listing in the top spot for 3 hours. A live countdown is shown on your entry. Only one takeover can be active at a time.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Boosting</h2>
          <ul className="space-y-3 pl-1 leading-relaxed text-muted-foreground font-medium">
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span><strong className="text-foreground">Any visitor can boost any listing</strong> for $1–$5. The boost is added to that listing&apos;s effective bid, making it harder to outbid.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>Boosters support their favourite product without taking ownership of the listing.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>Total boost contributions are displayed clearly on each entry.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Hall of Fame</h2>
          <ul className="space-y-3 pl-1 leading-relaxed text-muted-foreground font-medium">
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>Any listing that holds the <strong className="text-foreground">#1 spot for 24 consecutive hours</strong> earns a permanent <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-sm bg-yellow-500/10 text-yellow-600 font-bold uppercase tracking-wider mx-1">👑 HoF</span> badge.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>The badge stays even if they are later outbid — it&apos;s a lifetime achievement.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">The ViralMe Creator Fund</h2>
          <ul className="space-y-3 pl-1 leading-relaxed text-muted-foreground font-medium">
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span><strong className="text-foreground">Every 24 hours</strong>, the total amount spent on the #1 position is recorded.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span><strong className="text-foreground">30% of that amount</strong> goes into a community creator fund.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>This pool rewards independent creators who make entertaining videos and content about the ViralMe leaderboard game.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>Creators earn from the pool based on verified views and community engagement.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>This creates a self-sustaining social ecosystem: players compete on the leaderboard → the prize pool grows → creators are rewarded for making content → the game grows.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">What you can list</h2>
          <ul className="space-y-3 pl-1 leading-relaxed text-muted-foreground font-medium">
            <li className="flex gap-3"><span className="text-green-500 font-bold">✓</span> <span>A <strong className="text-foreground">product website</strong></span></li>
            <li className="flex gap-3"><span className="text-green-500 font-bold">✓</span> <span>An <strong className="text-foreground">App Store or Play Store link</strong></span></li>
            <li className="flex gap-3"><span className="text-green-500 font-bold">✓</span> <span>An <strong className="text-foreground">X / Twitter @handle</strong></span></li>
            <li className="flex gap-3"><span className="text-green-500 font-bold">✓</span> <span>A <strong className="text-foreground">GitHub profile or repository</strong> (github.com/...)</span></li>
            <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> <span>Chat and invite links — Telegram, WhatsApp, Discord, Messenger, Signal, etc.</span></li>
            <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> <span>Sexual or adult content of any kind.</span></li>
            <li className="flex gap-3"><span className="text-red-500 font-bold">✕</span> <span>Affiliate, referral, or tracking query parameters — these are automatically stripped.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">After you pay</h2>
          <ul className="space-y-3 pl-1 leading-relaxed text-muted-foreground font-medium">
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>Your listing is live and public immediately after payment confirms.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>Clicks go directly to your URL or profile — no redirects, no tracking parameters.</span></li>
            <li className="flex gap-3"><span className="text-brand-500 font-bold">—</span> <span>A completed payment is what claims the rank. Unpaid sessions do not hold any position.</span></li>
          </ul>
        </section>
      </article>

      <footer className="mt-20 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 px-6 py-3 rounded-full transition-colors shadow-sm">
          ← Back to leaderboard
        </Link>
      </footer>
    </main>
  );
}
