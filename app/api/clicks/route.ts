import { NextRequest, NextResponse } from "next/server";
import { incrementClicks } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { identity } = (await req.json()) as { identity?: string };
    if (!identity) {
      return NextResponse.json({ error: "identity required" }, { status: 400 });
    }
    const clicks = await incrementClicks(identity);
    return NextResponse.json({ clicks });
  } catch (err) {
    console.error("[POST /api/clicks]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
