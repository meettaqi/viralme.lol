import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const leaderboard = await getLeaderboard();
    return NextResponse.json(leaderboard, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
      },
    });
  } catch (err) {
    console.error("[GET /api/bids]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
