import { NextResponse } from "next/server";
import { getTakeover } from "@/lib/takeover";
import { getTopBid } from "@/lib/db";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const takeover = getTakeover();
  const topBid = getTopBid();
  const settings = getSettings();
  const takeoverCost = topBid > 0 ? topBid * settings.takeoverMultiplier : (settings.takeoverMultiplier * 10 || 50);

  return NextResponse.json(
    {
      takeover,
      topBid,
      takeoverCost,
      takeoverActive: takeover.active,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
      },
    }
  );
}
