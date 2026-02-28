"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";

export function LoginClient() {
  const searchParams = useSearchParams();

  const returnToParam = searchParams.get("returnTo") || "/admin";
  const returnTo = returnToParam.startsWith("/admin") ? returnToParam : "/admin";

  const [msg, setMsg] = useState<string>("");

  async function onSubmit(formData: FormData) {
    setMsg("Entrando...");
    const res = await loginAction(formData);

    if (!res.ok) {
      setMsg(`Erro: ${res.message}`);
      return;
    }

    setMsg("OK ✅");
    window.location.assign(returnTo);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf7f2] px-6">
      <form
        action={onSubmit}
        className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Admin — Casa Certa</h1>
        <p className="text-sm text-zinc-500 mt-1">Acesso restrito.</p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-md border px-3 py-2"
            name="email"
            placeholder="E-mail"
            type="email"
            required
          />
          <input
            className="w-full rounded-md border px-3 py-2"
            name="password"
            placeholder="Senha"
            type="password"
            required
          />

          <button className="w-full rounded-md bg-emerald-700 text-white py-2 hover:bg-emerald-800">
            Entrar
          </button>

          {msg && <p className="text-sm mt-2 text-zinc-600">{msg}</p>}
        </div>
      </form>
    </main>
  );
}