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
  const { type = "bid", id, identity, amount } = meta;

  if (!identity || !amount) {
    console.error("[webhook] Missing metadata", order.id);
    return NextResponse.json({ ok: true });
  }

  const parsedAmount = parseInt(amount, 10);
  const checkoutId = (order as { checkout_id?: string }).checkout_id ?? order.id;

  // ── BOOST ─────────────────────────────────────────────────────────────────
  if (type === "boost") {
    applyBoost(identity, parsedAmount);
    return NextResponse.json({ ok: true });
  }

  // ── TAKEOVER ──────────────────────────────────────────────────────────────
  if (type === "takeover") {
    // Don't double-activate if webhook fires twice
    if (!getTakeover().active) {
      activateTakeover(identity, identity, parsedAmount);
      // Scrape title in background
      fetchOG(identity)
        .then(({ title }) => {
          if (title) activateTakeover(identity, title, parsedAmount);
        })
        .catch(() => {});
    }
    return NextResponse.json({ ok: true });
  }

  // ── BID ───────────────────────────────────────────────────────────────────
  upsertPendingBid({
    id: id || generateId(),
    identity,
    amount: parsedAmount,
    baseAmount: parsedAmount,
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    paid: false,
    stripeSessionId: checkoutId,
  });
  confirmPayment(checkoutId);
  fetchOG(identity)
    .then(({ title, description }) => updateOGData(checkoutId, title, description))
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
