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
  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[webhook] Missing WHOP_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  const wh = new Webhook(webhookSecret);
  const headers = Object.fromEntries(req.headers);
  
  let payload: any;
  try {
    payload = wh.verify(body, headers);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  if (payload.action !== "payment.succeeded") {
    return NextResponse.json({ ok: true });
  }

  const payment = payload.data;
  
  // In Whop API v2, the metadata from the plan creation should carry over to the payment/membership event.
  // Sometimes Whop puts it inside data.plan.metadata or data.metadata or data.custom_fields.
  // We'll extract metadata from the event payload. 
  // It's typically at `payment.metadata` or `payment.product.metadata` depending on Whop's exact structure for v2.
  // We know we sent it inside `metadata` when creating the plan.
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
