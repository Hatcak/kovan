"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/panel/actions";
import { btn, input } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="key" className="mb-1 block text-sm font-medium">
          Ana anahtar
        </label>
        <input
          id="key"
          name="key"
          type="password"
          required
          autoComplete="current-password"
          className={input}
          aria-describedby={state.error ? "key-error" : undefined}
        />
      </div>
      {state.error && (
        <p id="key-error" role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button className={`${btn.primary} w-full`} disabled={pending}>
        {pending ? "Kontrol ediliyor" : "Giriş yap"}
      </button>
    </form>
  );
}
