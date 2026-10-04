import { comingSoon, tools } from "@/lib/catalog";

/** Public catalog: agents read this to discover what they can call. */
export function GET() {
  return Response.json({
    tools: tools.map(({ id, name, category, provider, description, cost, params }) => ({
      id,
      name,
      category,
      provider,
      description,
      cost,
      params: params.map(({ name, required, example, hint }) => ({ name, required, example, hint })),
    })),
    comingSoon,
  });
}
