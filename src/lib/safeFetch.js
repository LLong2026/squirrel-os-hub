import { base44 } from "@/api/base44Client";

// Resolves to [] on any error so a missing/failed entity never crashes the page.
export function safeList(entityName, sort, limit) {
  try {
    const ent = base44?.entities?.[entityName];
    if (!ent || typeof ent.list !== "function") return Promise.resolve([]);
    return Promise.resolve(ent.list(sort, limit)).catch(() => []);
  } catch {
    return Promise.resolve([]);
  }
}

export function safeUpdate(entityName, id, data) {
  try {
    const ent = base44?.entities?.[entityName];
    if (!ent || typeof ent.update !== "function") return Promise.resolve(null);
    return Promise.resolve(ent.update(id, data)).catch(() => null);
  } catch {
    return Promise.resolve(null);
  }
}

export const healthTone = (s) => (s > 90 ? "success" : s >= 75 ? "warning" : "destructive");
export const healthColor = (s) => (s > 90 ? "text-success" : s >= 75 ? "text-warning" : "text-destructive");
export const healthBar = (s) => (s > 90 ? "bg-success" : s >= 75 ? "bg-warning" : "bg-destructive");