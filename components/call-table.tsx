import type { CallLog } from "@/lib/store";
import { Pill } from "./ui";

const fmt = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });

export function CallTable({ rows, empty }: { rows: CallLog[]; empty: string }) {
  if (rows.length === 0) return <p className="rounded-card border border-dashed border-border-strong p-6 text-center text-muted">{empty}</p>;
  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="bg-surface text-muted">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">Zaman</th>
            <th scope="col" className="px-4 py-2 font-medium">Araç</th>
            <th scope="col" className="px-4 py-2 font-medium">Kaynak</th>
            <th scope="col" className="px-4 py-2 font-medium">Durum</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Süre</th>
            <th scope="col" className="px-4 py-2 text-right font-medium">Kredi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border">
              <td className="tnum whitespace-nowrap px-4 py-2 text-muted">{fmt.format(r.at)}</td>
              <td className="tnum px-4 py-2">{r.tool}</td>
              <td className="px-4 py-2 text-muted">{r.source === "panel" ? "Panel" : r.keyName ?? "API"}</td>
              <td className="px-4 py-2">
                {r.status === "ok" ? (
                  <Pill tone="accent">Başarılı</Pill>
                ) : (
                  <span title={r.error}>
                    <Pill tone="danger">Hata, iade</Pill>
                  </span>
                )}
              </td>
              <td className="tnum px-4 py-2 text-right text-muted">{r.ms} ms</td>
              <td className="tnum px-4 py-2 text-right">{r.cost > 0 ? `-${r.cost}` : "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
