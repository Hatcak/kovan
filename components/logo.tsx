import Link from "next/link";
import { site } from "@/lib/site";

/** Hexagon cell: the brand mark. Inherits the accent through currentColor. */
export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`${className} text-accent`} aria-hidden="true">
      <path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25z" fill="currentColor" />
      <path d="M16 10.2 21 13.1v5.8L16 21.8 11 18.9v-5.8z" className="fill-bg" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold text-fg">
      <LogoMark />
      <span className="text-lg tracking-tight">{site.name}</span>
    </Link>
  );
}
