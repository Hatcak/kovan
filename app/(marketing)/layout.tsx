import Link from "next/link";
import { Logo } from "@/components/logo";
import { btn } from "@/components/ui";
import { site } from "@/lib/site";

const links = [
  { href: "/#araclar", label: "Araçlar" },
  { href: "/#nasil", label: "Nasıl çalışır" },
  { href: "/#guvenlik", label: "Güvenlik" },
  { href: "/dokumantasyon", label: "Dokümantasyon" },
];

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#icerik" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-bg focus:p-2">
        İçeriğe geç
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <Logo />
          <nav aria-label="Ana menü" className="flex items-center gap-1">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${i < 3 ? "hidden md:inline-flex" : "hidden sm:inline-flex"} min-h-11 items-center rounded-sm px-3 text-sm text-muted hover:text-fg`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/panel" className={`${btn.primary} ml-2`}>
              Panele git
            </Link>
          </nav>
        </div>
      </header>
      <main id="icerik" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {site.name}: {site.tagline}.
          </p>
          <nav aria-label="Alt menü" className="flex flex-wrap gap-x-4">
            <Link href="/dokumantasyon" className="inline-flex min-h-11 items-center hover:text-fg">
              Dokümantasyon
            </Link>
            <Link href="/panel" className="inline-flex min-h-11 items-center hover:text-fg">
              Panel
            </Link>
            <a href={site.repo} className="inline-flex min-h-11 items-center hover:text-fg">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
