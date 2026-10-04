"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminSecret, isValidSession, SESSION_COOKIE, sessionToken } from "@/lib/admin";
import { runTool } from "@/lib/engine";
import { createKey, resetWorkspace, revokeKey } from "@/lib/store";

/** Every panel action re-checks the session itself; the proxy only guards page navigation. */
async function requireAdmin() {
  const store = await cookies();
  if (!isValidSession(store.get(SESSION_COOKIE)?.value)) redirect("/giris");
}

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const secret = String(formData.get("key") ?? "").trim();
  const token = sessionToken();
  if (!token) redirect("/panel");
  if (!secret || !isAdminSecret(secret)) return { error: "Anahtar hatalı." };
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/panel");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/giris");
}

export type CreateKeyState = { secret?: string; name?: string; error?: string };

export async function createKeyAction(_prev: CreateKeyState, formData: FormData): Promise<CreateKeyState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Anahtara bir ad verin, örn. \"Satış ajanı\"." };
  const { key, secret } = createKey(name);
  revalidatePath("/panel", "layout");
  return { secret, name: key.name };
}

export async function revokeKeyAction(formData: FormData) {
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
  resetWorkspace();
  revalidatePath("/panel", "layout");
}
