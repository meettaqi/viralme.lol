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

const DEMO_MODE =
  !process.env.POLAR_ACCESS_TOKEN ||
  process.env.POLAR_ACCESS_TOKEN === "REPLACE_ME";

// ── Types ─────────────────────────────────────────────────────────────────────
type CheckoutType = "bid" | "boost" | "takeover";

interface RequestBody {
  type: CheckoutType;
  identity: string; // target identity (for boost/takeover = the entry being boosted/taken over)
  amount?: number; // for bid: desired total bid; for boost: $1-$5
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function chargeForBid(identity: string, desiredAmount: number): number {
  const existing = getCurrentBid(identity);
  const charge = existing > 0 ? Math.max(1, desiredAmount - existing) : desiredAmount;
  return charge;
}

// ── Demo mode handlers ────────────────────────────────────────────────────────
function demoHandleBid(identity: string, amount: number, siteUrl: string) {
  const id = generateId();
  const sessionId = "polar_demo_" + id;
  upsertPendingBid({
    id,
    identity,
    amount,
    baseAmount: amount,
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    paid: false,
    stripeSessionId: sessionId,
  });
  confirmPayment(sessionId);
  fetchOG(identity)
    .then(({ title, description }) => updateOGData(sessionId, title, description))
    .catch(() => {});
  return NextResponse.json({ url: `${siteUrl}/success?demo=1` });
}

function demoHandleBoost(identity: string, boostAmount: number, siteUrl: string) {
  applyBoost(identity, boostAmount);
  return NextResponse.json({ url: `${siteUrl}/success?demo=1&type=boost` });
}

function demoHandleTakeover(identity: string, siteUrl: string) {
  const settings = getSettings();
  if (!settings.takeoverEnabled) {
    return NextResponse.json({ error: "Hostile Takeovers are disabled by the administrator." }, { status: 403 });
  }
  const topBid = getTopBid();
  const cost = topBid > 0 ? topBid * settings.takeoverMultiplier : (settings.takeoverMultiplier * 10 || 50);
  activateTakeover(identity, identity, cost);
  return NextResponse.json({ url: `${siteUrl}/success?demo=1&type=takeover` });
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;
    const { type = "bid", identity, amount } = body;

    if (!identity) {
      return NextResponse.json({ error: "identity required" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // ── DEMO MODE ────────────────────────────────────────────────────────────
    if (DEMO_MODE) {
      if (type === "boost") {
        const boostAmt = Math.min(5, Math.max(1, amount ?? 1));
        return demoHandleBoost(identity, boostAmt, siteUrl);
      }
      if (type === "takeover") return demoHandleTakeover(identity, siteUrl);
      return demoHandleBid(identity, amount ?? 1, siteUrl);
    }

    // ── LIVE MODE ────────────────────────────────────────────────────────────
    const productId = process.env.POLAR_PRODUCT_ID;
    if (!productId) {
      return NextResponse.json({ error: "POLAR_PRODUCT_ID not configured" }, { status: 500 });
    }
    const { getPolar } = await import("@/lib/polar");
    const polar = getPolar();
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      undefined;

    if (type === "boost") {
      const boostAmt = Math.min(5, Math.max(1, amount ?? 1));
      const id = generateId();
      const checkout = await polar.checkouts.create({
        products: [productId],
        prices: {
          [productId]: [{ amountType: "fixed", priceAmount: boostAmt * 100, priceCurrency: "usd" }],
        },
        metadata: { type: "boost", id, identity, amount: String(boostAmt) },
        successUrl: `${siteUrl}/success?checkout_id={CHECKOUT_ID}&type=boost`,
        customerIpAddress: clientIp,
      });
      return NextResponse.json({ url: checkout.url });
    }

    if (type === "takeover") {
      const settings = getSettings();
      if (!settings.takeoverEnabled) {
        return NextResponse.json({ error: "Hostile Takeovers are disabled by the administrator." }, { status: 403 });
      }
      
      // Validate: no active takeover already
      if (getTakeover().active) {
        return NextResponse.json({ error: "A takeover is already active. Try again after it expires." }, { status: 409 });
      }
      const topBid = getTopBid();
      const cost = topBid > 0 ? topBid * settings.takeoverMultiplier : (settings.takeoverMultiplier * 10 || 50);
      const id = generateId();
      const checkout = await polar.checkouts.create({
        products: [productId],
        prices: {
          [productId]: [{ amountType: "fixed", priceAmount: cost * 100, priceCurrency: "usd" }],
        },
        metadata: { type: "takeover", id, identity, amount: String(cost) },
        successUrl: `${siteUrl}/success?checkout_id={CHECKOUT_ID}&type=takeover`,
        customerIpAddress: clientIp,
      });
      return NextResponse.json({ url: checkout.url, cost });
    }

    // type === "bid"
    if (!amount || amount < 1) {
      return NextResponse.json({ error: "amount ≥ 1 required" }, { status: 400 });
    }
    const charge = chargeForBid(identity, amount);
    const id = generateId();
    const checkout = await polar.checkouts.create({
      products: [productId],
      prices: {
        [productId]: [{ amountType: "fixed", priceAmount: charge * 100, priceCurrency: "usd" }],
      },
      metadata: { type: "bid", id, identity, amount: String(amount), charge: String(charge) },
      successUrl: `${siteUrl}/success?checkout_id={CHECKOUT_ID}`,
      customerIpAddress: clientIp,
    });
    upsertPendingBid({
      id,
      identity,
      amount,
      baseAmount: amount,
      title: "",
      description: "",
      createdAt: new Date().toISOString(),
      paid: false,
      stripeSessionId: checkout.id,
    });
    return NextResponse.json({ url: checkout.url, charge });
  } catch (err) {
    console.error("[POST /api/checkout]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
