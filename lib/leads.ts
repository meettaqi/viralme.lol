import { supabase } from './supabaseClient';

export interface LeadMagnet {
  offer: string;
  secret: string;
}

export async function saveLeadMagnet(identity: string, offer: string, secret: string) {
  try {
    const { data: existing } = await supabase.from('bids').select('id').eq('identity', 'MAGNET_' + identity).single();
    if (existing) {
      await supabase.from('bids').update({ title: offer, description: secret }).eq('id', existing.id);
    } else {
      await supabase.from('bids').insert({
        id: crypto.randomUUID(),
        identity: 'MAGNET_' + identity,
        title: offer,
        description: secret,
        amount: 0,
        base_amount: 0,
        paid: true,
        stripe_session_id: 'magnet'
      });
    }
  } catch(e) {
    console.error('Failed to save lead magnet', e);
  }
}

export async function getLeadMagnet(identity: string): Promise<LeadMagnet | null> {
  try {
    const { data } = await supabase.from('bids').select('title, description').eq('identity', 'MAGNET_' + identity).single();
    if (data) {
      return { offer: data.title, secret: data.description };
    }
  } catch(e) {}
  return null;
}

export async function saveLead(identity: string, email: string) {
  try {
    await supabase.from('bids').insert({
      id: crypto.randomUUID(),
      identity: 'LEAD_' + identity + '_' + crypto.randomUUID().slice(0, 8),
      title: email,
      description: identity,
      amount: 0,
      base_amount: 0,
      paid: true,
      stripe_session_id: 'lead'
    });
  } catch(e) {
    console.error('Failed to save lead email', e);
  }
}
