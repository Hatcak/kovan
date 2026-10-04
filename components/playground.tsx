"use client";

import { useActionState, useState } from "react";
import { runPlaygroundAction, type PlaygroundState } from "@/app/panel/actions";
import { tools } from "@/lib/catalog";
import { btn, card, input } from "./ui";

export function Playground({ initialTool }: { initialTool?: string }) {
  const [toolId, setToolId] = useState(tools.some((t) => t.id === initialTool) ? initialTool! : tools[0].id);
  const [state, action, pending] = useActionState<PlaygroundState, FormData>(runPlaygroundAction, {});
  const tool = tools.find((t) => t.id === toolId)!;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={action} className={`${card} space-y-4 p-5`}>
        <div>
          <label htmlFor="tool" className="mb-1 block text-sm font-medium">
            Araç
          </label>
          <select id="tool" name="tool" value={toolId} onChange={(e) => setToolId(e.target.value)} className={input}>
            {tools.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.cost} kredi)
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-muted">{tool.description}</p>
        </div>
        {/* key resets the fields to the new tool's examples when the tool changes */}
        <div key={tool.id} className="space-y-4">
          {tool.params.map((p) => (
            <div key={p.name}>
              <label htmlFor={`in-${p.name}`} className="mb-1 block text-sm font-medium">
                {p.label} {p.required ? "" : <span className="font-normal text-muted">(isteğe bağlı)</span>}
              </label>
              <input
                id={`in-${p.name}`}
                name={`in.${p.name}`}
                defaultValue={p.example}
                required={p.required}
                maxLength={200}
                className={input}
                aria-describedby={`hint-${p.name}`}
              />
              <p id={`hint-${p.name}`} className="mt-1 text-xs text-muted">
                {p.hint}
              </p>
            </div>
          ))}
        </div>
        <button className={`${btn.primary} w-full`} disabled={pending}>
          {pending ? "Çalışıyor" : `Çalıştır (${tool.cost} kredi)`}
        </button>
      </form>

      <section aria-live="polite" className="min-w-0">
        <h2 className="text-lg font-semibold">Sonuç</h2>
        {state.status === undefined ? (
          <p className="mt-3 rounded-card border border-dashed border-border-strong p-6 text-center text-muted">
            Bir araç seçip çalıştırın. Sonuç burada görünecek.
          </p>
        ) : state.ok ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-muted">
              <span className="tnum">{state.cost}</span> kredi düştü · <span className="tnum">{state.ms}</span> ms
            </p>
            <pre className="tnum max-h-[28rem] overflow-auto rounded-card bg-code-bg p-4 text-sm text-code-fg">
              {state.body}
            </pre>
          </div>
        ) : (
          <p role="alert" className="mt-3 rounded-card border border-danger/40 p-4 text-danger">
            <span className="tnum">{state.status}</span>: {state.error}
          </p>
        )}
      </section>
    </div>
  );
}
