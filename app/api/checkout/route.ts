import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utils";
import {
  upsertPendingBid,
  confirmPayment,
  updateOGData,
  applyBoost,
  getCurrentBid,
  getTopBid,
} from "@/lib/db";
import { fetchOG } from "@/lib/og";
import { activateTakeover, getTakeover } from "@/lib/takeover";
import { getSettings } from "@/lib/settings";
import { saveLeadMagnet } from "@/lib/leads";

const DEMO_MODE =
  !process.env.WHOP_API_KEY ||
  process.env.WHOP_API_KEY === "REPLACE_ME";

// ── Types ─────────────────────────────────────────────────────────────────────
type CheckoutType = "bid" | "boost" | "takeover";

interface RequestBody {
  type: CheckoutType;
  identity: string;
  amount?: number;
  referredBy?: string;
  vaultOffer?: string;
  vaultSecret?: string;
  title?: string;
  description?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function chargeForBid(identity: string, desiredAmount: number): Promise<number> {
  const existing = await getCurrentBid(identity);
  const charge = existing > 0 ? Math.max(1, desiredAmount - existing) : desiredAmount;
  return charge;
}

async function createWhopCheckout(charge: number, metadata: Record<string, string>, referredBy?: string) {
  const accountId = process.env.WHOP_COMPANY_ID || "biz_SIuMh5ziOk95R5";
  const productId = process.env.WHOP_PRODUCT_ID || "prod_Zq065SmwLUowB";
  const apiKey = process.env.WHOP_API_KEY;

  if (!apiKey) throw new Error("WHOP_API_KEY not configured");

  const res = await fetch("https://api.whop.com/v2/plans", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      account_id: accountId,
      product_id: productId,
      initial_price: charge,
      plan_type: "one_time",
      metadata: metadata,
      stock: 1, // Fixes Whop "sold out" error, allows exactly one purchase of this unique plan link
    })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[Whop API Error]", text);
    throw new Error(`Whop API returned ${res.status}`);
  }

  const data = await res.json();
  
  let link = data.direct_link;
  if (referredBy) {
    link += `?a=${referredBy}`;
  }
  
  return link;
}

// ── Demo mode handlers ────────────────────────────────────────────────────────
async function demoHandleBid(identity: string, amount: number, siteUrl: string, title?: string, description?: string) {
  const id = generateId();
  const sessionId = "whop_demo_" + id;
  await upsertPendingBid({
    identity,
    amount,
    baseAmount: amount,
    title: title || "",
    description: description || "",
    createdAt: new Date().toISOString(),
    paid: true,
    stripeSessionId: sessionId,
  });
  await confirmPayment(sessionId);
  fetchOG(identity)
    .then(async ({ title, description }) => await updateOGData(sessionId, title, description))
    .catch(() => {});
  return NextResponse.json({ url: `${siteUrl}/success?demo=1` });
}

async function demoHandleBoost(identity: string, boostAmount: number, siteUrl: string) {
  await applyBoost(identity, boostAmount);
  return NextResponse.json({ url: `${siteUrl}/success?demo=1&type=boost` });
}

async function demoHandleTakeover(identity: string, siteUrl: string) {
  const settings = await getSettings();
  if (!settings.takeoverEnabled) {
    return NextResponse.json({ error: "Hostile Takeovers are disabled by the administrator." }, { status: 403 });
  }
  const topBid = await getTopBid();
  const cost = topBid > 0 ? topBid * settings.takeoverMultiplier : (settings.takeoverMultiplier * 10 || 50);
  await activateTakeover(identity, identity, cost);
  return NextResponse.json({ url: `${siteUrl}/success?demo=1&type=takeover` });
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { type = "bid", identity, amount, referredBy, vaultOffer, vaultSecret, title, description } = body;

    if (!identity) {
      return NextResponse.json({ error: "identity required" }, { status: 400 });
    }
    
    const parsedAmount = parseInt(String(amount ?? "1"), 10);

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

    // ── DEMO MODE ────────────────────────────────────────────────────────────
    if (DEMO_MODE) {
      if (vaultOffer && vaultSecret) saveLeadMagnet(identity, vaultOffer, vaultSecret);
      if (type === "boost") {
        const boostAmt = Math.min(5, Math.max(1, isNaN(parsedAmount) ? 1 : parsedAmount));
        return await demoHandleBoost(identity, boostAmt, siteUrl);
      }
      if (type === "takeover") return await demoHandleTakeover(identity, siteUrl);
      return await demoHandleBid(identity, isNaN(parsedAmount) ? 1 : parsedAmount, siteUrl, title, description);
    }

    // ── LIVE MODE ────────────────────────────────────────────────────────────

    if (type === "boost") {
      const boostAmt = Math.min(5, Math.max(1, isNaN(parsedAmount) ? 1 : parsedAmount));
      const id = generateId();
      
      const checkoutUrl = await createWhopCheckout(
        boostAmt, 
        { type: "boost", id, identity, amount: String(boostAmt), ...(referredBy && { referredBy }) },
        referredBy
      );
      return NextResponse.json({ url: checkoutUrl });
    }

    if (type === "takeover") {
      const settings = await getSettings();
      if (!settings.takeoverEnabled) {
        return NextResponse.json({ error: "Hostile Takeovers are disabled by the administrator." }, { status: 403 });
      }
      
      // Validate: no active takeover already
      const takeoverState = await getTakeover();
      if (takeoverState.active) {
        return NextResponse.json({ error: "A takeover is already active. Try again after it expires." }, { status: 409 });
      }
      const topBid = await getTopBid();
      const cost = topBid > 0 ? topBid * settings.takeoverMultiplier : (settings.takeoverMultiplier * 10 || 50);
      const id = generateId();
      
      const checkoutUrl = await createWhopCheckout(
        cost, 
        { type: "takeover", id, identity, amount: String(cost), ...(referredBy && { referredBy }) },
        referredBy
      );
      return NextResponse.json({ url: checkoutUrl, cost });
    }

    // type === "bid"
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return NextResponse.json({ error: "amount ≥ 1 required" }, { status: 400 });
    }
    const charge = await chargeForBid(identity, parsedAmount);
    const id = generateId();
    
    const checkoutUrl = await createWhopCheckout(
      charge, 
      { 
        type: "bid", 
        id, 
        identity, 
        amount: String(parsedAmount), 
        charge: String(charge), 
        ...(title && { title: title.slice(0, 100) }),
        ...(description && { description: description.slice(0, 100) }),
        ...(vaultOffer && { vaultOffer: vaultOffer.slice(0, 100) }),
        ...(vaultSecret && { vaultSecret: vaultSecret.slice(0, 100) }),
        ...(referredBy && { referredBy })
      },
      referredBy
    );
    
    return NextResponse.json({ url: checkoutUrl, charge });
  } catch (err: any) {
    console.error("[POST /api/checkout]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
