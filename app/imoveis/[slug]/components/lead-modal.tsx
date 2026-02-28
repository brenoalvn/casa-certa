"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/client";

type LeadModalProps = {
  open: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    slug: string;
  };
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Erro desconhecido";
  }
}

export function LeadModal({ open, onClose, property }: LeadModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!open) return;
    setMsg("");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("Enviando...");

    try {
      const payload = {
        property_id: property.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim() || null,
        // status: "novo" // opcional (sua tabela já coloca default 'novo')
      };

      const { error } = await supabase.from("leads").insert(payload);
      if (error) throw new Error(error.message);

      setMsg("Enviado ✅ Em breve entraremos em contato.");
      reset();

      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setMsg(`Erro: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* backdrop */}
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* modal */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">Solicitar detalhes</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Interesse em: <span className="font-medium">{property.title}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Telefone / WhatsApp</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(67) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mensagem (opcional)</label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2 min-h-[110px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Gostaria de mais informações sobre..."
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Solicitar detalhes"}
          </button>

          {msg && <p className="text-sm text-zinc-600">{msg}</p>}
        </form>
      </div>
    </div>
  );
}