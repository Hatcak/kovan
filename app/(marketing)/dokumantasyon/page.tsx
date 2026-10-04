import type { Metadata } from "next";
import { Code } from "@/components/ui";
import { tools } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dokümantasyon",
  description: "Kovan API: kimlik doğrulama, araç kataloğu, çağrı uç noktası, hata kodları ve örnek kodlar.",
  alternates: { canonical: "/dokumantasyon" },
  openGraph: { title: "Kovan API dokümantasyonu", url: "/dokumantasyon" },
};

const base = `${site.url}/api/v1`;

const errors: [string, string][] = [
  ["400", "Eksik ya da hatalı parametre. Kredi düşmez."],
  ["401", "Anahtar yok, geçersiz ya da iptal edilmiş."],
  ["402", "Bakiye bu çağrı için yetersiz."],
  ["404", "Böyle bir araç yok."],
  ["429", "Anahtar başına dakikada 60 çağrı sınırı aşıldı."],
  ["502", "Kaynak hata verdi ya da zaman aşımına uğradı. Kredi iade edilir."],
];

const js = `const res = await fetch("${base}/call", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.KOVAN_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ tool: "fx.rates", input: { base: "USD", symbols: "TRY" } }),
});
const { data, balance } = await res.json();`;

const py = `import os, requests

r = requests.post(
    "${base}/call",
    headers={"Authorization": f"Bearer {os.environ['KOVAN_API_KEY']}"},
    json={"tool": "github.repo", "input": {"repo": "vercel/next.js"}},
)
print(r.json()["data"])`;

export default function Docs() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Dokümantasyon</h1>
      <p className="mt-3 max-w-[65ch] text-lg text-muted">
        Üç uç nokta var: kataloğu okumak, aracı çağırmak ve bakiyeyi sorgulamak. Hepsi JSON konuşur.
      </p>

      <h2 className="mt-12 text-xl font-semibold">Kimlik doğrulama</h2>
      <p className="mt-2 max-w-[65ch] text-muted">
        Panelin <strong className="text-fg">Anahtarlar</strong> sayfasından bir anahtar oluşturun ve her isteğe{" "}
        <code className="tnum text-fg">Authorization: Bearer kv_live_…</code> başlığını ekleyin. Anahtarı koda
        yazmayın; ortam değişkeninde tutun.
      </p>

      <h2 className="mt-12 text-xl font-semibold">Uç noktalar</h2>
      <div className="mt-4 space-y-6">
        <div>
          <h3 className="tnum font-semibold">GET /api/v1/tools</h3>
          <p className="mt-1 text-muted">Araç kataloğu. Anahtar gerekmez. Ajanınız buradan araçları ve parametrelerini öğrenir.</p>
        </div>
        <div>
          <h3 className="tnum font-semibold">POST /api/v1/call</h3>
          <p className="mt-1 text-muted">
            Gövde: <code className="tnum text-fg">{`{ "tool": "<id>", "input": { ... } }`}</code>. Yanıt:{" "}
            <code className="tnum text-fg">tool, cost, balance, ms, data</code>.
          </p>
        </div>
        <div>
          <h3 className="tnum font-semibold">GET /api/v1/balance</h3>
          <p className="mt-1 text-muted">Kalan kredi.</p>
        </div>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Örnekler</h2>
      <div className="mt-4 space-y-4">
        <Code label="JavaScript">{js}</Code>
        <Code label="Python">{py}</Code>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Araçlar</h2>
      <div className="mt-4 space-y-4">
        {tools.map((t) => (
          <section key={t.id} className="rounded-card border border-border p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="tnum font-semibold">{t.id}</h3>
              <span className="tnum text-sm text-accent">{t.cost} kredi</span>
            </div>
            <p className="mt-1 text-sm text-muted">{t.description}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {t.params.map((p) => (
                <li key={p.name}>
                  <code className="tnum">{p.name}</code>
                  <span className="text-muted">
                    {p.required ? " (zorunlu)" : " (isteğe bağlı)"}: {p.hint}. Örnek: {p.example}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold">Hata kodları</h2>
      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th scope="col" className="py-2 pr-4 font-medium">Kod</th>
            <th scope="col" className="py-2 font-medium">Anlamı</th>
          </tr>
        </thead>
        <tbody>
          {errors.map(([code, meaning]) => (
            <tr key={code} className="border-b border-border">
              <td className="tnum py-2 pr-4">{code}</td>
              <td className="py-2 text-muted">{meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
