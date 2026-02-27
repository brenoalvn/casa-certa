"use client";

import { supabase } from "@/lib/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Entrando...");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMsg(`Erro: ${error.message}`);
      return;
    }

    setMsg("OK ✅");
router.replace("/admin/imoveis");
router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#faf7f2] px-6">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Admin — Casa Certa</h1>
        <p className="text-sm text-zinc-500 mt-1">Acesso restrito.</p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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