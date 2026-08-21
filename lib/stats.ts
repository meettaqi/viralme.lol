import fs from "fs";
import path from "path";

const STATS_FILE = path.join(process.cwd(), "data", "stats.json");

export interface Stats {
  totalVisitors: number;
}

const DEFAULT_STATS: Stats = {
  totalVisitors: 0,
};

export function getStats(): Stats {
  try {
    if (!fs.existsSync(path.dirname(STATS_FILE))) {
      fs.mkdirSync(path.dirname(STATS_FILE), { recursive: true });
    }
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, "utf8");
      return { ...DEFAULT_STATS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error("Error reading stats:", err);
  }
  return DEFAULT_STATS;
}

export function incrementTotalVisitors(): number {
  const stats = getStats();
  stats.totalVisitors += 1;
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error("Error writing stats:", err);
  }
  return stats.totalVisitors;
}
