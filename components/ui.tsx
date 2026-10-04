import type { ReactNode } from "react";

/** Shared class strings so buttons and cards look the same everywhere. */
export const btn = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 text-sm font-medium text-accent-fg transition-colors duration-150 hover:bg-accent-hover disabled:opacity-60",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-border-strong px-5 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface disabled:opacity-60",
  danger:
    "inline-flex min-h-11 items-center justify-center rounded-sm px-3 text-sm font-medium text-danger transition-colors duration-150 hover:bg-surface",
};

export const card = "rounded-card border border-border bg-bg shadow-card";

export const input =
  "min-h-11 w-full rounded-sm border border-border-strong bg-bg px-3 text-base text-fg placeholder:text-muted";

export function Code({ children, label }: { children: string; label?: string }) {
  return (
    <figure className="overflow-hidden rounded-card bg-code-bg">
      {label && (
        <figcaption className="border-b border-code-muted/30 px-4 py-2 text-xs text-code-muted">{label}</figcaption>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-code-fg">
        <code className="tnum">{children}</code>
      </pre>
    </figure>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "danger" }) {
  const tones = {
    neutral: "border-border text-muted",
    accent: "border-accent/40 bg-accent-soft text-accent",
    danger: "border-danger/40 text-danger",
  };
  return (
    <span className={`inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
