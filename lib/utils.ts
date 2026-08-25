import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a dollar amount with comma separator */
export function formatUSD(amount: number): string {
  return "$" + amount.toLocaleString("en-US");
}

/** Format a count with K suffix */
export function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

/** Human-readable relative time */
export function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs} seconds ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Get the first letter of an identity (for avatar fallback) */
export function avatarLetter(identity: string): string {
  const clean = identity.replace(/^https?:\/\/(www\.)?/i, "").replace("@", "");
  return clean.charAt(0).toUpperCase() || "?";
}

/** Generate a random ID */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Simulated live visitor count (looks realistic, changes slowly) */
export function liveVisitorCount(): number {
  const base = 280;
  const variance = 150;
  const seed = Math.floor(Date.now() / 30000); // changes every 30s
  const rng = Math.sin(seed) * 0.5 + 0.5; // 0..1 pseudo-random
  return Math.round(base + rng * variance);
}

/** Normalize an identity to prevent duplicates (e.g. remove https:// and www.) */
export function normalizeIdentity(identity: string): string {
  let cleaned = identity.trim().toLowerCase();
  
  if (cleaned.startsWith("http://")) cleaned = cleaned.slice(7);
  if (cleaned.startsWith("https://")) cleaned = cleaned.slice(8);
  if (cleaned.startsWith("www.")) cleaned = cleaned.slice(4);
  
  if (cleaned.endsWith("/")) cleaned = cleaned.slice(0, -1);
  
  return cleaned;
}
