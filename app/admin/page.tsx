import { getSettings } from "@/lib/settings";
import { updateSettingsAction, deleteBidAction } from "./actions";
import { getLeaderboard } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const settings = await getSettings();
  const bids = await getLeaderboard();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <form action={updateSettingsAction} className="space-y-6 bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
        
        <div className="flex items-center justify-between">
          <label htmlFor="takeoverEnabled" className="font-semibold cursor-pointer">Enable Hostile Takeover</label>
          <input 
            type="checkbox" 
            id="takeoverEnabled" 
            name="takeoverEnabled" 
            defaultChecked={settings.takeoverEnabled}
            className="w-5 h-5 accent-brand-500 cursor-pointer" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="takeoverDurationHours" className="block font-semibold">Takeover Duration (Hours)</label>
          <input 
            type="number" 
            id="takeoverDurationHours" 
            name="takeoverDurationHours" 
            defaultValue={settings.takeoverDurationHours} 
            min="1"
            className="w-full bg-background border border-border rounded-lg px-4 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="takeoverMultiplier" className="block font-semibold">Takeover Multiplier</label>
          <p className="text-xs text-muted-foreground mb-2">How many times the current #1 amount does it cost? (e.g. 5x)</p>
          <input 
            type="number" 
            id="takeoverMultiplier" 
            name="takeoverMultiplier" 
            defaultValue={settings.takeoverMultiplier}
            min="1"
            step="0.1"
            className="w-full bg-background border border-border rounded-lg px-4 py-2"
          />
        </div>

        <hr className="border-border" />

        <div className="space-y-2">
          <label htmlFor="password" className="block font-semibold text-red-500">Admin Password</label>
          <p className="text-xs text-muted-foreground mb-2">Required to save changes.</p>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required
            className="w-full bg-background border border-red-500/30 focus:border-red-500 rounded-lg px-4 py-2"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Save Settings
        </button>
      </form>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Manage Active Bids</h2>
        <div className="space-y-3">
          {bids.map((bid) => (
            <div key={bid.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm">
              <div>
                <p className="font-bold text-foreground">{bid.title}</p>
                <p className="text-sm text-muted-foreground">{bid.identity} • ${bid.amount}</p>
              </div>
              
              <form action={deleteBidAction} className="flex items-center gap-3">
                <input type="hidden" name="bidId" value={bid.id} />
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Admin Password" 
                  required
                  className="w-32 bg-background border border-border text-xs rounded-lg px-2 py-1.5"
                />
                <button 
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  onClick={(e) => {
                    if(!confirm('Are you sure you want to permanently delete this bid?')) e.preventDefault();
                  }}
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
          {bids.length === 0 && (
            <p className="text-muted-foreground text-sm">No active bids found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
