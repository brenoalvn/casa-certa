"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import type { PostgrestError } from "@supabase/supabase-js";

type PropertyRow = {
  id: string | number;
  title?: string | null;
  slug?: string | null;
  price?: number | null;
  purpose?: string | null;
  created_at?: string | null;
};

type DebugState = {
  data: PropertyRow[] | null;
  error: PostgrestError | null;
};

export default function DevPage() {
  const [mensagem, setMensagem] = useState<string>("");
  const [debug, setDebug] = useState<DebugState | null>(null);

  const testarSupabase = async () => {
    setMensagem("Testando...");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .limit(5);

    setDebug({ data: (data as PropertyRow[]) ?? null, error });

    if (error) {
      setMensagem(`Erro: ${error.message} ❌`);
      return;
    }

    if (!data || data.length === 0) {
      setMensagem("Conectou ✅ mas não encontrou registros em properties.");
      return;
    }

    setMensagem(`Conectado ✅ Registros encontrados: ${data.length}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-100 px-6">
      <h1 className="text-4xl font-bold mb-6">🏠 Casa Certa (DEV)</h1>

      <button
        onClick={testarSupabase}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Testar tabela properties
      </button>

      {mensagem && <p className="mt-4 text-lg">{mensagem}</p>}

      {debug?.data && (
        <pre className="mt-6 w-full max-w-3xl overflow-auto rounded-lg border border-zinc-200 bg-zinc-900 p-4 text-sm text-zinc-100 shadow">
          {JSON.stringify(debug.data, null, 2)}
        </pre>
      )}

      {debug?.error && (
        <pre className="mt-6 w-full max-w-3xl overflow-auto rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {JSON.stringify(debug.error, null, 2)}
        </pre>
      )}
    </div>
  );
}