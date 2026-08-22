import { NextRequest, NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
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
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[webhook] Missing POLAR_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  let event: ReturnType<typeof validateEvent>;
  try {
    event = validateEvent(body, Object.fromEntries(req.headers), webhookSecret);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    throw err;
  }

  if (event.type !== "order.paid") {
    return NextResponse.json({ ok: true });
  }

  const order = event.data;
  const meta = (order.metadata ?? {}) as Record<string, string>;
  const { type = "bid", id, identity, amount, charge, vaultOffer, vaultSecret, title = "", description = "" } = meta;

  if (vaultOffer && vaultSecret) {
    saveLeadMagnet(identity, vaultOffer, vaultSecret);
  }

  if (!identity || !amount) {
    console.error("[webhook] Missing metadata", order.id);
    return NextResponse.json({ ok: true });
  }


  const parsedAmount = parseInt(amount, 10);
  const actualCharge = type === "bid" ? parseInt(charge || amount, 10) : parsedAmount;

  // Referral boost logic removed to prevent referrers from stealing the #1 spot
  // from the person they referred.

  // ── BOOST ─────────────────────────────────────────────────────────────────
  if (type === "boost") {
    await applyBoost(identity, parsedAmount);
    return NextResponse.json({ ok: true });
  }

  // ── TAKEOVER ──────────────────────────────────────────────────────────────
  if (type === "takeover") {
    const takeover = await getTakeover();
    // Prevent webhook retries from endlessly extending the timer
    const isRetry = takeover.active && takeover.identity === identity && (new Date().getTime() - new Date(takeover.triggeredAt).getTime() < 120000);
    
    if (!isRetry) {
      await activateTakeover(identity, identity, parsedAmount);
      // Scrape title in background
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
