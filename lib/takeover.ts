import { supabase } from './supabaseClient';
import { getSettings } from './settings';

export interface TakeoverState {
  active: boolean;
  identity: string;
  title: string;
  endsAt: string;
  triggeredAt: string;
  triggerAmount: number;
}

const EMPTY: TakeoverState = {
  active: false,
  identity: "",
  title: "",
  endsAt: "",
  triggeredAt: "",
  triggerAmount: 0,
};

function mapTakeoverFromDB(row: any): TakeoverState {
  return {
    active: row.active,
    identity: row.identity,
    title: row.title,
    endsAt: row.ends_at || "",
    triggeredAt: row.triggered_at || "",
    triggerAmount: Number(row.trigger_amount),
  };
}

export async function getTakeover(): Promise<TakeoverState> {
  const { data, error } = await supabase
    .from('takeover')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) return EMPTY;
  
  const state = mapTakeoverFromDB(data);

  if (state.active && state.endsAt && new Date(state.endsAt) < new Date()) {
    await supabase
      .from('takeover')
      .update({
        active: false,
        identity: "",
        title: "",
        ends_at: null,
        triggered_at: null,
        trigger_amount: 0,
      })
      .eq('id', 1);
    return EMPTY;
  }

  return state;
}

export async function activateTakeover(
  identity: string,
  title: string,
  triggerAmount: number
): Promise<TakeoverState> {
  const settings = await getSettings();
  const state: TakeoverState = {
    active: true,
    identity,
    title,
    triggeredAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + settings.takeoverDurationHours * 60 * 60 * 1000).toISOString(),
    triggerAmount,
  };

  await supabase
    .from('takeover')
    .update({
      active: state.active,
      identity: state.identity,
      title: state.title,
      triggered_at: state.triggeredAt,
      ends_at: state.endsAt,
      trigger_amount: state.triggerAmount,
    })
    .eq('id', 1);

  return state;
}

export async function isTakeoverActive(): Promise<boolean> {
  const state = await getTakeover();
  return state.active;
}
