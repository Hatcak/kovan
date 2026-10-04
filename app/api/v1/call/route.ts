import { authenticate } from "@/lib/auth";
import { runTool } from "@/lib/engine";
import { allowHit } from "@/lib/store";

/** POST { "tool": "weather.current", "input": { "city": "Ankara" } } */
export async function POST(request: Request) {
  const auth = authenticate(request);
  if ("response" in auth) return auth.response;

  if (!allowHit(auth.key.id)) {
    return Response.json({ error: "Dakikada en fazla 60 çağrı. Biraz bekleyin." }, { status: 429 });
  }

  let body: { tool?: unknown; input?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Gövde geçerli JSON olmalı." }, { status: 400 });
  }
  if (typeof body.tool !== "string") {
    return Response.json({ error: '"tool" alanı zorunlu, örn. "weather.current".' }, { status: 400 });
  }

  const result = await runTool(body.tool, body.input, "api", auth.key);
  if (!result.ok) {
    return Response.json({ error: result.error, balance: result.balance }, { status: result.status });
  }
  const { tool, cost, balance, ms, data } = result;
  return Response.json({ tool, cost, balance, ms, data });
}
