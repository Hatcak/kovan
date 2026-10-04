import type { Metadata } from "next";
import { Playground } from "@/components/playground";

export const metadata: Metadata = { title: "Araçlar" };

export default async function ToolsPage({ searchParams }: PageProps<"/panel/araclar">) {
  const { tool } = await searchParams;
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Araçlar</h1>
      <p className="mt-2 max-w-[65ch] text-muted">
        Ajanınızın göreceği sonucu burada deneyin. Panelden yapılan çağrılar da bakiyeden düşer ve kullanım geçmişine
        yazılır.
      </p>
      <div className="mt-6">
        <Playground initialTool={typeof tool === "string" ? tool : undefined} />
      </div>
    </>
  );
}
