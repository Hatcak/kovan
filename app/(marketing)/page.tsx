import Link from "next/link";
import { btn, card, Code, Pill } from "@/components/ui";
import { comingSoon, tools } from "@/lib/catalog";
import { site } from "@/lib/site";

const curl = `curl ${site.url}/api/v1/call \\
  -H "Authorization: Bearer kv_live_…" \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"weather.current","input":{"city":"Ankara"}}'`;

const reply = `{
  "tool": "weather.current",
  "cost": 1,
  "balance": 499,
  "data": { "place": "Ankara, Türkiye", "temperatureC": 14.2, ... }
}`;

const problems = [
  {
    title: "Her kaynak ayrı kayıt ister",
    body: "Hava durumu, haber, kur, kod deposu: her biri için ayrı hesap, ayrı anahtar, ayrı fatura. Ajanınız büyüdükçe bu liste uzar.",
  },
  {
    title: "Az kullanıma tam abonelik",
    body: "Ajanınız bir kaynağı ayda birkaç kez çağırıyor olabilir. Yine de aylık paketi ödersiniz.",
  },
  {
    title: "Anahtarlar her yere dağılır",
    body: "Sağlayıcı anahtarları ajan koduna, ortam dosyalarına, sohbet geçmişine sızar. Hangisinin nerede olduğunu takip etmek zorlaşır.",
  },
];

const steps = [
  {
    n: "1",
    title: "Anahtar oluştur",
    body: "Panelden bir Kovan anahtarı oluşturun. Anahtar yalnızca bir kez gösterilir, biz sadece özetini (hash) saklarız.",
  },
  {
    n: "2",
    title: "Ajan aracı seçer",
    body: "Ajanınız /api/v1/tools adresinden kataloğu okur, ihtiyacı olan aracı ve parametrelerini öğrenir.",
  },
  {
    n: "3",
    title: "Çağırır, kredi düşer",
    body: "Tek bir uç noktaya istek atar, düzenli JSON döner. Kaynak hata verirse kredi otomatik iade edilir.",
  },
];

const faqs = [
  {
    q: "Ödeme alıyor musunuz?",
    a: "Henüz hayır. Bu sürüm deneme bakiyesiyle çalışır; kredi satın alma özelliği yakında eklenecek.",
  },
  {
    q: "Sağlayıcı anahtarlarım ajanıma görünür mü?",
    a: "Hayır. Sağlayıcı anahtarları yalnızca sunucuda durur. Ajan sadece kendi Kovan anahtarını ve sonucu görür.",
  },
  {
    q: "Kaynak hata verirse ne olur?",
    a: "Çağrı başarısız olursa düşülen kredi aynı anda iade edilir ve kullanım geçmişinde hata olarak görünür.",
  },
  {
    q: "Bir dakikada kaç çağrı yapabilirim?",
    a: "Anahtar başına dakikada 60 çağrı. Sınırı aşan istek 429 yanıtı alır.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-20">
        <div>
          <Pill tone="accent">Yapay zekâ ajanları için</Pill>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ajanlarınız için tek API cüzdanı.
          </h1>
          <p className="mt-4 max-w-[65ch] text-lg text-muted">
            Kovan, ajanınızı tek bir anahtarla birçok veri kaynağına bağlar. Ayrı kayıt, ayrı abonelik, ayrı anahtar
            yok: ajan aracı çağırır, kullandığı kadar kredi düşer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/panel" className={btn.primary}>
              Panele git
            </Link>
            <Link href="/dokumantasyon" className={btn.secondary}>
              Dokümantasyonu oku
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            <span className="tnum">{tools.length}</span> araç şu an çalışıyor. Deneme bakiyesi:{" "}
            <span className="tnum">500</span> kredi.
          </p>
        </div>
        <div className="min-w-0 space-y-3">
          <Code label="İstek">{curl}</Code>
          <Code label="Yanıt">{reply}</Code>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Her veri kaynağı ayrı bir dert</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {problems.map((p) => (
              <div key={p.title} className={`${card} p-6`}>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nasil" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Nasıl çalışır</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n}>
              <span className="tnum flex size-9 items-center justify-center rounded-pill bg-accent-soft font-semibold text-accent">
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="araclar" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Araç kataloğu</h2>
          <p className="mt-2 max-w-[65ch] text-muted">
            Aşağıdaki araçlar bugün çalışıyor. Fiyatlar çağrı başına kredidir; başarısız çağrı ücretlendirilmez.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <li key={t.id} className={`${card} flex flex-col p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{t.name}</h3>
                  <span className="tnum shrink-0 text-sm text-accent">{t.cost} kredi</span>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted">{t.description}</p>
                <p className="mt-3 text-xs text-muted">
                  <span className="tnum">{t.id}</span> · {t.provider}
                </p>
              </li>
            ))}
          </ul>
          <h3 className="mt-12 font-semibold">Yakında</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {comingSoon.map((c) => (
              <li key={c}>
                <Pill>{c}</Pill>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="guvenlik" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Anahtarlar gizli kalır</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          <li>
            <h3 className="font-semibold">Sağlayıcı anahtarları sunucuda</h3>
            <p className="mt-1 text-muted">
              Kaynaklara giden anahtarlar sadece sunucu ortam değişkenlerinde durur. Tarayıcıya, ajana ya da koda hiç
              gitmez.
            </p>
          </li>
          <li>
            <h3 className="font-semibold">Kovan anahtarı bir kez gösterilir</h3>
            <p className="mt-1 text-muted">
              Anahtarın kendisini saklamayız, yalnızca SHA-256 özetini tutarız. Panelde sadece ilk ve son karakterler
              görünür.
            </p>
          </li>
          <li>
            <h3 className="font-semibold">Tek tıkla iptal</h3>
            <p className="mt-1 text-muted">
              Sızdığından şüphelendiğiniz anahtarı panelden iptal edin; sonraki istek anında reddedilir.
            </p>
          </li>
        </ul>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Sık sorulanlar</h2>
          <dl className="mt-8 divide-y divide-border">
            {faqs.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1 text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">İlk çağrınızı bir dakikada yapın</h2>
        <p className="mx-auto mt-2 max-w-[65ch] text-muted">Panelden anahtar oluşturun ya da araçları doğrudan panelde deneyin.</p>
        <Link href="/panel/anahtarlar" className={`${btn.primary} mt-6`}>
          Anahtar oluştur
        </Link>
      </section>
    </>
  );
}
