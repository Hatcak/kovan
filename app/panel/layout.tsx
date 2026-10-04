import type { Metadata } from "next";
import { connection } from "next/server";
import { Logo } from "@/components/logo";
import { PanelNav } from "@/components/panel-nav";
import { gateEnabled } from "@/lib/admin";
import { ws } from "@/lib/store";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Kovan paneli" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: LayoutProps<"/panel">) {
  await connection();
  const { balance } = ws();
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="border-b border-border bg-surface px-4 py-3 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r lg:py-5">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Logo />
          <p className="text-sm text-muted lg:mt-6 lg:rounded-card lg:border lg:border-border lg:bg-bg lg:p-3">
            <span className="lg:block">Bakiye</span>{" "}
            <span className="tnum text-base font-semibold text-fg lg:text-lg">{balance.toLocaleString("tr-TR")}</span>{" "}
            <span className="lg:hidden">kredi</span>
            <span className="hidden text-xs lg:block">kredi</span>
          </p>
        </div>
        <div className="mt-3 lg:mt-6">
          <PanelNav />
        </div>
        {gateEnabled() && (
          <form action={logoutAction} className="mt-1 lg:mt-4">
            <button className="flex min-h-11 items-center rounded-sm px-3 text-sm text-muted transition-colors duration-150 hover:bg-bg hover:text-fg">
              Çıkış yap
            </button>
          </form>
        )}
      </aside>
      <main id="icerik" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mb-6 rounded-sm border border-border bg-surface px-4 py-3 text-sm text-muted">
          Demo modu: bakiye, panel anahtarları ve geçmiş sunucu belleğinde tutulur; sunucu yeniden başlarsa
          sıfırlanır. Kalıcı erişim için ana anahtarınızı kullanın. Kredi satın alma yakında.
        </div>
        {children}
      </main>
    </div>
  );
}
