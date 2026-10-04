import { createHash, randomBytes, randomUUID } from "node:crypto";

/**
 * Demo storage: one workspace held in server memory. It survives hot reloads
 * (kept on globalThis) but resets when the server restarts. Swap this module
 * for a database (Supabase, Postgres) before taking real money.
 */

export type ApiKey = {
  id: string;
  name: string;
  /** Only the SHA-256 hash of the secret is kept; the secret itself is shown once. */
  hash: string;
  /** Safe-to-display fragment, e.g. "kv_live_Ab3d…9xYz". */
  preview: string;
  createdAt: number;
  lastUsedAt: number | null;
  calls: number;
  revoked: boolean;
};

export type CallLog = {
  id: string;
  at: number;
  tool: string;
  cost: number;
  status: "ok" | "error";
  ms: number;
  source: "api" | "panel";
  keyName: string | null;
  error?: string;
};

type Workspace = {
  admin: ApiKey;
  balance: number;
  startingBalance: number;
  keys: ApiKey[];
  log: CallLog[];
  hits: Map<string, number[]>;
};

const LOG_LIMIT = 500;

function startingCredits() {
  const n = Number.parseInt(process.env.KOVAN_START_CREDITS ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : 500;
}

const g = globalThis as unknown as { __kovan?: Workspace };

export function ws(): Workspace {
  if (!g.__kovan) {
    const start = startingCredits();
    const admin: ApiKey = {
      id: "admin",
      name: "Ana anahtar",
      hash: "",
      preview: "KOVAN_ADMIN_KEY",
      createdAt: Date.now(),
      lastUsedAt: null,
      calls: 0,
      revoked: false,
    };
    g.__kovan = { admin, balance: start, startingBalance: start, keys: [], log: [], hits: new Map() };
  }
  return g.__kovan;
}

export const hashSecret = (secret: string) => createHash("sha256").update(secret).digest("hex");

export function createKey(name: string): { key: ApiKey; secret: string } {
  const secret = `kv_live_${randomBytes(24).toString("base64url")}`;
  const key: ApiKey = {
    id: randomUUID(),
    name: name.trim().slice(0, 40) || "Adsız anahtar",
    hash: hashSecret(secret),
    preview: `${secret.slice(0, 12)}…${secret.slice(-4)}`,
    createdAt: Date.now(),
    lastUsedAt: null,
    calls: 0,
    revoked: false,
  };
  ws().keys.unshift(key);
  return { key, secret };
}

export function revokeKey(id: string) {
  const key = ws().keys.find((k) => k.id === id);
  if (key) key.revoked = true;
}

export function findKeyBySecret(secret: string): ApiKey | undefined {
  const hash = hashSecret(secret);
  return ws().keys.find((k) => k.hash === hash && !k.revoked);
}

/** Sliding one-minute window per key. Returns false when the key is over its limit. */
export function allowHit(keyId: string, perMinute = 60): boolean {
  const now = Date.now();
  const recent = (ws().hits.get(keyId) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= perMinute) {
    ws().hits.set(keyId, recent);
    return false;
  }
  recent.push(now);
  ws().hits.set(keyId, recent);
  return true;
}

export function addLog(entry: Omit<CallLog, "id" | "at">) {
  const log = ws().log;
  log.unshift({ id: randomUUID(), at: Date.now(), ...entry });
  if (log.length > LOG_LIMIT) log.length = LOG_LIMIT;
}

export function resetWorkspace() {
  const w = ws();
  w.balance = w.startingBalance;
  w.log = [];
  w.hits.clear();
}
