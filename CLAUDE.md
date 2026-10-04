@AGENTS.md

# Kovan

A Monid-style "API wallet for AI agents": one Kovan key, many data tools, per-call credits.
Next.js 16 App Router, React 19, Tailwind v4. UI copy is Turkish only (`<html lang="tr">`).

- Every call (HTTP or panel playground) goes through `runTool` in `lib/engine.ts`: validate, debit, call,
  refund on failure, log. Do not add a second path.
- Adding a tool = an entry in `lib/catalog.ts` + an executor with the same id in `lib/executors.ts`.
- `lib/catalog.ts` is imported by client components: keep it metadata-only, no secrets, no node imports.
- Provider secrets live only in `.env.local` and are read in `lib/executors.ts`. Never `NEXT_PUBLIC_` them.
- `lib/store.ts` is in-memory demo storage; it resets on restart.
- Design: one green accent (`--color-accent`), tokens only in `app/globals.css`, numbers/keys/code use `.tnum`.
- Content honesty: no price or buy button on anything not built; unbuilt sources go in `comingSoon`. No em dash.
