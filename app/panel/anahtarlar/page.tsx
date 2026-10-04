import type { Metadata } from "next";
import { connection } from "next/server";
import { CreateKeyForm } from "@/components/create-key-form";
import { btn, card, Pill } from "@/components/ui";
import { gateEnabled } from "@/lib/admin";
import { ws } from "@/lib/store";
import { revokeKeyAction } from "../actions";

export const metadata: Metadata = { title: "Anahtarlar" };

const fmt = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function Keys() {
  await connection();
  const { keys } = ws();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Anahtarlar</h1>
      <p className="mt-2 max-w-[65ch] text-muted">
        Her ajana ayrı anahtar verin; biri sızarsa sadece onu iptal edersiniz. Anahtarın kendisi saklanmaz, yalnızca
        özeti tutulur.
      </p>

      {gateEnabled() && (
        <p className="mt-4 max-w-[65ch] rounded-sm border border-accent/40 bg-accent-soft px-4 py-3 text-sm">
          <strong>Ana anahtarınız</strong> sunucuda <code className="tnum">KOVAN_ADMIN_KEY</code> olarak gizli
          duruyor ve API&apos;de her zaman çalışır. Kodda ya da GitHub&apos;da yer almaz.
        </p>
      )}

      <section className={`${card} mt-6 p-5`}>
        <h2 className="sr-only">Yeni anahtar</h2>
        <CreateKeyForm />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Anahtar listesi</h2>
        {keys.length === 0 ? (
          <p className="mt-3 text-muted">Henüz anahtar yok.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-card border border-border">
            {keys.map((k) => (
              <li key={k.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {k.name} {k.revoked ? <Pill tone="danger">İptal edildi</Pill> : <Pill tone="accent">Aktif</Pill>}
                  </p>
                  <p className="tnum mt-1 break-all text-sm text-muted">{k.preview}</p>
                  <p className="mt-1 text-xs text-muted">
                    Oluşturma {fmt.format(k.createdAt)} · <span className="tnum">{k.calls}</span> çağrı · Son kullanım{" "}
                    {k.lastUsedAt ? fmt.format(k.lastUsedAt) : "yok"}
                  </p>
                </div>
                {!k.revoked && (
                  <form action={revokeKeyAction}>
                    <input type="hidden" name="id" value={k.id} />
                    <button className={btn.danger} aria-label={`${k.name} anahtarını iptal et`}>
                      İptal et
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
