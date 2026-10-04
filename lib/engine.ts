import { findTool, validateInput } from "./catalog";
import { executors, UpstreamError } from "./executors";
import { addLog, ws, type ApiKey } from "./store";

export type RunResult =
  | { ok: true; status: 200; tool: string; cost: number; balance: number; ms: number; data: unknown }
  | { ok: false; status: 400 | 402 | 404 | 502; error: string; balance: number };

/**
 * The one path every call takes, whether it comes from an agent over HTTP or
 * from the panel playground: validate, check the balance, debit, call the
 * provider, refund if the provider fails, log.
 */
export async function runTool(
  toolId: string,
  rawInput: unknown,
  source: "api" | "panel",
  key: ApiKey | null,
): Promise<RunResult> {
  const w = ws();
  const tool = findTool(toolId);
  const exec = tool && executors[tool.id];
  if (!tool || !exec) return { ok: false, status: 404, error: `"${toolId}" adında bir araç yok.`, balance: w.balance };

  const parsed = validateInput(tool, rawInput);
  if (!parsed.ok) return { ok: false, status: 400, error: parsed.error, balance: w.balance };

  if (w.balance < tool.cost) {
    return { ok: false, status: 402, error: `Yetersiz kredi: bu çağrı ${tool.cost} kredi, bakiye ${w.balance}.`, balance: w.balance };
  }

  // Debit before the call so parallel requests cannot overspend; refund on failure.
  w.balance -= tool.cost;
  if (key) {
    key.calls += 1;
    key.lastUsedAt = Date.now();
  }
  const started = Date.now();
  const keyName = key?.name ?? null;

  try {
    const data = await exec(parsed.input);
    const ms = Date.now() - started;
    addLog({ tool: tool.id, cost: tool.cost, status: "ok", ms, source, keyName });
    return { ok: true, status: 200, tool: tool.id, cost: tool.cost, balance: w.balance, ms, data };
  } catch (err) {
    w.balance += tool.cost;
    const ms = Date.now() - started;
    const error =
      err instanceof UpstreamError
        ? err.message
        : err instanceof Error && err.name === "TimeoutError"
          ? "Kaynak zamanında yanıt vermedi."
          : "Kaynağa ulaşılamadı.";
    addLog({ tool: tool.id, cost: 0, status: "error", ms, source, keyName, error });
    return { ok: false, status: 502, error: `${error} Kredi iade edildi.`, balance: w.balance };
  }
}
