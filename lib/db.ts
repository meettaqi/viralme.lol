import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "bids.json");

export interface Bid {
  id: string;
  identity: string; // URL, @handle, or github.com/...
  title: string;
  description: string;
  amount: number; // effective total (baseAmount + boosts applied)
  baseAmount: number; // what the owner actually paid
  boostTotal: number; // total boost contributions from visitors
  clicks: number;
  createdAt: string; // ISO — when they first bid
  updatedAt: string; // ISO — last bid/boost
  heldTopSince?: string; // ISO — when this entry became #1 (cleared if displaced)
  hallOfFame: boolean; // true if ever held #1 for ≥24h
  paid: boolean;
  stripeSessionId: string; // used for Polar checkout ID too
}

// ── File I/O ──────────────────────────────────────────────────────────────────

function readAll(): Bid[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(raw) as Partial<Bid>[];
    // Migrate legacy records that lack new fields
    return data.map((b) => ({
      boostTotal: 0,
      baseAmount: b.amount ?? 0,
      hallOfFame: false,
      updatedAt: b.createdAt ?? new Date().toISOString(),
      ...b,
    })) as Bid[];
  } catch {
    return [];
  }
}

function writeAll(bids: Bid[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(bids, null, 2), "utf-8");
  fs.renameSync(tmp, DATA_FILE);
}

// ── Hall-of-Fame check ────────────────────────────────────────────────────────

/** Called every time we read the leaderboard — promotes HoF if #1 held for 24h */
function checkAndUpdateHallOfFame(bids: Bid[]): boolean {
  const paid = bids.filter((b) => b.paid);
  if (paid.length === 0) return false;

  paid.sort((a, b) => b.amount - a.amount || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const top = paid[0];

  let changed = false;

  // Set heldTopSince on the current #1 if not already set
  const topIdx = bids.findIndex((b) => b.id === top.id);
  if (topIdx >= 0 && !bids[topIdx].heldTopSince) {
    bids[topIdx].heldTopSince = new Date().toISOString();
    changed = true;
  }

  // Clear heldTopSince on everyone who is NOT #1
  for (let i = 0; i < bids.length; i++) {
    if (bids[i].id !== top.id && bids[i].heldTopSince) {
      bids[i].heldTopSince = undefined;
      changed = true;
    }
  }

  // Promote to Hall of Fame if #1 for ≥24h
  if (
    topIdx >= 0 &&
    !bids[topIdx].hallOfFame &&
    bids[topIdx].heldTopSince
  ) {
    const held = Date.now() - new Date(bids[topIdx].heldTopSince!).getTime();
    if (held >= 24 * 60 * 60 * 1000) {
      bids[topIdx].hallOfFame = true;
      changed = true;
    }
  }

  return changed;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns paid bids sorted by amount desc, oldest-first on ties */
export function getLeaderboard(): Bid[] {
  const bids = readAll();
  const changed = checkAndUpdateHallOfFame(bids);
  if (changed) writeAll(bids);

  return bids
    .filter((b) => b.paid)
    .sort(
      (a, b) =>
        b.amount - a.amount ||
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

/** Current highest bid amount (0 if no paid bids) */
export function getTopBid(): number {
  const board = getLeaderboard();
  return board.length > 0 ? board[0].amount : 0;
}

/** How much an identity has already paid (0 if new bidder) */
export function getCurrentBid(identity: string): number {
  const bids = readAll();
  const existing = bids.find((b) => b.identity === identity && b.paid);
  return existing?.baseAmount ?? 0;
}

/** Insert / update a pending bid record before payment */
export function upsertPendingBid(
  bid: Omit<Bid, "boostTotal" | "hallOfFame" | "updatedAt" | "clicks"> & {
    clicks?: number;
    paid?: boolean;
    boostTotal?: number;
    hallOfFame?: boolean;
    updatedAt?: string;
  }
): Bid {
  const bids = readAll();
  const idx = bids.findIndex((b) => b.identity === bid.identity);
  const now = new Date().toISOString();

  if (idx >= 0) {
    const existing = bids[idx];
    if (bid.amount >= existing.amount) {
      bids[idx] = {
        ...existing,
        ...bid,
        paid: bid.paid ?? existing.paid,
        boostTotal: bid.boostTotal ?? existing.boostTotal,
        hallOfFame: existing.hallOfFame, // never downgrade HoF
        updatedAt: now,
      };
    }
    writeAll(bids);
    return bids[idx];
  }

  const newBid: Bid = {
    ...bid,
    clicks: bid.clicks ?? 0,
    boostTotal: 0,
    hallOfFame: false,
    paid: false,
    updatedAt: now,
  };
  bids.push(newBid);
  writeAll(bids);
  return newBid;
}

/** Mark a bid as paid (by Polar checkout/session ID) */
export function confirmPayment(sessionId: string): Bid | null {
  const bids = readAll();
  const idx = bids.findIndex((b) => b.stripeSessionId === sessionId);
  if (idx < 0) return null;
  bids[idx].paid = true;
  bids[idx].updatedAt = new Date().toISOString();
  writeAll(bids);
  return bids[idx];
}

/** Update OG metadata after scraping */
export function updateOGData(sessionId: string, title: string, description: string): void {
  const bids = readAll();
  const idx = bids.findIndex((b) => b.stripeSessionId === sessionId);
  if (idx >= 0) {
    bids[idx].title = title;
    bids[idx].description = description;
    writeAll(bids);
  }
}

/** Apply a visitor boost: adds boostAmount to the entry's amount */
export function applyBoost(identity: string, boostAmount: number): Bid | null {
  const bids = readAll();
  const idx = bids.findIndex((b) => b.identity === identity && b.paid);
  if (idx < 0) return null;
  bids[idx].amount += boostAmount;
  bids[idx].boostTotal = (bids[idx].boostTotal ?? 0) + boostAmount;
  bids[idx].updatedAt = new Date().toISOString();
  writeAll(bids);
  return bids[idx];
}

/** Increment click count for an entry */
export function incrementClicks(identity: string): number {
  const bids = readAll();
  const idx = bids.findIndex((b) => b.identity === identity && b.paid);
  if (idx < 0) return 0;
  bids[idx].clicks++;
  writeAll(bids);
  return bids[idx].clicks;
}

/** Get all-time Hall of Fame entries (ever held #1 for ≥24h) */
export function getHallOfFame(): Bid[] {
  return readAll()
    .filter((b) => b.hallOfFame && b.paid)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
