import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://datafa.st/api/websites/dfid_vXi6O2z6DLnvmkHjoQF26/active", {
      headers: {
        Authorization: `Bearer ${process.env.DATAFAST_ACCESS_TOKEN || "dft_019883c7f1aabe784c45c588b4721d14be06e7b77e2a7be0"}`,
      },
      next: { revalidate: 10 }
    });
    if (!res.ok) return NextResponse.json({ visitors: null });
    const data = await res.json();
    return NextResponse.json({ visitors: data?.[0]?.x || data?.x || 0 });
  } catch {
    return NextResponse.json({ visitors: null });
  }
}
