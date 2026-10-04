"use server";

import { revalidatePath } from "next/cache";
import { runTool } from "@/lib/engine";
import { createKey, resetWorkspace, revokeKey } from "@/lib/store";

export type CreateKeyState = { secret?: string; name?: string; error?: string };

export async function createKeyAction(_prev: CreateKeyState, formData: FormData): Promise<CreateKeyState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Anahtara bir ad verin, örn. \"Satış ajanı\"." };
  const { key, secret } = createKey(name);
  revalidatePath("/panel", "layout");
  return { secret, name: key.name };
}

export async function revokeKeyAction(formData: FormData) {
  revokeKey(String(formData.get("id") ?? ""));
  revalidatePath("/panel", "layout");
}

export type PlaygroundState = {
  ok?: boolean;
  status?: number;
  cost?: number;
  ms?: number;
  body?: string;
  error?: string;
};

export async function runPlaygroundAction(_prev: PlaygroundState, formData: FormData): Promise<PlaygroundState> {
  const toolId = String(formData.get("tool") ?? "");
  const input: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("in.") && typeof v === "string") input[k.slice(3)] = v;
  }
  const result = await runTool(toolId, input, "panel", null);
  revalidatePath("/panel", "layout");
  if (!result.ok) return { ok: false, status: result.status, error: result.error };
  return { ok: true, status: 200, cost: result.cost, ms: result.ms, body: JSON.stringify(result.data, null, 2) };
}

export async function resetAction() {
  resetWorkspace();
  revalidatePath("/panel", "layout");
}
