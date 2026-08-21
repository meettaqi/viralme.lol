import { supabase } from './supabaseClient';

export interface Stats {
  totalVisitors: number;
}

const DEFAULT_STATS: Stats = {
  totalVisitors: 0,
};

export async function getStats(): Promise<Stats> {
  try {
    const { data } = await supabase
      .from('bids')
      .select('amount')
      .eq('identity', 'SYS_TOTAL_VISITORS')
      .single();
    if (data) return { totalVisitors: Number(data.amount) };
  } catch (err) {
    console.error('Error reading stats:', err);
  }
  return DEFAULT_STATS;
}

export async function incrementTotalVisitors(): Promise<number> {
  try {
    let stats = await getStats();
    let newTotal = stats.totalVisitors + 1;
    
    if (newTotal === 1) {
      await supabase.from('bids').insert({
        id: crypto.randomUUID(),
        identity: 'SYS_TOTAL_VISITORS',
        title: 'System Stats',
        description: 'Total unique visitors tracking',
        amount: newTotal,
        base_amount: newTotal,
        paid: true,
        stripe_session_id: 'sys'
      });
    } else {
      await supabase.from('bids').update({ amount: newTotal }).eq('identity', 'SYS_TOTAL_VISITORS');
    }
    return newTotal;
  } catch (err) {
    console.error('Error writing stats:', err);
    return 0;
  }
}
