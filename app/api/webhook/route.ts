import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import {
  confirmPayment,
  updateOGData,
  upsertPendingBid,
  applyBoost,
} from "@/lib/db";
import { activateTakeover, getTakeover } from "@/lib/takeover";
import { fetchOG } from "@/lib/og";
import { generateId } from "@/lib/utils";
import { saveLeadMagnet } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  let webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

  // TEMPORARY LOGGING: Save the raw webhook to DB to debug signature issues
  try {
    const { createClient } = require("@supabase/supabase-js");
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    await sb.from("bids").insert({
      identity: "SYS_DEBUG_" + Math.random().toString(36).substring(7),
      title: "Webhook Raw",
      description: body.substring(0, 100),
      amount: 0,
      paid: true,
    });
  } catch (e) {
    console.error(e);
  }

  if (!webhookSecret) {
    console.error("[webhook] Missing WHOP_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  // Handle if Whop provided a hex secret instead of a standard webhook secret
  const { unwrapWebhook } = require("@whop/sdk");
  const headers = Object.fromEntries(req.headers);
  
  let payload: any;
  try {
    payload = unwrapWebhook(body, { headers, key: webhookSecret });
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  if (payload.action !== "payment.succeeded") {
    // TEMPORARY LOGGING: Save the webhook action to DB to see what Whop is sending
    try {
      const { createClient } = require("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      await sb.from("bids").insert({
        identity: "SYS_DEBUG_" + Math.random().toString(36).substring(7),
        title: "Webhook Received",
        description: `Action: ${payload.action}`,
        amount: 0,
        paid: true,
      });
    } catch (e) {
      console.error(e);
    }
    return NextResponse.json({ ok: true });
  }

  const payment = payload.data;
  
  // Clean up the Whop membership right away so the user can purchase this $0 plan again later
  // without hitting the "one active app installment at a time" anti-abuse limit.
  const membershipId = payment.membership?.id;
  if (membershipId) {
    try {
      const { WhopClient } = require("@whop/sdk");
      const whop = new WhopClient({ token: process.env.WHOP_API_KEY });
      await whop.memberships.cancel({ id: membershipId, reason: "Viralme auto-cleanup for repeat bids" });
      console.log(`[webhook] Canceled membership ${membershipId} for repeat bids`);
    } catch (e) {
      console.error("[webhook] Failed to cancel membership", membershipId, e);
    }
  }

  // In Whop API v2, the metadata from the plan creation should carry over to the payment/membership event.
  const meta = (payment.metadata ?? payment.plan?.metadata ?? {}) as Record<string, string>;
  const { type = "bid", id = generateId(), identity, amount, charge, vaultOffer, vaultSecret, title = "", description = "" } = meta;

  if (vaultOffer && vaultSecret) {
    saveLeadMagnet(identity, vaultOffer, vaultSecret);
  }

  if (!identity || !amount) {
    console.error("[webhook] Missing metadata in payment event", payment.id);
    return NextResponse.json({ ok: true });
  }

  const parsedAmount = parseInt(amount, 10);
  const actualCharge = type === "bid" ? parseInt(charge || amount, 10) : parsedAmount;

  // ── BOOST ─────────────────────────────────────────────────────────────────
  if (type === "boost") {
    await applyBoost(identity, parsedAmount);
    return NextResponse.json({ ok: true });
  }

  // ── TAKEOVER ──────────────────────────────────────────────────────────────
  if (type === "takeover") {
    const takeover = await getTakeover();
    
    // If a takeover is already active and it's NOT a retry from the same user, ignore it.
    if (takeover.active && takeover.identity !== identity) {
      console.error("[webhook] Takeover race condition: dropped payment from", identity);
      return NextResponse.json({ ok: true, note: "Takeover already active" });
    }

    const isRetry = takeover.active && takeover.identity === identity && (new Date().getTime() - new Date(takeover.triggeredAt).getTime() < 120000);
    
    if (!isRetry) {
      await activateTakeover(identity, identity, parsedAmount);
      fetchOG(identity)
        .then(async ({ title }) => {
          if (title) await activateTakeover(identity, title, parsedAmount);
        })
        .catch(() => {});
    }
    return NextResponse.json({ ok: true });
  }

  // ── BID ───────────────────────────────────────────────────────────────────
  await upsertPendingBid({
    identity,
    amount: parsedAmount,
    baseAmount: parsedAmount,
    title,
    description,
    createdAt: new Date().toISOString(),
    paid: true,
    stripeSessionId: id,
  });

  fetchOG(identity)
    .then(async ({ title: fetchedTitle, description: fetchedDesc }) => {
      // Only update OG data if they didn't manually provide it
      if (!title || !description) {
         await updateOGData(id, fetchedTitle || title, fetchedDesc || description);
      }
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
