import { NextResponse } from "next/server";
import { incrementTotalVisitors, getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const totalVisitors = await incrementTotalVisitors();
    return NextResponse.json({ totalVisitors });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({ totalVisitors: stats.totalVisitors });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
