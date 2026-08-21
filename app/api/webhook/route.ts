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
  const { type = "bid", id, identity, amount, referredBy, charge, vaultOffer, vaultSecret } = meta;

  if (!identity || !amount) {
    console.error("[webhook] Missing metadata", order.id);
    return NextResponse.json({ ok: true });
  }


  const parsedAmount = parseInt(amount, 10);
  const actualCharge = type === "bid" ? parseInt(charge || amount, 10) : parsedAmount;

  if (referredBy && referredBy !== identity) {
    try {
      await applyBoost(referredBy, Math.min(10, actualCharge));
    } catch(err) {
      console.error("[webhook] error applying referral", err);
    }
  }

  // ── BOOST ─────────────────────────────────────────────────────────────────
  if (type === "boost") {
    await applyBoost(identity, parsedAmount);
    return NextResponse.json({ ok: true });
  }

  // ── TAKEOVER ──────────────────────────────────────────────────────────────
  if (type === "takeover") {
    // Don't double-activate if webhook fires twice
    const takeover = await getTakeover();
    if (!takeover.active) {
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
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    paid: false,
    stripeSessionId: id,
  });
  await confirmPayment(id);
  fetchOG(identity)
    .then(async ({ title, description }) => await updateOGData(id, title, description))
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
