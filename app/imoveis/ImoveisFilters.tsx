"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Opt = { value: string; label: string };

export default function ImoveisFilters({
  initial,
  typeOptions,
  purposeOptions,
}: {
  initial: { q: string; type: string; purpose: string; sort: string };
  typeOptions: Opt[];
  purposeOptions: Opt[];
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(initial.q);
  const [type, setType] = useState(initial.type);
  const [purpose, setPurpose] = useState(initial.purpose);
  const [sort, setSort] = useState(initial.sort);

  const sortOptions: Opt[] = useMemo(
    () => [
      { value: "recent", label: "Mais recentes" },
      { value: "price_asc", label: "Menor preço" },
      { value: "price_desc", label: "Maior preço" },
    ],
    []
  );

  function apply(next?: Partial<typeof initial>) {
    const params = new URLSearchParams(sp.toString());

    const nq = (next?.q ?? q).trim();
    const nt = next?.type ?? type;
    const np = next?.purpose ?? purpose;
    const ns = next?.sort ?? sort;

    // zera e seta
    params.delete("q");
    params.delete("type");
    params.delete("purpose");
    params.delete("sort");

    if (nq) params.set("q", nq);
    if (nt && nt !== "all") params.set("type", nt);
    if (np && np !== "all") params.set("purpose", np);
    if (ns && ns !== "recent") params.set("sort", ns);

    const qs = params.toString();
    router.push(qs ? `/imoveis?${qs}` : "/imoveis");
  }

  function clear() {
    setQ("");
    setType("all");
    setPurpose("all");
    setSort("recent");
    router.push("/imoveis");
  }

  return (
    <section className="rounded-2xl border bg-white/70 p-4 backdrop-blur">
      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        {/* Busca */}
        <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
          <span className="text-zinc-400">🔎</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply({ q })}
            placeholder="Buscar por título, cidade..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {/* Tipo */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            apply({ type: e.target.value });
          }}
          className="h-10 rounded-xl border bg-white px-3 text-sm"
        >
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Finalidade */}
        <select
          value={purpose}
          onChange={(e) => {
            setPurpose(e.target.value);
            apply({ purpose: e.target.value });
          }}
          className="h-10 rounded-xl border bg-white px-3 text-sm"
        >
          {purposeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Ordenação */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            apply({ sort: e.target.value });
          }}
          className="h-10 rounded-xl border bg-white px-3 text-sm"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => apply({ q })}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Buscar
        </button>
        <button
          onClick={clear}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
        >
          Limpar
        </button>
      </div>
    </section>
  );
}