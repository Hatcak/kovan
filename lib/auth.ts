import { findKeyBySecret, type ApiKey } from "./store";

const json = (status: number, error: string) => Response.json({ error }, { status });

/** Reads `Authorization: Bearer kv_live_…` and resolves it to a live key, or an error response. */
export function authenticate(request: Request): { key: ApiKey } | { response: Response } {
  const header = request.headers.get("authorization") ?? "";
  const secret = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (!secret) return { response: json(401, "Authorization: Bearer <anahtar> başlığı eksik.") };
  const key = findKeyBySecret(secret);
  if (!key) return { response: json(401, "Anahtar geçersiz ya da iptal edilmiş.") };
  return { key };
}
