import { supabase } from './supabaseClient';

export interface AppSettings {
  takeoverEnabled: boolean;
  takeoverDurationHours: number;
  takeoverMultiplier: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  takeoverEnabled: true,
  takeoverDurationHours: 3,
  takeoverMultiplier: 5,
};

export async function getSettings(): Promise<AppSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) return DEFAULT_SETTINGS;

  return {
    takeoverEnabled: data.takeover_enabled,
    takeoverDurationHours: data.takeover_duration_hours,
    takeoverMultiplier: Number(data.takeover_multiplier),
  };
}

export async function updateSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated = { ...current, ...newSettings };
  
  await supabase
    .from('settings')
    .update({
      takeover_enabled: updated.takeoverEnabled,
      takeover_duration_hours: updated.takeoverDurationHours,
      takeover_multiplier: updated.takeoverMultiplier,
    })
    .eq('id', 1);
    
  return updated;
}
