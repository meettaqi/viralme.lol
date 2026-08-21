import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "takeover.json");

export interface TakeoverState {
  active: boolean;
  identity: string;
  title: string;
  endsAt: string; // ISO — when the 3h lock expires
  triggeredAt: string; // ISO
  triggerAmount: number; // 5× at time of trigger
}

const EMPTY: TakeoverState = {
  active: false,
  identity: "",
  title: "",
  endsAt: "",
  triggeredAt: "",
  triggerAmount: 0,
};

function read(): TakeoverState {
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    const data = JSON.parse(raw) as TakeoverState;
    // Auto-expire
    if (data.active && data.endsAt && new Date(data.endsAt) < new Date()) {
      write(EMPTY);
      return EMPTY;
    }
    return data;
  } catch {
    return EMPTY;
  }
}

function write(state: TakeoverState): void {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(state, null, 2), "utf-8");
}

export function getTakeover(): TakeoverState {
  return read();
}

import { getSettings } from "./settings";

export function activateTakeover(
  identity: string,
  title: string,
  triggerAmount: number
): TakeoverState {
  const settings = getSettings();
  const state: TakeoverState = {
    active: true,
    identity,
    title,
    triggeredAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + settings.takeoverDurationHours * 60 * 60 * 1000).toISOString(),
    triggerAmount,
  };
  write(state);
  return state;
}

export function isTakeoverActive(): boolean {
  return read().active;
}
