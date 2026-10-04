import Link from "next/link";
import { connection } from "next/server";
import { CallTable } from "@/components/call-table";
import { btn, card } from "@/components/ui";
import { ws } from "@/lib/store";
import { resetAction } from "./actions";

export default async function Overview() {
  await connection();
  const w = ws();
  const ok = w.log.filter((l) => l.status === "ok");
  const spent = ok.reduce((sum, l) => sum + l.cost, 0);
  const activeKeys = w.keys.filter((k) => !k.revoked).length;

  const byTool = new Map<string, number>();
  for (const l of ok) byTool.set(l.tool, (byTool.get(l.tool) ?? 0) + l.cost);
  const ranking = [...byTool.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const top = ranking[0]?.[1] ?? 1;

  const stats = [
    { label: "Bakiye", value: w.balance, unit: "kredi" },
    { label: "Harcanan", value: spent, unit: "kredi" },
    { label: "Başarılı çağrı", value: ok.length, unit: "" },
    { label: "Aktif anahtar", value: activeKeys, unit: "" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Genel bakış</h1>
        <form action={resetAction}>
          <button className={btn.secondary}>Bakiyeyi ve geçmişi sıfırla</button>
        </form>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-4`}>
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-1">
              <span className="tnum text-2xl font-semibold">{s.value.toLocaleString("tr-TR")}</span>{" "}
              <span className="text-sm text-muted">{s.unit}</span>
            </dd>
          </div>
        ))}
      </dl>

      {activeKeys === 0 && (
        <div className={`${card} mt-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between`}>
          <p>
            <strong>Henüz anahtarınız yok.</strong>{" "}
            <span className="text-muted">Ajanınızın Kovan&apos;ı çağırabilmesi için bir anahtar oluşturun.</span>
          </p>
          <Link href="/panel/anahtarlar" className={btn.primary}>
            Anahtar oluştur
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-8 xl:grid-cols-3">
        <section className="xl:col-span-1">
          <h2 className="text-lg font-semibold">Araç başına harcama</h2>
          {ranking.length === 0 ? (
            <p className="mt-3 text-muted">Henüz harcama yok.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {ranking.map(([tool, credits]) => (
                <li key={tool}>
                  <div className="flex justify-between text-sm">
                    <span className="tnum">{tool}</span>
                    <span className="tnum text-muted">{credits} kredi</span>
                  </div>
                  <div className="mt-1 h-2 rounded-pill bg-surface" aria-hidden="true">
                    <div className="h-2 rounded-pill bg-accent" style={{ width: `${(credits / top) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="min-w-0 xl:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Son çağrılar</h2>
            <Link href="/panel/kullanim" className="inline-flex min-h-11 items-center text-sm text-accent hover:underline">
              Tümü
            </Link>
          </div>
          <div className="mt-2">
            <CallTable rows={w.log.slice(0, 6)} empty="Henüz çağrı yok. Araçlar sayfasından birini deneyin." />
          </div>
        </section>
      </div>
    </>
  );
}
