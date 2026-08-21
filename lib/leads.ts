import fs from "fs";
import path from "path";

export interface LeadMagnet {
  offer: string;
  secret: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const MAGNETS_FILE = path.join(DATA_DIR, "magnets.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

export function saveLeadMagnet(identity: string, offer: string, secret: string) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  let magnets: Record<string, LeadMagnet> = {};
  try {
    if (fs.existsSync(MAGNETS_FILE)) magnets = JSON.parse(fs.readFileSync(MAGNETS_FILE, "utf8"));
  } catch (e) {}
  
  magnets[identity] = { offer, secret };
  fs.writeFileSync(MAGNETS_FILE, JSON.stringify(magnets, null, 2));
}

export function getLeadMagnet(identity: string): LeadMagnet | null {
  try {
    if (fs.existsSync(MAGNETS_FILE)) {
      const magnets = JSON.parse(fs.readFileSync(MAGNETS_FILE, "utf8"));
      return magnets[identity] || null;
    }
  } catch (e) {}
  return null;
}

export function saveLead(identity: string, email: string) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  let leads: any[] = [];
  try {
    if (fs.existsSync(LEADS_FILE)) leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf8"));
  } catch (e) {}
  
  leads.push({ identity, email, createdAt: new Date().toISOString() });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}
