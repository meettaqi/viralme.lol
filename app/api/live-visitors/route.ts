import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = process.env.DATAFAST_ACCESS_TOKEN || "dft_aac92aa3f417d2434908f066eb6c44645a6628c35d20f723";
    const url = token.startsWith("df_") 
      ? "https://datafa.st/api/v1/analytics/realtime"
      : "https://datafa.st/api/v1/analytics/realtime?websiteId=6a88058f18a92e2689e02ab1";
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "Unknown error");
      return NextResponse.json({ visitors: null, error: err, status: res.status });
    }
    const data = await res.json();
    return NextResponse.json({ visitors: data?.data?.[0]?.visitors || 0 });
  } catch (e: any) {
    return NextResponse.json({ visitors: null, error: e.message });
  }
}
