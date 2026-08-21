import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";
import { getLeaderboard, getTopBid } from "@/lib/db";
import { getTakeover } from "@/lib/takeover";
import { getSettings } from "@/lib/settings";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getLiveVisitors() {
  try {
    const res = await fetch("https://datafa.st/api/v1/analytics/realtime?websiteId=dfid_vXi6O2z6DLnvmkHjoQF26", {
      headers: {
        Authorization: `Bearer ${process.env.DATAFAST_ACCESS_TOKEN || "dft_019883c7f1aabe784c45c588b4721d14be06e7b77e2a7be0"}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0]?.visitors || 0;
  } catch {
    return null;
  }
}

export default async function Home() {
  const bids = await getLeaderboard();
  const topBid = await getTopBid();
  const takeover = await getTakeover();
  const settings = await getSettings();
  const liveVisitors = await getLiveVisitors();
  const takeoverCost = topBid > 0 ? topBid * settings.takeoverMultiplier : (settings.takeoverMultiplier * 10 || 50);

  return (
    <div className="relative min-h-screen selection:bg-brand-500/30 bg-background">
      <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-12 min-h-[calc(100vh-100px)]">
        <Header liveVisitors={liveVisitors} />
        <HomeClient
          initialBids={bids}
          initialTakeover={takeover}
          topBid={topBid}
          takeoverCost={takeoverCost}
          takeoverEnabled={settings.takeoverEnabled}
          liveVisitors={liveVisitors}
        />
      </main>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-md py-10 mt-12">
        <div className="mx-auto w-full max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            viralme<span className="text-brand-500">.</span>lol
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <Link href="/rules" className="hover:text-brand-400 transition-colors">
              Rules & Guidelines
            </Link>
            <a href="https://x.com/viralmelol" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition-colors">
              Twitter / 𝕏
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground/60">
            © {new Date().getFullYear()} viralme.lol. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
