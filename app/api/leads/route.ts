import { NextResponse } from "next/server";
import { saveLead } from "@/lib/leads";

export async function POST(req: Request) {
  try {
    const { identity, email } = await req.json();
    if (!identity || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    saveLead(identity, email);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
