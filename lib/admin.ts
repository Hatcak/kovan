import { createHash, timingSafeEqual } from "node:crypto";

/**
 * The owner's master key. It lives only in the KOVAN_ADMIN_KEY environment
 * variable (Vercel encrypted env or .env.local), never in the repo. When it is
 * set, the panel needs a login with it and the API accepts it as a Bearer key.
 * When it is unset (local dev), the panel stays open.
 */
export const SESSION_COOKIE = "kovan_session";

export const adminKey = () => process.env.KOVAN_ADMIN_KEY?.trim() || null;

export const gateEnabled = () => adminKey() !== null;

const sha = (s: string) => createHash("sha256").update(s).digest();

/** Constant-time comparison, safe for secrets of different lengths. */
export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha(a), sha(b));
}

export function isAdminSecret(secret: string): boolean {
  const key = adminKey();
  return key !== null && safeEqual(secret, key);
}

/** Cookie value derived from the key: rotating KOVAN_ADMIN_KEY logs every session out. */
export function sessionToken(): string | null {
  const key = adminKey();
  return key ? sha(`kovan-session:${key}`).toString("hex") : null;
}

export function isValidSession(value: string | undefined): boolean {
  const token = sessionToken();
  if (token === null) return true;
  return value !== undefined && safeEqual(value, token);
}
