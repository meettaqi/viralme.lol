import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = process.env.DATAFAST_ACCESS_TOKEN || "dft_019883c7f1aabe784c45c588b4721d14be06e7b77e2a7be0";
    const url = token.startsWith("df_") 
      ? "https://datafa.st/api/v1/analytics/realtime"
      : "https://datafa.st/api/v1/analytics/realtime?websiteId=dfid_vXi6O2z6DLnvmkHjoQF26";
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ visitors: null });
    const data = await res.json();
    return NextResponse.json({ visitors: data?.data?.[0]?.visitors || 0 });
  } catch {
    return NextResponse.json({ visitors: null });
  }
}
