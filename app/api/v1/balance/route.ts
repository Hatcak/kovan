import { authenticate } from "@/lib/auth";
import { ws } from "@/lib/store";

export function GET(request: Request) {
  const auth = authenticate(request);
  if ("response" in auth) return auth.response;
  return Response.json({ balance: ws().balance, key: auth.key.name });
}
