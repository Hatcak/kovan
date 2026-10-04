"use client";

import { useActionState, useState } from "react";
import { createKeyAction, type CreateKeyState } from "@/app/panel/actions";
import { btn, input } from "./ui";

export function CreateKeyForm() {
  const [state, action, pending] = useActionState<CreateKeyState, FormData>(createKeyAction, {});
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(secret: string) {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(secret);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="space-y-4">
      <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="key-name" className="mb-1 block text-sm font-medium">
            Anahtar adı
          </label>
          <input id="key-name" name="name" maxLength={40} placeholder="Örn. Satış ajanı" className={input} />
        </div>
        <button className={btn.primary} disabled={pending}>
          {pending ? "Oluşturuluyor" : "Anahtar oluştur"}
        </button>
      </form>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.secret && (
        <div role="status" className="rounded-card border border-accent/40 bg-accent-soft p-4">
          <p className="font-medium">&quot;{state.name}&quot; anahtarı oluşturuldu.</p>
          <p className="mt-1 text-sm text-muted">
            Bu anahtar yalnızca şimdi gösteriliyor. Kopyalayıp ajanınızın ortam değişkenine (örn.{" "}
            <code className="tnum">KOVAN_API_KEY</code>) koyun; koda ya da GitHub&apos;a yazmayın.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <code className="tnum min-w-0 flex-1 break-all rounded-sm border border-border bg-bg px-3 py-2 text-sm">
              {state.secret}
            </code>
            <button type="button" onClick={() => copy(state.secret!)} className={btn.secondary}>
              {copied === state.secret ? "Kopyalandı" : "Kopyala"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
