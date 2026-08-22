import { supabase } from './supabaseClient';

export interface LeadMagnet {
  offer: string;
  secret: string;
}

export interface Bid {
  leadMagnet?: LeadMagnet;
  id: string;
  identity: string;
  title: string;
  description: string;
  amount: number;
  baseAmount: number;
  boostTotal: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  heldTopSince?: string;
  hallOfFame: boolean;
  paid: boolean;
  stripeSessionId: string;
}

// ── Hall-of-Fame check ────────────────────────────────────────────────────────

/** Promotes HoF if #1 held for 24h */
async function checkAndUpdateHallOfFame(bids: Bid[]): Promise<boolean> {
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
    await supabase.from('bids').update({ held_top_since: bids[topIdx].heldTopSince }).eq('id', bids[topIdx].id);
  }

  // Clear heldTopSince on everyone who is NOT #1
  for (let i = 0; i < bids.length; i++) {
    if (bids[i].id !== top.id && bids[i].heldTopSince) {
      bids[i].heldTopSince = undefined;
      changed = true;
      await supabase.from('bids').update({ held_top_since: null }).eq('id', bids[i].id);
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
      await supabase.from('bids').update({ hall_of_fame: true }).eq('id', bids[topIdx].id);
    }
  }

  return changed;
}

function mapBidFromDB(row: any): Bid {
  return {
    id: row.id,
    identity: row.identity,
    title: row.title,
    description: row.description,
    amount: Number(row.amount),
    baseAmount: Number(row.base_amount),
    boostTotal: Number(row.boost_total),
    clicks: row.clicks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    heldTopSince: row.held_top_since || undefined,
    hallOfFame: row.hall_of_fame,
    paid: row.paid,
    stripeSessionId: row.stripe_session_id,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getLeaderboard(): Promise<Bid[]> {
  const { data: rows, error } = await supabase
    .from('bids')
    .select('*')
    .eq('paid', true)
    .not('identity', 'like', 'SYS_%')
    .not('identity', 'like', 'MAGNET_%')
    .not('identity', 'like', 'LEAD_%')
    .order('amount', { ascending: false })
    .order('created_at', { ascending: true });

  if (error || !rows) return [];
  
  const bids = rows.map(mapBidFromDB);
  await checkAndUpdateHallOfFame(bids);
  return bids;
}

export async function getTopBid(): Promise<number> {
  const board = await getLeaderboard();
  return board.length > 0 ? board[0].amount : 0;
}

export async function getCurrentBid(identity: string): Promise<number> {
  const { data, error } = await supabase
    .from('bids')
    .select('base_amount')
    .eq('identity', identity)
    .eq('paid', true)
    .single();

  if (error || !data) return 0;
  return Number(data.base_amount);
}

export async function upsertPendingBid(
  bid: Omit<Bid, "boostTotal" | "hallOfFame" | "updatedAt" | "clicks" | "id" | "createdAt" | "baseAmount"> & {
    clicks?: number;
    paid?: boolean;
    boostTotal?: number;
    hallOfFame?: boolean;
    updatedAt?: string;
    id?: string;
    createdAt?: string;
    baseAmount?: number;
  }
): Promise<Bid> {
  const { data: existing, error: findError } = await supabase
    .from('bids')
    .select('*')
    .eq('identity', bid.identity)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    if (bid.amount >= Number(existing.amount)) {
      const newBaseAmount = bid.baseAmount ?? bid.amount;
      const newBoostTotal = bid.boostTotal ?? existing.boost_total;

      const updateData = {
        title: bid.title || existing.title,
        description: bid.description || existing.description,
        amount: newBaseAmount + newBoostTotal,
        base_amount: newBaseAmount,
        paid: bid.paid !== undefined ? bid.paid : existing.paid,
        boost_total: newBoostTotal,
        stripe_session_id: bid.stripeSessionId,
        updated_at: now,
      };
      
      const { data: updated, error } = await supabase
        .from('bids')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (updated) return mapBidFromDB(updated);
    }
    return mapBidFromDB(existing);
  }

  const newBaseAmount = bid.baseAmount ?? bid.amount;
  const newBoostTotal = bid.boostTotal ?? 0;

  const insertData = {
    id: crypto.randomUUID(),
    identity: bid.identity,
    title: bid.title,
    description: bid.description,
    amount: newBaseAmount + newBoostTotal,
    base_amount: newBaseAmount,
    boost_total: newBoostTotal,
    clicks: bid.clicks ?? 0,
    hall_of_fame: bid.hallOfFame ?? false,
    paid: bid.paid ?? false,
    stripe_session_id: bid.stripeSessionId,
    created_at: bid.createdAt || now,
    updated_at: now,
  };

  const { data: inserted, error } = await supabase
    .from('bids')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapBidFromDB(inserted);
}

export async function confirmPayment(sessionId: string): Promise<Bid | null> {
  const { data, error } = await supabase
    .from('bids')
    .update({ 
      paid: true, 
      updated_at: new Date().toISOString() 
    })
    .eq('stripe_session_id', sessionId)
    .select()
    .single();

  if (error || !data) return null;
  return mapBidFromDB(data);
}

export async function updateOGData(sessionId: string, title: string, description: string): Promise<void> {
  const { data } = await supabase
    .from('bids')
    .select('title, description')
    .eq('stripe_session_id', sessionId)
    .single();

  if (data) {
    const newTitle = data.title || title;
    const newDescription = data.description || description;
    await supabase
      .from('bids')
      .update({ title: newTitle, description: newDescription })
      .eq('stripe_session_id', sessionId);
  }
}

export async function applyBoost(identity: string, boostAmount: number): Promise<Bid | null> {
  const { data: existing, error: findError } = await supabase
    .from('bids')
    .select('*')
    .eq('identity', identity)
    .eq('paid', true)
    .single();

  if (findError || !existing) return null;

  const { data: updated, error } = await supabase
    .from('bids')
    .update({
      amount: Number(existing.amount) + boostAmount,
      boost_total: Number(existing.boost_total) + boostAmount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing.id)
    .select()
    .single();

  if (error || !updated) return null;
  return mapBidFromDB(updated);
}

export async function incrementClicks(identity: string): Promise<number> {
  const { data: existing, error: findError } = await supabase
    .from('bids')
    .select('id, clicks')
    .eq('identity', identity)
    .eq('paid', true)
    .single();

  if (findError || !existing) return 0;

  const newClicks = existing.clicks + 1;
  await supabase
    .from('bids')
    .update({ clicks: newClicks })
    .eq('id', existing.id);

  return newClicks;
}

export async function getHallOfFame(): Promise<Bid[]> {
  const { data: rows, error } = await supabase
    .from('bids')
    .select('*')
    .eq('hall_of_fame', true)
    .eq('paid', true)
    .not('identity', 'like', 'SYS_%')
    .not('identity', 'like', 'MAGNET_%')
    .not('identity', 'like', 'LEAD_%')
    .order('updated_at', { ascending: false });

  if (error || !rows) return [];
  return rows.map(mapBidFromDB);
}


export async function deleteBid(id: string): Promise<void> {
  await supabase.from('bids').delete().eq('id', id);
}
