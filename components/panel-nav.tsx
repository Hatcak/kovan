"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/panel", label: "Genel bakış" },
  { href: "/panel/araclar", label: "Araçlar" },
  { href: "/panel/anahtarlar", label: "Anahtarlar" },
  { href: "/panel/kullanim", label: "Kullanım" },
];

export function PanelNav() {
  const path = usePathname();
  return (
    <nav aria-label="Panel menüsü">
      <ul className="flex flex-wrap gap-1 lg:flex-col">
        {items.map((it) => {
          const active = path === it.href;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-sm px-3 text-sm transition-colors duration-150 ${
                  active ? "bg-accent-soft font-medium text-accent" : "text-muted hover:bg-surface hover:text-fg"
                }`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/dokumantasyon"
            className="flex min-h-11 items-center rounded-sm px-3 text-sm text-muted transition-colors duration-150 hover:bg-surface hover:text-fg"
          >
            Dokümantasyon
          </Link>
        </li>
      </ul>
    </nav>
  );
}
